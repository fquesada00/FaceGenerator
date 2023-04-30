from src.service.models import AdminSettings, ServiceStatus
from src.service.utils import SingletonMeta

import socket

settings_map = {
        'OFF' : AdminSettings(generator=ServiceStatus.OFF, stable_diffusion=ServiceStatus.OFF),
        'GENERATOR_ON' : AdminSettings(generator=ServiceStatus.ON, stable_diffusion=ServiceStatus.OFF),
        'STABLE_DIFFUSION_ON' : AdminSettings(generator=ServiceStatus.OFF, stable_diffusion=ServiceStatus.ON)
    }

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
        if settings.generator==ServiceStatus.ON and settings.stable_diffusion == ServiceStatus.ON:
            return settings_map[self.get_settings()]
        elif settings.generator==ServiceStatus.OFF and settings.stable_diffusion == ServiceStatus.OFF:
            return settings_map[self.send_and_receive_from_socket('OFF')]
        elif settings.generator==ServiceStatus.ON and settings.stable_diffusion == ServiceStatus.OFF:
            return settings_map[self.send_and_receive_from_socket('GENERATOR_ON')]
        elif settings.generator==ServiceStatus.OFF and settings.stable_diffusion == ServiceStatus.ON:
            return settings_map[self.send_and_receive_from_socket('STABLE_DIFFUSION_ON')]
        

    def get_settings(self):
        return settings_map[self.send_and_receive_from_socket('GET')]

