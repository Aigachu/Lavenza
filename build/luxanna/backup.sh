#!/usr/bin/env bash
mkdir "../../app/backup/$@"
scp -r aigachu@aigachu.com:~/apps/Lavenza-II/app/database "../../app/backup/$@"