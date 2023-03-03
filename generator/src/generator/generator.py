import sys
from os import getenv
from pathlib import Path
from src.face_frame import face_frame_correction

PROJECT_PATH = getenv("PROJECT_PATH")
sys.path.insert(0, PROJECT_PATH + "/generator/src/stylegan2")

import dnnlib
from src.stylegan2 import pretrained_networks
from dnnlib import tflib
from src.stylegan2 import dataset_tool
from src.stylegan2 import epoching_custom_run_projector
import os
os.environ["PYRO_LOGFILE"] = "pyro.log"
os.environ["PYRO_LOGLEVEL"] = "DEBUG"
import Pyro4
import numpy as np
from PIL import Image
import pickle
from src.generator.align_face import align_face    
from src.face_image import FaceImage

@Pyro4.expose
class Generator:

    def __init__(self, network_pkl='gdrive:networks/stylegan2-ffhq-config-f.pkl'):
        self.fps = 20
        self.result_size = 640
        self.network_pkl = network_pkl
        self.latent_vectors = self.get_control_latent_vectors('src/generator/stylegan2directions')

        self.Gs, self.noise_vars, self.Gs_kwargs = self.load_model()

    def flatten(self, z):
        return np.ravel(z).tolist()

    def unravel(self, z):
        return np.reshape(z, (1, *self.Gs.input_shape[1:]))

    def load_model(self):
        _G, _D, Gs = pretrained_networks.load_networks(self.network_pkl)
        noise_vars = [var for name, var in Gs.components.synthesis.vars.items() if name.startswith('noise')]
        Gs_kwargs = dnnlib.EasyDict()
        Gs_kwargs.output_transform = dict(func=tflib.convert_images_to_uint8, nchw_to_nhwc=True)
        Gs_kwargs.randomize_noise = False
        return Gs, noise_vars, Gs_kwargs

    def get_control_latent_vectors(self, path):
        files = [x for x in Path(path).iterdir() if str(x).endswith('.npy')]
        latent_vectors = {f.name[:-4]:np.load(f) for f in files}
        return latent_vectors

    def generate_random_image(self, rand_seed):
        '''returns the image and its latent code'''
        z = np.random.RandomState(rand_seed).randn(1, *self.Gs.input_shape[1:]) # [minibatch, component]
        random_image = self.generate_image_from_z(z)
        image = Image.fromarray(random_image)
        return FaceImage.from_image(image), self.flatten(z)

    def generate_image_from_latent_vector(self, latent_vector):
        image = self.generate_image_from_z(latent_vector)
        image = Image.fromarray(image)
        return FaceImage.from_image(image)

    def generate_image_from_z(self, z):
        z = self.unravel(z)
        images = self.Gs.run(z, None, **self.Gs_kwargs)
        return images[0]

    def generate_image_from_w(self, w):
        images = self.Gs.components.synthesis.run(w, **self.Gs_kwargs)
        return images[0]

    def linear_interpolate(self, from_val, to_val, step):
        return from_val * (1 - step) + to_val * step # as steps gets closer to 1, result gets closer to to_val

    def img_to_latent(self, img: FaceImage):
        img = img.to_image()
        img = img.convert('RGB')
        aligned_imgs_path = Path('aligned_imgs')
        if not aligned_imgs_path.exists():
            aligned_imgs_path.mkdir()
        img_name = 'image0000'
        result = align_face(img)
        if result is None:
            return None, None
        result.save(aligned_imgs_path/('aligned_'+img_name+'.png'))
        dataset_tool.create_from_images('datasets_stylegan2/custom_imgs', aligned_imgs_path, 1)
        epoching_custom_run_projector.project_real_images(self.Gs, 'custom_imgs', 'datasets_stylegan2', 1, 2)
        
        all_result_folders = list(Path('results').iterdir())
        all_result_folders.sort()
        last_result_folder = all_result_folders[-1]
        all_step_pngs = [x for x in last_result_folder.iterdir() if x.name.endswith('png') and 'image{0:04d}'.format(0) in x.name]
        all_step_pngs.sort()

        target_image = Image.open(all_step_pngs[-1]).resize((self.result_size, self.result_size))
        best_aproximation = Image.open(all_step_pngs[-2]).resize((self.result_size, self.result_size))
        latent_code = self.get_final_latents()

        zs, images = face_frame_correction(target_image, latent_code, self.Gs, self.Gs_kwargs)
        
        _zs = [self.flatten(z) for z in zs]

        return images, _zs

    def get_final_latents(self):
        all_results = list(Path('results/').iterdir())
        all_results.sort()
        
        last_result = all_results[-1]

        latent_files = [x for x in last_result.iterdir() if 'final_latent_code' in x.name]
        latent_files.sort()
        
        all_final_latents = []
        
        for file in latent_files:
            with open(file, mode='rb') as latent_pickle:
                all_final_latents.append(pickle.load(latent_pickle))
    
        return all_final_latents[0]

    def generate_transition(self, z1, z2, num_interps=50):
        z1 = self.unravel(z1)
        z2 = self.unravel(z2)

    
        all_imgs = []
        all_zs = []
        
        steps = np.linspace(0, 1, num_interps, endpoint=False)[1::]
        
        for curr_step in steps:
            interpolated_latent_code = self.linear_interpolate(z1, z2, curr_step)
            image = self.generate_image_from_z(interpolated_latent_code)
            interp_latent_image = Image.fromarray(image).resize((self.result_size, self.result_size))
            interp_latent_image = FaceImage.from_image(interp_latent_image)
            all_imgs.append(interp_latent_image)
            all_zs.append(self.flatten(interpolated_latent_code))
        return all_imgs, all_zs
        
    def change_features(self, z, features_amounts_dict: dict):
        z = self.unravel(z)
        modified_latent_code = self.Gs.components.mapping.run(z, None)
        for feature_name, amount in features_amounts_dict.items():
            modified_latent_code += self.latent_vectors[feature_name] * amount
        image = self.generate_image_from_w(modified_latent_code)
        latent_img = Image.fromarray(image).resize((self.result_size, self.result_size))
        latent_img = FaceImage.from_image(latent_img)
        return latent_img, self.flatten(modified_latent_code)

    def mix_styles(self, z1, z2):
        z1 = self.unravel(z1)
        z2 = self.unravel(z2)
        z1_copy = z1.copy()
        z2_copy = z2.copy()
        z1[0][6:] = z2_copy[0][6:]
        z2[0][6:] = z1_copy[0][6:]
        image1 = Image.fromarray(self.generate_image_from_z(z1)).resize((self.result_size, self.result_size))
        image2 = Image.fromarray(self.generate_image_from_z(z2)).resize((self.result_size, self.result_size))
        image1 = FaceImage.from_image(image1)
        image2 = FaceImage.from_image(image2)
        return [image1, image2], [self.flatten(z1), self.flatten(z2)]
