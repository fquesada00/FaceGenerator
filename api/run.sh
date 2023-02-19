#!/bin/bash
$PROJECT_PATH/api/venv/bin/uvicorn --host 0.0.0.0 --port 5000 --workers 1 --reload --log-level info --use-colors  face_generator:app