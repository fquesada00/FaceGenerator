#!/bin/bash

# validate if the script is being run as root or with sudo privileges
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root or with sudo privileges" >&2
    exit 1
fi

# Set the regex pattern to match a specific cronjob
regex=$(echo "0 0 * * * sudo -u root rm -f" | sed 's/[[\.*^$/]/\\&/g')

# Validate if the regex pattern is set
if [ -z "$regex" ]; then
  printf "Error: Regex pattern is not set\n" >&2
  exit 1
fi

# Check if the cron exists
crontab=$(crontab -l 2>/dev/null)
if ! echo "$crontab" | grep -q "$regex"; then
  printf "Cron does not exist\n"
  exit 0
fi

# Remove the matching cronjob from the crontab
new_crontab=$(echo "$crontab" | sed "/^\s*$regex\b/d")
echo "$new_crontab" | crontab - || {
  printf "Error: Failed to update crontab\n" >&2
  exit 1
}

printf "Cron job removed successfully\n"

# Exit with a success status code
exit 0