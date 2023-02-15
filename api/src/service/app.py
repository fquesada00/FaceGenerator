from fastapi import FastAPI, Response, File, UploadFile, Request, status, Query, Depends,Cookie
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import List, Union, Generic, TypeVar
import logging
from pydantic import BaseModel
from pydantic.generics import GenericModel
from src.service.service import GeneratorService
from fastapi.security import OAuth2PasswordRequestForm
from src.service.models import *
from src.service.security import *



service = GeneratorService()

app = FastAPI(responses={422: {"model": Error}})



@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"error": exc.errors()}),
    )



#routes
@app.post("/auth/token", response_model=ApiResponse[Token])
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


@app.get("/auth/refresh-token", response_model=ApiResponse[Token])
async def refresh_token(response: Response, jwt: str = Cookie(default=None)):
    user = await get_current_user(jwt)
    access_token_expires = timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )
    return {"result":{"access_token": access_token, "token_type": "bearer", "roles": [user['role']]}}



@app.get('/faces/generate', response_model=ApiResponse[List[Face]])
def generateFaces(amount: int = 1, current_user: User = Depends(get_current_user)):
    return {"result":service.generate_random_images(amount)}


@app.get('/faces', response_model=ApiResponse[List[Face]])
def getFaces(tags: List[str] = Query(None), current_user: User = Depends(get_current_user)):

    return {'result':service.get_images_from_database(tags)}

@app.get('/faces/transition', response_model=ApiResponse[List[Face]])
def generateTransition(from_id: int, to_id: int, amount: int, current_user: User = Depends(get_current_user)):
    return {'result':service.generate_transition(from_id, to_id, amount)}

@app.get('/faces/interchange', response_model=ApiResponse[List[Face]])
def interchangeFaces(id1: int, id2: int, current_user: User = Depends(get_current_user)):
    return {'result':service.mix_styles(id1, id2)}


@app.post('/faces/image', response_model=ApiResponse[List[Face]])
def generateFaceFromImage(image: UploadFile = File(), current_user: User = Depends(get_current_user)):
    return {'result':service.img_to_latent(image.file.read())}


@app.get('/faces/{id}', response_class=ImageResponse)
def getFace(id: int, response: Response, current_user: User = Depends(get_current_user)):
    #response.headers['Cache-Control'] = 
    image = service.get_image_by_id(id)
    return ImageResponse(content=image, headers={'Cache-Control': 'max-age=86400'})

class SaveRequest(BaseModel):
    tags: Union[List[str], None]
@app.post('/faces/{face_id}', response_model=ApiResponse[int])
def saveFaces(face_id: str, body:SaveRequest, current_user: User = Depends(get_current_user)):
    print("saving face")
    id = service.save_image(face_id, body.tags)
    return {'result':id}


@app.put('/faces/{id}', response_model=ApiResponse[Face])
def updateFace(id:int,modifiers: Modifiers, current_user: User = Depends(get_current_user)):
    return {'result':service.change_features(id, vars(modifiers))}

@app.get('/tags', response_model=ApiResponse[List[str]])
def getTags(current_user: User = Depends(get_current_user)):
    return {'result': service.get_tags()}