from glob import glob
import numpy as np
from PIL import Image
import torch
from src.nets.MobileNetV2_unet import MobileNetV2_unet
from torchvision import transforms
import torch.nn.functional as F
import torch.nn as nn


num_steps                  = 100
w_avg_samples              = 10000
initial_learning_rate      = 0.1
initial_noise_factor       = 0.05
lr_rampdown_length         = 0.25
lr_rampup_length           = 0.05
noise_ramp_length          = 0.75
regularize_noise_weight    = 1e5
FACE = 2
HAIR = 1
BACKGROUND = 0


# load pre-trained model and weights
def load_model():
    model = MobileNetV2_unet(None).to(torch.device("cuda"))
    state_dict = torch.load('./src/checkpoints/model.pt', map_location='cuda')
    model.load_state_dict(state_dict)
    model.eval()
    return model

def compute_w_stats(G, device):
    # Compute w stats.
    z_samples = np.random.RandomState(123).randn(w_avg_samples, G.z_dim)
    w_samples = G.mapping(torch.from_numpy(z_samples).to(device), None)  # [N, L, C]
    w_samples = w_samples[:, :1, :].cpu().numpy().astype(np.float32)       # [N, 1, C]
    w_avg = np.mean(w_samples, axis=0, keepdims=True)      # [1, 1, C]
    w_std = (np.sum((w_samples - w_avg) ** 2) / w_avg_samples) ** 0.5
    return w_avg, w_std

def create_segmentation_mask(model, image):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])
    image = transform(image).unsqueeze(0)
    image = image.to(torch.device("cuda"))
    logits = model(image)
    mask = torch.softmax(logits, dim=1)
    return logits

import matplotlib.pyplot as plt

def custom_loss_builder(target_mask, model):
    class CustomLoss(nn.Module):
        def __init__(self):
            super(CustomLoss, self).__init__()

        def forward(self, output):
            #scale output to 224x224
            output.squeeze(0)
            output = F.interpolate(output, size=(224, 224), mode='bilinear', align_corners=False)
            logits = model(output)
            mask = torch.softmax(logits, dim=1)


            #replace nan for background
            mask = torch.where(torch.isnan(mask), torch.full_like(mask,0 ), mask)
            abs = torch.abs(mask.squeeze(0) - target_mask.squeeze(0))
            
            #downscale hair and face difference to 0.2
            abs[HAIR] = abs[HAIR] * 0.2
            abs[FACE] = abs[FACE] * 0.2
            dist = torch.sum(abs)



            return dist
    return CustomLoss()

def face_frame_correction(target_image, latent_code, G, device):
    model = load_model()
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])

    w_avg, w_std = compute_w_stats(G, device)    

     # Setup noise inputs.
    noise_bufs = { name: buf for (name, buf) in G.synthesis.named_buffers() if 'noise_const' in name }

    w_opt = torch.tensor(w_avg, dtype=torch.float32, device=device, requires_grad=True) # pylint: disable=not-callable
    w_out = torch.zeros([num_steps] + list(w_opt.shape[1:]), dtype=torch.float32, device=device)
    optimizer = torch.optim.Adam([w_opt] + list(noise_bufs.values()), betas=(0.9, 0.999), lr=initial_learning_rate)

    # Init noise.
    for buf in noise_bufs.values():
        buf[:] = torch.randn_like(buf)
        buf.requires_grad = True

    target_mask = create_segmentation_mask(model, target_image)

    #define loss function


    loss_fn = custom_loss_builder(target_mask, model)

    for step in range(num_steps):
        # Learning rate schedule.
        t = step / num_steps
        w_noise_scale = w_std * initial_noise_factor * max(0.0, 1.0 - t / noise_ramp_length) ** 2
        lr_ramp = min(1.0, (1.0 - t) / lr_rampdown_length)
        lr_ramp = 0.5 - 0.5 * np.cos(lr_ramp * np.pi)
        lr_ramp = lr_ramp * min(1.0, t / lr_rampup_length)
        lr = initial_learning_rate * lr_ramp
        for param_group in optimizer.param_groups:
            param_group['lr'] = lr

        # Synth images from opt_w.
        w_noise = torch.randn_like(w_opt) * w_noise_scale
        ws = (w_opt + w_noise).repeat([1, G.mapping.num_ws, 1])
        synth_images = G.synthesis(ws, noise_mode='const')

        dist = loss_fn(synth_images)

        # Noise regularization.
        reg_loss = 0.0
        for v in noise_bufs.values():
            noise = v[None,None,:,:] # must be [1,1,H,W] for F.avg_pool2d()
            while True:
                reg_loss += (noise*torch.roll(noise, shifts=1, dims=3)).mean()**2
                reg_loss += (noise*torch.roll(noise, shifts=1, dims=2)).mean()**2
                if noise.shape[2] <= 8:
                    break
                noise = F.avg_pool2d(noise, kernel_size=2)
        loss = dist + reg_loss * regularize_noise_weight

        # Step
        optimizer.zero_grad(set_to_none=True)
        loss.backward(retain_graph=True)
        optimizer.step()
        print(f'step {step+1:>4d}/{num_steps}: dist {dist:<4.2f} loss {float(loss):<5.2f}')

        # Save projected W for each optimization step.
        w_out[step] = w_opt.detach()[0]

        # Normalize noise.
        with torch.no_grad():
            for buf in noise_bufs.values():
                buf -= buf.mean()
                buf *= buf.square().mean().rsqrt()

    return w_out.repeat([1, G.mapping.num_ws, 1])
