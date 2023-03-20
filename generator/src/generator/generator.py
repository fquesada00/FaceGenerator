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

from src.stylegan2.training import misc
import src.stylegan2.projector as projector
import tensorflow as tf
from src.stylegan2.training import dataset



@Pyro4.expose
class Generator:

    def __init__(self, network_pkl='gdrive:networks/stylegan2-ffhq-config-f.pkl'):
    
        #limit ram usage
        # import resource
        # _max = 1024
        # resource.setrlimit(resource.RLIMIT_AS, (_max, _max))

        self.fps = 20
        self.result_size = 640
        self.network_pkl = network_pkl
        self.latent_vectors = self.get_control_latent_vectors('src/generator/stylegan2directions')

        self.Gs, self.noise_vars, self.Gs_kwargs = self.load_model()
        self.truncation_psi = 0.7
        self.w_avg = self.Gs.get_var('dlatent_avg')
        self.w_shape = self.Gs.components.synthesis.input_shape[1:]
        

    def flatten(self, w):
        return np.ravel(w).tolist()

    def unravel(self, w):
        return np.reshape(w, (1, *self.w_shape))

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
        w = self.Gs.components.mapping.run(z, None) # [minibatch, layer, component]
        w = self.w_avg + (w - self.w_avg) * self.truncation_psi # [minibatch, layer, component]
        random_image = self.generate_image_from_w(w)
        image = Image.fromarray(random_image)
        return FaceImage.from_image(image), self.flatten(w)

    def generate_image_from_w(self, w):
        images = self.Gs.components.synthesis.run(w, **self.Gs_kwargs)
        return images[0]

    def linear_interpolate(self, from_val, to_val, step):
        return from_val * (1 - step) + to_val * step # as steps gets closer to 1, result gets closer to to_val

    


    def img_to_latent(self, img: FaceImage, steps=1000):
        
        img = img.to_image()
        img = img.convert('RGB')
        aligned_face = align_face(img)
        target = aligned_face
        

        #create dataset 
        os.makedirs('dataset', exist_ok=True)
        target.save('dataset/image0000.png')
        dataset_tool.create_from_images('datasets_stylegan2/custom_imgs', 'dataset', 1)

        #load images
        proj= projector.Projector()
        proj.set_network(self.Gs)
        proj.num_steps = steps
        dataset_obj = dataset.load_dataset(data_dir="datasets_stylegan2", tfrecord_dir="custom_imgs", max_label_size=0, repeat=False, shuffle_mb=0)
        images, _labels = dataset_obj.get_minibatch_np(1)
        images = misc.adjust_dynamic_range(images, [0, 255], [-1, 1])

        #run projector
        proj.start(images)
        while proj.get_cur_step() < proj.num_steps:
            print('\r%d / %d ... ' % (proj.get_cur_step(), proj.num_steps), end='', flush=True)
            proj.step()
            
                
        print('\r%-30s\r' % '', end='', flush=True)
        
        #get latent vector
        w = proj.get_dlatents()
        image = self.generate_image_from_w(w)

        #ws, images =face_frame_correction(image,w,self.Gs, self.Gs_kwargs)

        #free up memory
        tf.reset_default_graph()
        tf.keras.backend.clear_session()


        image = Image.fromarray(image)
        return [FaceImage.from_image(image)], [self.flatten(w)]

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

    def generate_transition(self, w1, w2, num_interps=50):
        w1 = self.unravel(w1)
        w2 = self.unravel(w2)
    
        all_imgs = []
        all_ws = []
        
        steps = np.linspace(0, 1, num_interps + 1, endpoint=False)[1::]
        
        for curr_step in steps:
            interpolated_latent_code = self.linear_interpolate(w1, w2, curr_step)
            image = self.generate_image_from_w(interpolated_latent_code)
            interp_latent_image = Image.fromarray(image).resize((self.result_size, self.result_size))
            interp_latent_image = FaceImage.from_image(interp_latent_image)
            all_imgs.append(interp_latent_image)
            all_ws.append(self.flatten(interpolated_latent_code))
        return all_imgs, all_ws
        
    def change_features(self, w, features_amounts_dict: dict):
        w = self.unravel(w)
        for feature_name, amount in features_amounts_dict.items():
            w += self.latent_vectors[feature_name] * amount
        image = self.generate_image_from_w(w)
        latent_img = Image.fromarray(image).resize((self.result_size, self.result_size))
        latent_img = FaceImage.from_image(latent_img)
        return latent_img, self.flatten(w)

    def mix_styles(self, w1, w2):
        w1 = self.unravel(w1)
        w2 = self.unravel(w2)
        w1_copy = w1.copy()
        w2_copy = w2.copy()
        w1[0][6:] = w2_copy[0][6:]
        w2[0][6:] = w1_copy[0][6:]
        image1 = Image.fromarray(self.generate_image_from_w(w1)).resize((self.result_size, self.result_size))
        image2 = Image.fromarray(self.generate_image_from_w(w2)).resize((self.result_size, self.result_size))
        image1 = FaceImage.from_image(image1)
        image2 = FaceImage.from_image(image2)
        return [image1, image2], [self.flatten(w1), self.flatten(w2)]

