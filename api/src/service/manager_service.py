from src.service.models import AdminSettings
from src.service.utils import SingletonMeta

import socket

class ManagerService(metaclass=SingletonMeta):

    def __init__(self, host = '127.0.0.1', port = 8888):
        self.host = host
        self.port = port
        pass
    
    def send_and_receive_from_socket(self, msg):
        sent_bytes = 0

        retries = 0

        data = None
        
        while sent_bytes < 1 and retries < 3:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.connect((self.host, self.port))
                sent_bytes = s.send(bytes(msg, 'utf-8'))
                data = s.recv(1024)
                s.close()
                data = data.decode('utf-8')
            except Exception as e:
                print(str(e))
                retries += 1
        return data
            

    def update_settings(self, settings: AdminSettings):
        ret = self.send_and_receive_from_socket(settings.generator.value)
        print(ret)
        return ret

    def get_settings(self):
        return self.send_and_receive_from_socket('GET')

