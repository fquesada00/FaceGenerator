
from src.face_image import FaceImage
from src.generator.mockGenerator import Generator
import Pyro4
from Pyro4.util import SerializerBase

daemon = Pyro4.Daemon()                # make a Pyro daemon
ns = Pyro4.locateNS()                  # find the name server
uri = daemon.register(Generator("network_pkl='gdrive:networks/stylegan2-ffhq-config-f.pkl'"))   # register the greeting maker as a Pyro object
ns.register("facegenerator.generator", uri)   # register the object with a name in the name server

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

print("Ready.")
daemon.requestLoop()            