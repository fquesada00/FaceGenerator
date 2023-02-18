import base64
from io import BytesIO
from PIL import Image

class FaceImage:
    def __init__(self, data):
        self.bytes = data

    @staticmethod
    def from_image(image: Image):
        byte_arr = BytesIO()
        image.save(byte_arr, format='PNG')
        return FaceImage(byte_arr.getvalue())
    
    def to_image(self,):
        return Image.open(BytesIO(base64.b64decode(self.bytes)))