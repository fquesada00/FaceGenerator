#!/bin/bash
$API_PATH/venv/bin/gunicorn --bind 0.0.0.0:5000 --workers 1 --timeout 4800 face_generator:app
