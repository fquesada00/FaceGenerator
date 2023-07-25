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
from src.service.utils import SingletonMeta
from src.service.settings import settings

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


class GeneratorService(metaclass=SingletonMeta):
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

    def get_image_path(self, face_id: int):
        return database.get_image_path(face_id)
        
    def get_image_endpoint(self, face_id: str):
        return settings.FULL_HOST + settings.API_PATH + '/faces/' + face_id + '/image'

    def get_images_from_database(self, tags=None):
        values = database.get_face_by_tags(tags)
        faces = []
        for value in values:
            #image = self.generator.generate_image_from_latent_vector(value['z'])
            #image = FaceImage.to_image(image)
            face = {
                'image': self.get_image_endpoint(value['id']),
                'id': value['id'],
                'tags': value['tags']
            }
            faces.append(face)
        return faces

    def save_image(self, id, tags=None):
        print("Saving image...")
        database.save_face(id, tags)
        # return database.insert_z(z, tags)

    def get_tags(self):
        return database.get_tags()

    def get_user_by_username(self, username: str):
        return database.get_user_by_username(username)

    #generator methods   
    def generate_face(self, id: int):
        print("Generating image...")
        z = database.fetch_z_by_id(id=id)
        image = self.generator.generate_image_from_latent_vector(z)
        return FaceImage.to_image(image)

    def generate_random_images(self, qty: int, reference: bytes = None):
        print("Generating random images...")
        if reference is not None:
            data = BytesIO(reference)
            reference = Image.open(data)
            reference = FaceImage.from_image(reference)
        images = []
        for _ in range(qty):
            seed = np.random.randint(30000)
            face_image, z = self.generator.generate_random_image(seed, reference)
            image = face_image.to_image()
            id = database.insert_face(image, z)
            face = {
                'id': id,
                'image': self.get_image_endpoint(id)
            }
            images.append(face)
        return images

    def generate_transition(self, id1: str, id2: str, qty: int = None):
        print("Generating transition...")
        z1 = database.fetch_z_by_id(id=id1)
        z2 = database.fetch_z_by_id(id=id2)

        if qty is None:
            imgs, zs = self.generator.generate_transition(z1, z2)
        else:
            imgs, zs = self.generator.generate_transition(z1, z2, qty)

        faces = []
        ids = []
        
        # add first face
        ids.append(id1)
        faces.append({
            'id': id1,
            'image': self.get_image_endpoint(id1)
        })
        
        for img,z in zip(imgs,zs):
            img = FaceImage.to_image(img)
            id = database.insert_face(img, z)

            ids.append(id)

            face = {
                'id': id,
                'image': self.get_image_endpoint(id)
            }

            faces.append(face)

        # add the last face
        ids.append(id2)
        faces.append({
            'id': id2,
            'image': self.get_image_endpoint(id2)
        })

        serie_id = database.insert_serie(ids)

        return faces, serie_id

    def img_to_latent(self, img_bytes:bytes, steps = 1000):
        print("Locating face in latent space...")
        data = BytesIO(img_bytes)
        img = Image.open(data)
        img = FaceImage.from_image(img)

        imgs, zs = self.generator.img_to_latent(img, steps)

        faces = []
        for img,z in zip(imgs,zs):
            img = FaceImage.to_image(img)
            id = database.insert_face(img, z)

            face = {
                'id': id,
                'image': self.get_image_endpoint(id)
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
    
    def change_features(self, id: str, features: dict):
        print("Modifying face...")
        z = database.fetch_z_by_id(id=id)
        new_img, new_z = self.generator.change_features(z, features)
        new_img = FaceImage.to_image(new_img)

        id = database.insert_face(new_img, new_z)

        return {
            'id': id,
            'image': self.get_image_endpoint(id)
        }

    def mix_styles(self, id1: str, id2: str):
        z1 = database.fetch_z_by_id(id=id1)
        z2 = database.fetch_z_by_id(id=id2)
        
        imgs, zs = self.generator.mix_styles(z1, z2)

        faces = []
        for img, z in zip(imgs, zs):
            img = FaceImage.to_image(img)
            id = database.insert_face(img, z)

            face = {
                'id': id,
                'image': self.get_image_endpoint(id)
            }

            faces.append(face)

        return faces

    def get_series_by_tags(self, tags):
        values = database.get_series_by_tags(tags)
        series = []
        
        for serie in values:
            faces = []

            for id in serie['images_id']:
                faces.append({
                    'id': id,
                    'image': self.get_image_endpoint(id)
                })

            series.append({
                'id': serie['id'],
                'tags': serie['tags'],
                'faces': faces
            })

        return series

    def save_serie(self, id: str, tags: list):
        return database.save_serie(id, tags)

    def delete_all_series(self):
        return database.delete_all_series()

    def delete_serie(self, id: str):
        return database.delete_serie_by_id(id)

    def delete_all_faces(self):
        return database.delete_all_faces()

    def delete_face(self, id: str):
        return database.delete_face_by_id(id)

    def delete_all_tags(self):
        return database.delete_all_tags()