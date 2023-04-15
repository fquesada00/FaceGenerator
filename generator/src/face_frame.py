from glob import glob
import numpy as np
from PIL import Image
import torch
from src.nets.MobileNetV2_unet import MobileNetV2_unet
from torchvision import transforms
import torch.nn.functional as F
import torch.nn as nn


num_steps                  = 300
w_avg_samples              = 10000
initial_noise_factor       = 0.001
noise_ramp_length          = 1
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
    mask = torch.argmax(logits, dim=1)
    return mask


def create_segmentation_mask_from_network(model, arr):
    arr = F.interpolate(arr, size=(224, 224), mode='bilinear', align_corners=False)
    logits = model(arr)
    mask = torch.argmax(logits, dim=1)
    return mask

def custom_loss_builder(target_mask, model):
    class CustomLoss(nn.Module):
        def __init__(self):
            super(CustomLoss, self).__init__()

        def forward(self, output):
            mask = create_segmentation_mask_from_network(model, output)  
            #replace nan for background
            mask = torch.where(torch.isnan(mask), torch.full_like(mask,0 ), mask)
            scores = torch.zeros_like(mask)
            scores = torch.where((mask == FACE) & (target_mask == BACKGROUND), torch.full_like(mask, 1), scores)
            #change all scores to te format above
            scores = torch.where((mask == HAIR) & (target_mask == BACKGROUND), torch.full_like(mask, 1), scores)
            scores = torch.where((mask == BACKGROUND) & (target_mask == FACE), torch.full_like(mask, 1), scores)
            scores = torch.where((mask == BACKGROUND) & (target_mask == HAIR), torch.full_like(mask, 1), scores)

            scores = torch.where((mask == FACE) & (target_mask == HAIR), torch.full_like(mask, 0.2), scores)
            scores = torch.where((mask == HAIR) & (target_mask == FACE), torch.full_like(mask, 0.2), scores)

            return scores.sum().float()
            #abs = torch.abs(mask.squeeze(0) - target_mask.squeeze(0))
            
            #downscale hair and face difference to 0.2
            #abs[HAIR] = abs[HAIR] * 0.2
            #abs[FACE] = abs[FACE] * 0.2
            #dist = torch.sum(abs)
            #return dist.float()
        
    return CustomLoss()

def face_frame_correction(target_image, latent_code, G, device):
    model = load_model()
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])

    w_avg, w_std = compute_w_stats(G, device)    

    target_mask = create_segmentation_mask(model, target_image)

    #define loss function
    loss_fn = custom_loss_builder(target_mask, model)
    w_opt = torch.tensor(w_avg, dtype=torch.float32, device=device, requires_grad=False)
    w_out = torch.zeros([num_steps] + list(w_opt.shape[1:]), dtype=torch.float32, device=device)

    min_loss = np.inf
    output_size = 0
    for step in range(num_steps):
        # Learning rate schedule.
        t = step / num_steps
        w_noise_scale = w_std * initial_noise_factor * max(0.0, 1.0 - t / noise_ramp_length) ** 2
        
        # Synth images from opt_w.
        w_noise = torch.randn_like(w_opt) * w_noise_scale
        ws = (w_opt + w_noise).repeat([1, G.mapping.num_ws, 1])
        synth_images = G.synthesis(ws, noise_mode='const')

        dist = loss_fn(synth_images)
        loss = dist/(224*224)*100
       

        # Save projected W if it's the best so far.
        if loss < min_loss:
            min_loss = loss
            w_out[output_size] = ws.detach()[0][0] #[1, num_ws, dim_z]
            output_size += 1
            print(f'step {step+1:>4d}/{num_steps}: dist {dist:<4.2f} loss {float(loss):<5.2f}')


    #trim w_out to remove empty rows
    w_out = w_out[:output_size]
    return w_out.repeat([1, G.mapping.num_ws, 1])
