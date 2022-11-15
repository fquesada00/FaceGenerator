import sys
from os import mkdir, path, getenv
from pathlib import Path
import io
from src.face_frame import face_frame_correction

API_PATH = getenv("API_PATH")
sys.path.insert(0, API_PATH + "/src/stylegan2")

import dnnlib
from src.stylegan2 import pretrained_networks
from dnnlib import tflib
from src.stylegan2 import dataset_tool
from src.stylegan2 import epoching_custom_run_projector

import numpy as np
from PIL import Image
import base64
from tqdm import tqdm
import pickle
from src.generator.align_face import align_face


class Generator:

    def __init__(self, network_pkl='gdrive:networks/stylegan2-ffhq-config-f.pkl'):
        self.fps = 20
        self.result_size = 640
        self.network_pkl = network_pkl
        self.latent_vectors = self.get_control_latent_vectors('src/generator/stylegan2directions')

        self.Gs, self.noise_vars, self.Gs_kwargs = self.load_model()

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
        src_latents = np.stack(np.random.RandomState(seed).randn(self.Gs.input_shape[1]) for seed in [rand_seed])
        z = self.Gs.components.mapping.run(src_latents, None)
        random_image = self.generate_image_from_z(z)
        image = Image.fromarray(random_image)
        return image, z

    def generate_image_from_z(self, z):
        images = self.Gs.components.synthesis.run(z, **self.Gs_kwargs)
        return images[0]

    def linear_interpolate(self, code1, code2, alpha):
        return code1 * alpha + code2 * (1 - alpha)

    def img_to_latent(self, img: Image):
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
        
        return images, zs

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
        step_size = 1.0/num_interps
    
        all_imgs = []
        all_zs = []
        
        amounts = np.arange(0, 1, step_size)
        
        for alpha in tqdm(amounts):
            interpolated_latent_code = self.linear_interpolate(z2, z1, alpha)
            image = self.generate_image_from_z(interpolated_latent_code)
            interp_latent_image = Image.fromarray(image).resize((self.result_size, self.result_size))
            all_imgs.append(interp_latent_image)
            all_zs.append(interpolated_latent_code)
        return all_imgs, all_zs
        
    def change_features(self, z, features_amounts_dict: dict):
        modified_latent_code = np.array(z)
        for feature_name, amount in features_amounts_dict.items():
            modified_latent_code += self.latent_vectors[feature_name] * amount
        image = self.generate_image_from_z(modified_latent_code)
        latent_img = Image.fromarray(image).resize((self.result_size, self.result_size))
        return latent_img, modified_latent_code

    def mix_styles(self, z1, z2):
        z1_copy = z1.copy()
        z2_copy = z2.copy()
        z1[0][6:] = z2_copy[0][6:]
        z2[0][6:] = z1_copy[0][6:]
        image1 = Image.fromarray(self.generate_image_from_z(z1)).resize((self.result_size, self.result_size))
        image2 = Image.fromarray(self.generate_image_from_z(z2)).resize((self.result_size, self.result_size))
        return [image1, image2], [z1, z2]



    def Image_to_bytes(self, img):
        byte_arr = io.BytesIO()
        img.save(byte_arr, format='PNG') # convert the PIL image to byte array
        encoded_img = base64.encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
        return encoded_img
