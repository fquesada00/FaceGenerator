FROM nvcr.io/nvidia/pytorch:21.08-py3
COPY requirements.txt /tmp/requirements.txt
RUN --mount=type=cache,target=/root/.cache pip3 install -r /tmp/requirements.txt

#install a jupyter server
RUN pip3 install jupyterlab

WORKDIR /app
ENTRYPOINT /bin/bash
