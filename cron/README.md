# Face Generator CRON
Face Generator CRON built with .sh scripts.

## Purpose
The purpose of this cron is to delete all tmp generated files (every day at midnight) in order to free up space on the server.

## Setup
1. Access as root (or run with sudo as in next step)
```bash
sudo su
```
2. Run:
```bash
./remove_tmp_files_job.sh
```
or run with sudo:
```bash
sudo bash ./remove_tmp_files_job.sh
```
## Cron job removal
1. Access as root (or run with sudo as in next step)
```bash
sudo su
```
2. Run:
```bash
./delete_job.sh
```
or run with sudo:
```bash
sudo bash ./delete_job.sh
```

## Verify cron job
1. Access as root (or run with sudo as in next step)
```bash
sudo su
```
2. Run:
```bash
crontab -l
```
or run with sudo:
```bash
sudo crontab -l
```