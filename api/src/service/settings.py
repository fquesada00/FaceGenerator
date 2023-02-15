from pydantic import BaseSettings
import os

class Settings(BaseSettings):
    secret_key: str 
    token_algorithm: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int

    class Config:
        env_file = os.environ.get("PROJECT_PATH") + "/api/.env"