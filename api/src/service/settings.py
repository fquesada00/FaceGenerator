import os
from pydantic import BaseSettings

class Environment:
    PRODUCTION = 'production'
    DEVELOPMENT = 'development'
    
class Settings(BaseSettings):
    # Environment
    ENV: str = 'production'

    # Database
    DB_HOST: str = None
    DB_PORT: int = None
    DB_USER: str = None
    DB_PASSWORD: str = None
    DB_NAME: str = None

    # Temporary storage
    TMP_DB_HOST: str = None
    TMP_DB_PORT: int = None
    TMP_DB_MINUTES_EXPIRATION: int = 30

    # Host
    HOST_IP: str = None
    HOST: str = 'http://pf-2022-deepmind.it.itba.edu.ar'
    WEB_PATH: str = '/web'
    API_PATH: str = '/api'
    FULL_HOST: str = HOST + WEB_PATH

    # Security
    SECRET_KEY: str = None
    TOKEN_ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

settings = Settings(_env_file=os.environ.get("PROJECT_PATH") + '/api/.env.' + Environment.DEVELOPMENT, _env_file_encoding='utf-8')