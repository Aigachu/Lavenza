#!/usr/bin/env bash

# Make a backup folder.
mkdir "../../app/backup/$@"
scp -r aigachu@aigachu.com:~/apps/Lavenza-II/app/database "../../app/backup/$@"