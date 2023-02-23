from src.service.app import app
from src.service.settings import settings
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host=settings.HOST_IP, port=5000)
