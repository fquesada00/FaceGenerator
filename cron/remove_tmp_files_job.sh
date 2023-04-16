#!/bin/bash

(crontab -l ; echo "0 0 * * * sudo -u root rm -f $PWD/../api/faces/tmp/*") | crontab -

echo "Cron job installed successfully"