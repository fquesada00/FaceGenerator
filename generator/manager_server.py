import signal
import socket
import os
import subprocess

host = os.environ.get("MANAGER_HOST", "127.0.0.1")
port = int(os.environ.get("MANAGER_PORT", "8888"))

generator_pid = None

def start_generator():
    global generator_pid 
    if generator_pid is None:
        process = subprocess.Popen(["python", "/app/server.py"])
        generator_pid = process.pid

def stop_generator():
    global generator_pid
    if generator_pid is not None:
        os.kill(generator_pid, signal.SIGKILL)
        generator_pid = None

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
                

                if data_str == 'ON':
                    # Turn ON
                    print("ON")
                    start_generator()
                    pass
                elif data_str == 'OFF':
                    # Turn OFF
                    print("OFF")
                    stop_generator()
                    pass
                conn.sendall(data)


