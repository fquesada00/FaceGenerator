
from src.face_image import FaceImage
from src.generator.generator import Generator
import os
os.environ["PYRO_LOGFILE"] = "pyro.log"
os.environ["PYRO_LOGLEVEL"] = "DEBUG"

import Pyro4
import Pyro4.naming as naming
from Pyro4.util import SerializerBase

Pyro4.config.SERVERTYPE = "multiplex"

import threading as th


#start ns in a separate thread
def start_ns():
    naming.startNSloop()

ns_thread = th.Thread(target=start_ns)
ns_thread.start()

daemon = Pyro4.Daemon()                # make a Pyro daemon
ns = Pyro4.locateNS()                  # find the name server
generator = Generator("http://d36zk2xti64re0.cloudfront.net/stylegan2/networks/stylegan2-ffhq-config-f.pkl")
#generator = Generator("https://api.ngc.nvidia.com/v2/models/nvidia/research/stylegan3/versions/1/files/stylegan3-r-ffhqu-256x256.pkl")
uri = daemon.register(generator)   # register the greeting maker as a Pyro object
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

os.popen("jupyter-lab")

daemon.requestLoop()            
