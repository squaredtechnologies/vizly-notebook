#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

# Run the yarn build:prod command
yarn build:prod

# Check if the previous command was successful
if [ $? -ne 0 ]; then
    echo "Yarn build failed. Exiting."
    exit 1
fi

# Run the existing run.sh script
sh run.sh
