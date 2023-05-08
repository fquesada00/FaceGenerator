import signal
import socket
import os
import subprocess

host = os.environ.get("MANAGER_HOST", "127.0.0.1")
port = int(os.environ.get("MANAGER_PORT", "8888"))


profiles = {
    'sd': ['auto'],
    'api': [],
    'generator': [],
    'database': [],
    'proxy': []
}



compose_files = {
    'sd': './stable-diffusion/docker-compose.yml',
    'api': './api/docker-compose.yml',
    'generator': './generator/docker-compose.yml',
    'database': './database/docker-compose.yml',
    'proxy': './proxy/docker-compose.yml'
}


def start_container(service:str):
    print(f"Starting {service}")
    command = ["docker", "compose", "-f", compose_files[service]]
    for profile in profiles[service]:
        command.append("--profile")
        command.append(profile)
    command.append("up")
    command.append("-d")
    return subprocess.run(command).returncode

def stop_container(service:str):
    print(f"Stopping {service}")
    command = ["docker", "compose", "-f", compose_files[service]]
    for profile in profiles[service]:
        command.append("--profile")
        command.append(profile)
    command.append("down")
    return subprocess.run(command).returncode

def get_container_status(service:str):
    command = ["docker", "compose", "-f", compose_files[service]]
    for profile in profiles[service]:
        command.append("--profile")
        command.append(profile)
    command.append("ps")
    command.append("-q")
    result = subprocess.run(command, capture_output=True, text=True).stdout
    return len(result) > 0
    


def start_generator():
    if not get_container_status('generator'):
        stop_container('sd')
        start_container('generator')
        return "GENERATOR_ON"

def start_stable_diffusion():
    if not get_container_status('sd'):
        stop_container('generator')
        start_container('sd')
    return "STABLE_DIFFUSION_ON"

def stop():
    stop_container('sd')
    stop_container('generator')
    return "OFF"
    
def get_process_status():
    if get_container_status('sd'):
        return 'STABLE_DIFFUSION_ON'
    elif get_container_status('generator'):
        return 'GENERATOR_ON'
    else:
        return 'OFF'



commands = {
    'GENERATOR_ON': start_generator,
    'GET': get_process_status,
    'STABLE_DIFFUSION_ON': start_stable_diffusion,
    'OFF': stop,
}

def main():
    print("Starting orchestator")
    stop_container('sd')
    stop_container('generator')
    stop_container('api')
    stop_container('database')
    stop_container('proxy')

    start_container('api')
    start_container('database')
    start_container('proxy')
    start_generator()


    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        s.bind((host, port))
        s.listen()
        while True:
            conn, addr = s.accept()
            with conn:
                print(f"Connected by {addr}")
                while True:
                    data = conn.recv(1024)
                    if not data:
                        break
                    
                    data_str = data.decode('utf-8')
                    
                    if data_str in commands:
                        res = commands[data_str]()
                        if res:
                            data = bytes(res, 'utf-8')
                    else:
                        data = bytes(' ', 'utf-8')
                    conn.sendall(data)


if __name__ == "__main__":
    main()