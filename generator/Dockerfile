FROM nvcr.io/nvidia/pytorch:21.08-py3
COPY requirements.txt /tmp/requirements.txt
RUN pip3 install -r /tmp/requirements.txt --no-cache-dir
WORKDIR /app
ENTRYPOINT /bin/bash
