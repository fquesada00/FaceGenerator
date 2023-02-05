from src.face_image import FaceImage
from src.service.database import GeneratorDB
from pathlib import Path
import numpy as np
from PIL import Image
import base64
from io import BytesIO
import re
import os
import Pyro4
from Pyro4.util import SerializerBase





API_PATH = os.getenv("PROJECT_PATH") + "/api"

database = GeneratorDB()

def face_image_deserializer(classname,raw: dict):
    data = raw['data']['data']
    return FaceImage(data)
    
def face_image_serializer(image: FaceImage):
    return {
        "__class__": "face_image",
        "data": image.bytes,
    }
SerializerBase.register_class_to_dict(FaceImage, face_image_serializer)
SerializerBase.register_dict_to_class('face_image', face_image_deserializer )


class GeneratorService:
    def __init__(self):
        #self.generator = Generator()
        self.generator = Pyro4.Proxy("PYRONAME:facegenerator.generator")
        print("Generator service initialized")
        #TODO REMOVE
        self.cache = {}

    def add_to_cache(self,z):
        n = len(self.cache)
        self.cache[n] = z
        return n

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
    def image_to_bytes(image: Image, encoded = True):
        byte_arr = BytesIO()
        image.save(byte_arr, format='PNG')
        if encoded:
            encoded_img = base64.encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64<   
            return encoded_img
        else:
            return byte_arr.getvalue()
    def get_image_by_id(self, face_id: int):
        image: Image = self.generate_face(face_id)
        return self.image_to_bytes(image, encoded=False)

 

    def get_images_from_database(self, from_id=None, to_id=None):
        values = database.fetch(from_id = from_id, to_id = to_id, with_tags=False)
        faces = []
        for value in values:
            #image = self.generator.generate_image_from_latent_vector(value['z'])
            #image = FaceImage.to_image(image)
            face = {
                'image': 'http://localhost:5000/faces/' + str(value['id']),
                'id': value['id'],
                'z': value['z']
            }
            faces.append(face)
        return faces


    def save_image(self, id, tags=None):
        print("Saving image...")
        #decode base64 id
        z = self.cache[int(id)]
        return database.insert_z(z, tags)


    #generator methods   
   

    def generate_face(self, id: int):
        print("Generating image...")
        z = database.fetch_z_by_id(id=id)
        image = self.generator.generate_image_from_latent_vector(z)
        return FaceImage.to_image(image)

    def generate_random_images(self, qty: int):
        print("Generating random images...")
        images = []
        for i in range(qty):
            seed = np.random.randint(30000)
            face_image, z = self.generator.generate_random_image(seed)
            image = face_image.to_image()
            face = {
                'z': z,
                'id': self.add_to_cache(z),
                'image': self.image_to_bytes(image)
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
            img = FaceImage.to_image(img)
            face = {
                'z': z,
                'id': self.add_to_cache(z),
                'image': self.image_to_bytes(img)
            }
            faces.append(face)
        return faces

    def img_to_latent(self, img_bytes:bytes):
        print("Locating face in latent space...")
        data = BytesIO(img_bytes)
        img = Image.open(data)
        img = FaceImage.from_image(img)
        imgs, zs = self.generator.img_to_latent(img)
        faces = []
        for img,z in zip(imgs,zs):
            img = FaceImage.to_image(img)
            face = {
                'z': z,
                'id': self.add_to_cache(z),
                'image': self.image_to_bytes(img)
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
                'id': self.add_to_cache(z),
                'image': self.generator.Image_to_bytes(img)
            }
            faces.append(face)
        return faces

    
    def change_features(self, id_img: int, features: dict):
        print("Modifying face...")
        z = database.fetch_z_by_id(id=id_img)
        
        new_img, new_z = self.generator.change_features(z, features)
        new_img = FaceImage.to_image(new_img)
        return {
            'z': new_z,
            'id': self.add_to_cache(new_z),
            'image': self.image_to_bytes(new_img)
        }

    def mix_styles(self, id1, id2):
        z1 = database.fetch_z_by_id(id=id1)
        z2 = database.fetch_z_by_id(id=id2)
        imgs, zs = self.generator.mix_styles(z1, z2)
        faces = []
        for img,z in zip(imgs,zs):
            img = FaceImage.to_image(img)
            face = {
                'z': z,
                'id': self.add_to_cache(z),
                'image': self.image_to_bytes(img)
            }
            faces.append(face)
        return faces

