from pydantic import BaseSettings

class Settings(BaseSettings):
    # Database
    DB_HOST: str = None
    DB_PORT: int = None
    DB_USER: str = None
    DB_PASSWORD: str = None
    DB_NAME: str = None

    # FastAPI
    API_HOST: str = None
    API_PORT: int = None

    # Redis
    REDIS_HOST: str = None
    REDIS_PORT: int = None

    # Host
    HOST: str = 'http://pf-2022-deepmind.it.itba.edu.ar'
    WEB_PATH: str = '/web'
    API_PATH: str = '/api'
    FULL_HOST: str = HOST + WEB_PATH

settings = Settings(_env_file='.env.prod', _env_file_encoding='utf-8')