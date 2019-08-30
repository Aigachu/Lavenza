#!/usr/bin/env bash

#
# Quick script to fetch translations from Luxanna.
#
# WARNING: THIS WILL WIPE THE LOCAL TRANSLATIONS ON LUXANNA.
#

# Delete local translations database.
rm -rf ../../../app/lang;

# Download the ones from Luxanna.
scp -r aigachu@aigachu.com:~/apps/Lavenza-II/app/lang ../../../app;