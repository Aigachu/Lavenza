#!/usr/bin/env bash

#
# This script makes a backup folder of Lavenza's database from the Luxanna server.
# You MUST enter the name of the destination folder as an argument.
# Backups end up in an untracked folder named 'backup' in the /app folder of the application. If it ain't there, create it.
#
# THIS IS VERY RUSHED AND HALF-ASSED. I AM AWARE. LOL!
#

# Make a backup folder.
mkdir "../../../app/backup"
mkdir "../../../app/backup/$@"
mkdir "../../../app/backup/$@"
scp -r aigachu@aigachu.com:~/apps/Lavenza-II/app/database "../../../app/backup/$@"
scp -r aigachu@aigachu.com:~/apps/Lavenza-II/app/lang "../../../app/backup/$@"