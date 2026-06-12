#!/bin/bash
while true; do
  echo "[$(date)] Starting server..."
  cd /home/z/my-project
  node server-start.js 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 2s..."
  sleep 2
done
