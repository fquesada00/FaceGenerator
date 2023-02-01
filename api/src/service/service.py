from src.service.database import GeneratorDB
from src.generator.generator import Generator
from pathlib import Path
import numpy as np
from PIL import Image
import base64
from io import BytesIO
import re
import os


API_PATH = os.getenv("API_PATH")

database = GeneratorDB()


class GeneratorService:
    def __init__(self):
        self.generator = Generator(network_pkl='gdrive:networks/stylegan2-ffhq-config-f.pkl')

    #database methods
    @staticmethod
    def get_ids():
        ids = []
        zs = []
        for id, z in database.fetch_all():
            ids.append(id)
            zs.append(z)
        return ids, zs
    
    @staticmethod
    def image_to_bytes(image: Image):
        byte_arr = BytesIO()
        image.save(byte_arr, format='PNG')
        return byte_arr.getvalue()

    def get_image_by_id(self, face_id: int):
        image: Image = self.generate_face(face_id)
        return GeneratorService.image_to_bytes(image)




 

    def get_images_from_database(self, from_id=None, to_id=None):
        values = database.fetch(from_id = from_id, to_id = to_id, with_tags=False)
        faces = []
        for value in values:
            image = self.generator.generate_image_from_z(value['z'])
            image = Image.fromarray(image)
            face = {
                'img': self.generator.Image_to_bytes(image),
                'id': value['id'],
                'z': value['z']
            }
            faces.append(face)
        return faces


    def save_image(self, z, tags=None):
        print("Saving image...")
        return database.insert_z(z, tags)


    #generator methods   
   

    def generate_face(self, id: int):
        print("Generating image...")
        z = database.fetch_z_by_id(id=id)
        image = self.generator.generate_image_from_z(z)
        return Image.fromarray(image)

    def generate_random_images(self, qty: int):
        print("Generating random images...")
        images = []
        for i in range(qty):
            seed = np.random.randint(30000)
            image, z = self.generator.generate_random_image(seed)
            face = {
                'z': z,
                'img': self.generator.Image_to_bytes(image)
            }
            images.append(face)
        return images

    def generate_transition(self, id_img1: int, id_img2: int, qty: int = None):
        print("Generating transition...")
        z1 = database.fetch_z_by_id(id=id_img1)
        z2 = database.fetch_z_by_id(id=id_img2)

        if qty is None:
            imgs, zs = self.generator.generate_transition(z1, z2)
        else:
            imgs, zs = self.generator.generate_transition(z1, z2, qty)

        faces = []
        for img,z in zip(imgs,zs):
            face = {
                'z': z,
                'img': self.generator.Image_to_bytes(img)
            }
            faces.append(face)
        return faces

    def img_to_latent(self, img_bytes:bytes):
        print("Locating face in latent space...")
        data = BytesIO(img_bytes)
        imgs, zs = self.generator.img_to_latent(Image.open(data))
        faces = []
        for img,z in zip(imgs,zs):
            face = {
                'z': z,
                'img': self.generator.Image_to_bytes(img)
            }
            faces.append(face)
        return faces

    def base64_to_latent(self, base64str):
        print("Locating face in latent space...")
        base64_data = re.sub('^data:image/.+;base64,', '', base64str)
        img_bytes = base64.b64decode(base64_data)
        data = BytesIO(img_bytes)
        imgs, zs = self.generator.img_to_latent(Image.open(data))
        faces = []
        for img,z in zip(imgs,zs):
            face = {
                'z': z,
                'img': self.generator.Image_to_bytes(img)
            }
            faces.append(face)
        return faces

    def change_features(self, id_img: int, features: dict):
        print("Modifying face...")
        z = database.fetch_z_by_id(id=id_img)
        new_img, new_z = self.generator.change_features(z, features)
        return {
            'z': new_z,
            'img': self.generator.Image_to_bytes(new_img)
        }

    def mix_styles(self, id1, id2):
        z1 = database.fetch_z_by_id(id=id1)
        z2 = database.fetch_z_by_id(id=id2)
        imgs, zs = self.generator.mix_styles(z1, z2)
        faces = []
        for img,z in zip(imgs,zs):
            face = {
                'z': z,
                'img': self.generator.Image_to_bytes(img)
            }
            faces.append(face)
        return faces

