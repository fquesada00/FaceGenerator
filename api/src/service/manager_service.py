from src.service.models import AdminSettings
from src.service.utils import SingletonMeta

import socket

class ManagerService(metaclass=SingletonMeta):

    def __init__(self, host = '127.0.0.1', port = 8888):
        self.host = host
        self.port = port
        pass
    
    def send_to_socket(self, msg):
        sent_bytes = 0

        retries = 0
        
        while sent_bytes < 1 and retries < 3:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.connect((self.host, self.port))
                sent_bytes = s.send(bytes(msg, 'utf-8'))
                s.close()
            except Exception as e:
                print(str(e))
                retries += 1
            

    def update_settings(self, settings: AdminSettings):
        self.send_to_socket(settings.generator)

