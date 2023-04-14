from glob import glob
from src.generator.align_face import align_face
import numpy as np
from PIL import Image
import torch
from src.nets.MobileNetV2_unet import MobileNetV2_unet
from torchvision import transforms


# load pre-trained model and weights
def load_model():
    model = MobileNetV2_unet(None).to(torch.device("cuda"))
    state_dict = torch.load('./src/checkpoints/model.pt', map_location='cuda')
    model.load_state_dict(state_dict)
    model.eval()
    return model

def segmentate_image(img, transform, model):
    torch_img = transform(img)
    torch_img = torch_img.unsqueeze(0)
    torch_img = torch_img.to(torch.device("cuda"))

    # Forward Pass
    logits = model(torch_img)
    mask = np.argmax(logits.data.cpu().numpy(), axis=1)
    return mask

def face_frame_variation(img1, img2, transform, model):
    segmentation_1 = segmentate_image(img1, transform, model)
    segmentation_2 = segmentate_image(img2, transform, model)
    difference_array = np.subtract(segmentation_1, segmentation_2)
    difference_array = np.abs(difference_array)
    result = len(np.where(difference_array == 2)[0])
    indexes_to_check = np.where(difference_array == 1)
    for i, j, k in zip(indexes_to_check[0], indexes_to_check[1], indexes_to_check[2]):
        classification_1 = segmentation_1[i][j][k]
        classification_2 = segmentation_2[i][j][k]
        if classification_1 == 0 or classification_2 == 0:
            result += 1
        elif (classification_1 == 1 and classification_2 == 2) or (classification_1 == 2 and classification_2 == 1):
            result += 0.2
        else:
            print(classification_1, classification_2)
    result = (result / (224*224)) * 100
    return result, segmentation_1, segmentation_2




def face_frame_correction(target_image, latent_code, G, device):
    model = load_model()
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])
    steps = 200
    initial_noise_factor = 0.2
    noise_ramp_length = 100
    batch_size = 1

    dlatent_avg = G.mapping.w_avg.unsqueeze(0).repeat(1, G.num_ws, 1)
    
    min_frame = np.inf

    latent_code = dlatent_avg
    
    latent_codes = []
    images = []
   
    for i in range(steps):
        print('Step', i, 'Frame variation', min_frame)
        
        codes = np.random.normal(size=(batch_size, G.mapping.num_ws, G.mapping.w_dim))*initial_noise_factor
        codes[:, 0:-1, :] = 0
        codes  = torch.from_numpy(codes).to(device)
        codes = codes + latent_code

        imgs = G.synthesis(codes, noise_mode='const')
        imgs = (imgs.permute(0, 2, 3, 1) * 127.5 +
                128).clamp(0, 255).to(torch.uint8)
        print('Generated images')



        for j in range(batch_size):
            code = codes[j]
            #add one dimension to the latent code
            code = code.unsqueeze(0)
            code = code.cpu().numpy()
            image = imgs[j].cpu().numpy()
            image = Image.fromarray(image)
            frame_variation, _, _ = face_frame_variation(target_image, image, transform, model)
            if frame_variation < min_frame:
                print('Correction made', frame_variation)
                min_frame = frame_variation
                latent_codes.append(code)
                images.append(image)

    return latent_codes, images
