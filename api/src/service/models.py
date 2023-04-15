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
    image: str
    id: Union[str, None]

class FaceSerie(BaseModel):
    id: str
    faces: List[Face]


class ImageResponse(Response):
    media_type = 'image/png'
    def render(self, content: bytes) -> bytes:
        return content

class Modifiers(BaseModel):
    age: float = 0
    eye_distance: float = 0
    eye_eyebrow_distance: float = 0
    eye_ratio: float = 0
    eyes_open: float = 0
    gender: float = 0
    lip_ratio: float = 0
    mouth_open: float = 0
    mouth_ratio: float = 0
    nose_mouth_distance: float = 0
    nose_ratio: float = 0
    nose_tip: float = 0
    pitch: float = 0
    roll: float = 0
    smile: float = 0
    yaw: float = 0

class AdminSettings(BaseModel):
    generator: str = 'ON'