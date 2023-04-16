#!/bin/bash

regex=$(echo "0 0 * * * sudo -u root rm -f" | sed 's/[[\.*^$/]/\\&/g')

crontab -l | sed "/^\s*$regex\b/d" | crontab -