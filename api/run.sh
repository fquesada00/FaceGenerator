#!/bin/bash
$API_PATH/venv/bin/uvicorn --port 5000 --workers 1 --reload --log-level info --use-colors  face_generator:app