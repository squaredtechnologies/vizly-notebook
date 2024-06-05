#!/bin/bash

# Clean up log file
rm -f jupyter_server.log

# Start the Jupyter server with specified configurations
jupyter server --ServerApp.allow_origin_pat="^(http?://localhost:3000|https?://.*\\.noterous\\.com|https?://noterous\\.onrender\\.com|https?://(.*\\.)?vizly\\.fyi|https?://(.*\\.)?vizlylabs\\.com)$" \
               --ServerApp.allow_credentials=True \
               --ServerApp.token="123" \
               --ServerApp.password="" \
               --Application.log_level=0 \
               --debug
