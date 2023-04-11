import torch
import legacy
import dnnlib
from projector import project
from src.face_image import FaceImage
import pickle
from PIL import Image
import numpy as np
import Pyro4
import os
import sys
from os import getenv
from pathlib import Path
from src.face_frame import face_frame_correction

PROJECT_PATH = getenv("PROJECT_PATH")
sys.path.insert(0, PROJECT_PATH + "/generator/src/stylegan2")

os.environ["PYRO_LOGFILE"] = "pyro.log"
os.environ["PYRO_LOGLEVEL"] = "DEBUG"
from src.generator.align_face import align_face


def get_control_latent_vectors(path):
    files = [x for x in Path(path).iterdir() if str(x).endswith('.npy')]
    latent_vectors = {f.name[:-4]: np.load(f) for f in files}
    return latent_vectors

@Pyro4.expose
class Generator:
    def __init__(self, network_pkl='https://api.ngc.nvidia.com/v2/models/nvidia/research/stylegan3/versions/1/files/stylegan3-r-ffhqu-256x256.pkl'):
        self.device = torch.device('cuda')
        with dnnlib.util.open_url(network_pkl) as f:
            self.G = legacy.load_network_pkl(f)['G_ema'].to(self.device)
        self.psi = 0.7
        self.w_shape = (self.G.mapping.num_ws, self.G.mapping.w_dim)
        self.latent_vectors = get_control_latent_vectors(
            'src/generator/stylegan2directions')

    def flatten(self, w):
        return np.ravel(w).tolist()

    def unravel(self, w):
        return np.reshape(w, (1, *self.w_shape))

    def generate_random_image(self, rand_seed):
        '''returns the image and its latent code'''
        z = torch.from_numpy(np.random.RandomState(
            rand_seed).randn(1, self.G.z_dim)).to(self.device)
        w = self.G.mapping(z=z, c=None, truncation_psi=self.psi)
        random_image = self.generate_image_from_w(w)
        image = Image.fromarray(random_image)
        return FaceImage.from_image(image), self.flatten(w.cpu().numpy())

    def generate_image_from_w(self, w):
        img = self.G.synthesis(w, noise_mode='const')
        img = (img.permute(0, 2, 3, 1) * 127.5 +
               128).clamp(0, 255).to(torch.uint8)
        return img[0].cpu().numpy()

    def linear_interpolate(self, from_val, to_val, step):
        # as steps gets closer to 1, result gets closer to to_val
        return from_val * (1 - step) + to_val * step

    def generate_transition(self, w1, w2, num_interps=50):
        w1 = self.unravel(w1)
        w2 = self.unravel(w2)
        w1 = torch.from_numpy(w1).to(self.device)
        w2 = torch.from_numpy(w2).to(self.device)
        all_imgs = []
        all_ws = []

        steps = np.linspace(0, 1, num_interps + 1, endpoint=False)[1::]

        for curr_step in steps:
            interpolated_latent_code = self.linear_interpolate(
                w1, w2, curr_step)
            image = self.generate_image_from_w(interpolated_latent_code)
            interp_latent_image = Image.fromarray(image)
            interp_latent_image = FaceImage.from_image(interp_latent_image)
            all_imgs.append(interp_latent_image)
            all_ws.append(self.flatten(interpolated_latent_code.cpu().numpy()))
        return all_imgs, all_ws

    def mix_styles(self, w1, w2):
        w1 = self.unravel(w1)
        w2 = self.unravel(w2)

        w1_copy = w1.copy()
        w2_copy = w2.copy()

        for i in range(self.w_shape[0]):
            if np.random.random() > 0.5:
                w1[0][i] = w2_copy[0][i]
                w2[0][i] = w1_copy[0][i]

        w1 = torch.from_numpy(w1).to(self.device)
        w2 = torch.from_numpy(w2).to(self.device)

        image1 = Image.fromarray(self.generate_image_from_w(w1))
        image2 = Image.fromarray(self.generate_image_from_w(w2))
        image1 = FaceImage.from_image(image1)
        image2 = FaceImage.from_image(image2)
        return [image1, image2], [self.flatten(w1.cpu().numpy()), self.flatten(w2.cpu().numpy())]

    def change_features(self, w, features_amounts_dict: dict):
        w = self.unravel(w)
        for feature_name, amount in features_amounts_dict.items():
            w += self.latent_vectors[feature_name] * amount
        w = torch.from_numpy(w).to(self.device)
        image = self.generate_image_from_w(w)
        latent_img = Image.fromarray(image)
        latent_img = FaceImage.from_image(latent_img)
        return latent_img, self.flatten(w.cpu().numpy())

    def img_to_latent(self, img: FaceImage, steps=1000):
        
        img = img.to_image().convert('RGB')
        #img = Image.open("/app/test.png")
        img = align_face(img)
        target_pil = img.convert('RGB')
        w, h = target_pil.size
        s = min(w, h)
        target_pil = target_pil.crop(
            ((w - s) // 2, (h - s) // 2, (w + s) // 2, (h + s) // 2))
        target_pil = target_pil.resize(
            (self.G.img_resolution, self.G.img_resolution), Image.LANCZOS)
        target_uint8 = np.array(target_pil, dtype=np.uint8)

        projected_w_steps = project(
            self.G,
            target=torch.tensor(target_uint8.transpose(
                [2, 0, 1]), device=self.device),  # pylint: disable=not-callable
            num_steps=steps,
            device=self.device,
            verbose=True
        )
        projected_w = projected_w_steps[-1].unsqueeze(0)
        projected_image = self.generate_image_from_w(projected_w)
        projected_image = Image.fromarray(projected_image)
        
        return [FaceImage.from_image(projected_image)], [self.flatten(projected_w.cpu().numpy())]