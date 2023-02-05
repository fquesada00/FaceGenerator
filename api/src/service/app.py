from fastapi import FastAPI, Response, File, UploadFile
from typing import List, Union
import logging
from pydantic import BaseModel
import os
from src.service.service import GeneratorService

app = FastAPI()



#models
class Face(BaseModel):
    z: List[float]
    img: str
    id: Union[int, None]


class ImageResponse(Response):
    media_type = 'image/png'
    def render(self, content: bytes) -> bytes:
        return content

class Modifiers(BaseModel):
    age: int = 0
    eye_distance: int = 0
    eye_eyebrow_distance: int = 0
    eye_ratio: int = 0
    eyes_open: int = 0
    gender: int = 0
    lip_ratio: int = 0
    mouth_open: int = 0
    mouth_ratio: int = 0
    nose_mouth_distance: int = 0
    nose_ratio: int = 0
    nose_tip: int = 0
    pitch: int = 0
    roll: int = 0
    smile: int = 0
    yaw: int = 0
   
print("Starting up parent", os.getpid())
service = GeneratorService()
# #run init on each worker
# @app.on_event("startup")
# async def startup_event():
#     print("Starting up", os.getpid())
#     s = GeneratorService()
#     services[os.getpid()] = s

#getService = lambda: services[os.getpid()]

def getService() -> GeneratorService:
    if os.getpid() not in services:
        print("Starting up", os.getpid())
        s = GeneratorService()
        services[os.getpid()] = s
    return services[os.getpid()]


#routes
@app.get('/faces/generate', response_model=List[Face])
def generateFaces(amount: int = 1) -> List[Face]:
    print(os.getpid())
    return service.generate_random_images(amount)

@app.post('/faces', response_model=int)
def saveFaces(z: List[float], tags: List[str]):
    id = service.save_image(z, tags)
    return id

@app.get('/faces', response_model=List[Face])
def getFaces(from_id : Union[int, None] = None, to_id: Union[int,None] = None) -> List[Face]:

    return service.get_images_from_database(from_id, to_id)

@app.get('/faces/transition', response_model=List[Face])
def generateTransition(from_id: int, to_id: int, amount: int) -> List[Face]:
    return service.generate_transition(from_id, to_id, amount)

@app.get('/faces/interchange', response_model=List[Face])
def interchangeFaces(id1: int, id2: int) -> List[Face]:
    return service.mix_styles(id1, id2)

@app.get('/faces/{id}', response_class=ImageResponse)
def getFace(id: int):
    image = service.get_image_by_id(id)
    return ImageResponse(content=image)

@app.post('/faces/image', response_model=List[Face])
def generateFaceFromImage(image: UploadFile = File()) -> List[Face]:
    return service.img_to_latent(image.file.read())

@app.put('/faces/{id}', response_model=Face)
def updateFace(id:int,modifiers: Modifiers) -> Face:
    return service.change_features(id, vars(modifiers))

