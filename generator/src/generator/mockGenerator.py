import sys
from os import listdir, getenv
import io
import Pyro4

from src.face_image import FaceImage

PROJECT_PATH = getenv("PROJECT_PATH")
sys.path.insert(0, PROJECT_PATH + "/generator/src/stylegan2")


import numpy as np
from PIL import Image
import base64
from tqdm import tqdm

def get_image(seed):
    try:
        seed = seed[0]
    except:
        pass

    seed = int(seed)
    #list all mock images
    dir = PROJECT_PATH + '/generator/src/generator/mock/'
    files = listdir(dir)
    #select random file
    file = np.random.RandomState(seed).randint(0,len(files))
    file = files[int(file)]
    return FaceImage.from_image(Image.open(dir + file))

@Pyro4.expose
class Generator:

    def __init__(self, network_pkl='gdrive:networks/stylegan2-ffhq-config-f.pkl'):
        self.result_size = 640
        pass

    def generate_random_image(self, rand_seed):
        image = get_image(rand_seed)
        return image, [rand_seed]

    def generate_image_from_z(self, z):
        
        return np.asarray(get_image(z))

    def img_to_latent(self, img: Image):
        z = np.random.randint(0,9999)
        return [get_image(z)], [[z]]

    def generate_transition(self, z1, z2, num_interps=50):
        step_size = 1.0/num_interps
    
        all_imgs = []
        all_zs = []
        
        amounts = np.arange(0, 1, step_size)
        
        for alpha in tqdm(amounts):
            image = get_image(alpha)
            interp_latent_image = image.resize((self.result_size, self.result_size))
            all_imgs.append(interp_latent_image)
            all_zs.append([alpha])
        return all_imgs, all_zs
        
    def change_features(self, z, features_amounts_dict: dict):
        image = get_image(z)
        latent_img = image.resize((self.result_size, self.result_size))
        return latent_img, z

    def mix_styles(self, z1, z2):
        image1 = get_image(z1)
        image2 = get_image(z2)
        return [image1, image2], [z1, z2]



    def Image_to_bytes(self, img: Image):
        byte_arr = io.BytesIO()
        img.save(byte_arr, format='PNG') # convert the PIL image to byte array
        encoded_img = base64.encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
        return encoded_img
