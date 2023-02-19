from src.service.app import app
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="10.16.6.167", port=5000)
