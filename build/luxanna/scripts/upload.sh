#!/usr/bin/env bash

#
# Basically a quick utility script to upload the local database to Luxanna.
#
# WARNING: THIS WILL WIPE THE DATABASE ON LUXANNA. HIGHLY RECOMMENDED TO BACK UP THE LUXANNA DATABASE FIRST.
#

# Delete current database.
ssh aigachu@aigachu.com 'cd apps/Lavenza-II/app; rm -rf database; mkdir database; touch database/.gitkeep'

# Copy config & .env.
scp -r ../../../app/database aigachu@aigachu.com:~/apps/Lavenza-II/app