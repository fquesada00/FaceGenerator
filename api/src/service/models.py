from typing import List,  Union, TypeVar, Generic
from fastapi import Response
from pydantic import BaseModel
from pydantic.generics import GenericModel
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
   