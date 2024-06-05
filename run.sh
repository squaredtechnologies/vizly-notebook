#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

# Check if ./server_extension/hecks/static exists, create it if not
if [ ! -d "./server_extension/hecks/static" ]; then
  mkdir -p ./server_extension/hecks/static
fi

# Move files from ./out to server_extension/hecks/static
cp -r ./out/* ./server_extension/hecks/static/

# Uninstall and reinstall hecks package
pip uninstall -y hecks
pip install -e ./server_extension

# Enable Jupyter server extension for hecks
jupyter server extension enable hecks

# Clean up log file
rm -f jupyter_server.log

# Start the Jupyter server with specified configurations
jupyter hecks
