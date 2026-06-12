#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting production server..."
  HOSTNAME=0.0.0.0 PORT=3000 node .next/standalone/server.js
  EXIT=$?
  echo "[$(date)] Server exited with code $EXIT"
  sleep 3
done
