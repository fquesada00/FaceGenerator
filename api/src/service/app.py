from fastapi import FastAPI, Response, File, UploadFile, Request, status, Query, Depends, Cookie, APIRouter
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, RedirectResponse, FileResponse
from typing import List, Union, Generic, TypeVar
import logging
from pydantic import BaseModel
from pydantic.generics import GenericModel
from src.service.service import GeneratorService
from fastapi.security import OAuth2PasswordRequestForm
from src.service.models import *
from src.service.security import *
from fastapi.staticfiles import StaticFiles
from src.service.settings import settings
import os

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

app = FastAPI(responses={422: {"model": Error}}, docs_url="/api/docs", redoc_url="/api/redoc")
# create a router for /api
api_router = APIRouter(prefix=settings.API_PATH)

@app.middleware("http")
async def assets_middleware(request: Request, call_next):
    if not request.url.path.startswith(settings.API_PATH) and not request.url.path.startswith("/static"):
        # FIXME: improve this as nested routes are not supported
        if request.url.path.startswith("/faces") or request.url.path.startswith("/about"):
            response =  RedirectResponse(url=f'{settings.WEB_PATH}/static/index.html')
        elif request.url.path.startswith("/openapi.json"):
            return await call_next(request)
        else:
            response =  RedirectResponse(url=f'{settings.WEB_PATH}/static{request.url.path}')
        return response
    response = await call_next(request)
    return response

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"error": exc.errors()}),
    )

os.makedirs('dist', exist_ok=True)
app.mount('/static', StaticFiles(directory='dist/', html=True), name="static")

#routes
@api_router.post("/auth/token", response_model=ApiResponse[Token])
async def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )
    refresh_token = create_access_token(data = {"sub": user['username']}, expires_delta = timedelta(days = REFRESH_TOKEN_EXPIRE_DAYS))
    response.set_cookie(key="jwt", value=refresh_token, httponly=True)
    return {"result":{"access_token": access_token, "token_type": "bearer", "roles": [user['role']]}}

@api_router.get("/auth/refresh-token", response_model=ApiResponse[Token])
async def refresh_token(response: Response, jwt: str = Cookie(default=None)):
    user = await get_current_user(jwt)
    access_token_expires = timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )
    return {"result":{"access_token": access_token, "token_type": "bearer", "roles": [user['role']]}}

@api_router.get('/faces/generate', response_model=ApiResponse[List[Face]])
def generateFaces(amount: int = 1, current_user: User = Depends(get_current_user)):
    return {"result":service.generate_random_images(amount)}

@api_router.get('/faces', response_model=ApiResponse[List[Face]])
def getFaces(tags: str = Query(None), current_user: User = Depends(get_current_user)):
    tags = tags.split(',') if tags else []
    return {'result':service.get_images_from_database(tags)}

@api_router.delete('/faces', status_code=status.HTTP_204_NO_CONTENT)
def deleteAllFaces(current_user: User = Depends(get_current_user)):
    service.delete_all_faces()


@api_router.get('/faces/transition', response_model=ApiResponse[FaceSerie])
def generateTransition(from_id: str, to_id: str, amount: int, current_user: User = Depends(get_current_user)):
    faces, serie_id = service.generate_transition(from_id, to_id, amount)
    return {'result': {'faces': faces, 'id': serie_id}}

@api_router.get('/faces/interchange', response_model=ApiResponse[List[Face]])
def interchangeFaces(id1: str, id2: str, current_user: User = Depends(get_current_user)):
    return {'result':service.mix_styles(id1, id2)}

@api_router.post('/faces/image', response_model=ApiResponse[List[Face]])
def generateFaceFromImage(steps:int =1000, image: UploadFile = File(), current_user: User = Depends(get_current_user)):
    return {'result':service.img_to_latent(image.file.read(), steps)}

@api_router.get('/faces/series', response_model=ApiResponse[List[FaceSerie]])
def getSeries(tags: str = Query(None), current_user: User = Depends(get_current_user)):
    print("Getting series...")
    tags = tags.split(',') if tags else []
    return {'result': service.get_series_by_tags(tags)}

@api_router.delete('/faces/series', status_code=status.HTTP_204_NO_CONTENT)
def deleteAllSeries(current_user: User = Depends(get_current_user)):
    service.delete_all_series()

class SaveRequest(BaseModel):
    tags: Union[List[str], None]
@api_router.post('/faces/series/{serie_id}', response_model=ApiResponse[str])
def saveSerie(serie_id: str, body:SaveRequest, current_user: User = Depends(get_current_user)):
    service.save_serie(serie_id, body.tags)
    return {'result': serie_id}

@api_router.delete('/faces/series/{id}', status_code=status.HTTP_204_NO_CONTENT)
def deleteSerie(id: str, current_user: User = Depends(get_current_user)):
    service.delete_serie(id)

@api_router.get('/faces/{id}/image', response_class=ImageResponse)
def getFace(id: str, response: Response, current_user: User = Depends(get_current_user)):
    image_path = service.get_image_path(id)
    return FileResponse(image_path, media_type="image/png", headers={'Cache-Control': 'max-age=86400'})


@api_router.post('/faces/{face_id}', response_model=ApiResponse[str])
def saveFaces(face_id: str, body:SaveRequest, current_user: User = Depends(get_current_user)):
    print("Saving face...")
    service.save_image(face_id, body.tags)
    return {'result':face_id}

@api_router.put('/faces/{id}', response_model=ApiResponse[Face])
def updateFace(id:str, modifiers: Modifiers, current_user: User = Depends(get_current_user)):
    return {'result':service.change_features(id, vars(modifiers))}

@api_router.delete('/faces/{id}', status_code=status.HTTP_204_NO_CONTENT)
def deleteFace(id: str, current_user: User = Depends(get_current_user)):
    service.delete_face(id)

@api_router.get('/tags', response_model=ApiResponse[List[str]])
def getTags(current_user: User = Depends(get_current_user)):
    return {'result': service.get_tags()}

@api_router.delete('/tags', status_code=status.HTTP_204_NO_CONTENT)
def deleteAllTags(current_user: User = Depends(get_current_user)):
    service.delete_all_tags()

app.include_router(api_router)