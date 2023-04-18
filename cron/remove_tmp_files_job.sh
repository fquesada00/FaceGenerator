#!/bin/bash

# this script installs a cron job to run a command that deletes files from a specific directory
# at midnight every day

# validate if the script is being run as root or with sudo privileges
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root or with sudo privileges" >&2
    exit 1
fi

# validate if the directory to be cleaned exists and is writable
dir="$PWD/../api/faces/tmp"
if [ ! -d "$dir" ]; then
    echo "Directory $dir does not exist" >&2
    exit 1
elif [ ! -w "$dir" ]; then
    echo "Directory $dir is not writable" >&2
    exit 1
fi

# install the cron job to run the command that deletes files from the directory at midnight every day
(crontab -l ; echo "0 0 * * * sudo -u root rm -f $dir/*") | crontab -

# check if the cron job was installed successfully
if [ $? -eq 0 ]; then
    echo "Cron job installed successfully"
else
    echo "Failed to install cron job" >&2
    exit 1
fi

# exit with a success status code
exit 0