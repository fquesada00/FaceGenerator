from fastapi import FastAPI, Response, File, UploadFile, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import List, Union, Generic, TypeVar
import logging
from pydantic import BaseModel
from pydantic.generics import GenericModel
import os
from src.service.service import GeneratorService


#models
T = TypeVar('T')
class ApiResponse(GenericModel, Generic[T]):
    result: T

class Error(BaseModel):
    error: str

class Face(BaseModel):
    z: List[float]
    image: str
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
   
service = GeneratorService()

app = FastAPI(responses={422: {"model": Error}})

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"error": exc.errors()}),
    )



#routes
@app.get('/faces/generate', response_model=ApiResponse[List[Face]])
def generateFaces(amount: int = 1):
    return {"result":service.generate_random_images(amount)}

@app.post('/faces', response_model=int)
def saveFaces(_id: str, tags: List[str]):
    id = service.save_image(_id, tags)
    return {'result':id}

@app.get('/faces', response_model=ApiResponse[List[Face]])
def getFaces(from_id : Union[int, None] = None, to_id: Union[int,None] = None) :

    return {'result':service.get_images_from_database(from_id, to_id)}

@app.get('/faces/transition', response_model=ApiResponse[List[Face]])
def generateTransition(from_id: int, to_id: int, amount: int) :
    return {'result':service.generate_transition(from_id, to_id, amount)}

@app.get('/faces/interchange', response_model=ApiResponse[List[Face]])
def interchangeFaces(id1: int, id2: int) :
    return {'result':service.mix_styles(id1, id2)}

@app.get('/faces/{id}', response_class=ImageResponse)
def getFace(id: int):
    image = service.get_image_by_id(id)
    return ImageResponse(content=image)

@app.post('/faces/image', response_model=ApiResponse[List[Face]])
def generateFaceFromImage(image: UploadFile = File()) :
    return {'result':service.img_to_latent(image.file.read())}

@app.put('/faces/{id}', response_model=ApiResponse[Face])
def updateFace(id:int,modifiers: Modifiers):
    return {'result':service.change_features(id, vars(modifiers))}

