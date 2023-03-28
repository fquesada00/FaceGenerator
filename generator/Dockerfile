FROM tensorflow/tensorflow:1.14.0-gpu-py3
COPY requirements.txt /tmp/requirements.txt
RUN apt-get update || echo "Done"
RUN apt-get install -y cmake
RUN apt-get install -y libgl1
RUN pip3 install --upgrade pip --no-cache-dir
RUN pip3 install -r /tmp/requirements.txt --no-cache-dir
WORKDIR /app
ENTRYPOINT /bin/bash
