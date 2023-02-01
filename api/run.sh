#!/bin/bash
$API_PATH/venv/bin/uvicorn --port 5000 --reload --workers 1 face_generator:app
