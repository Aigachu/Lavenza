#!/usr/bin/env bash

# Delete current database.
ssh aigachu@aigachu.com 'cd apps/Lavenza-II/app; rm -rf database; mkdir database; touch database/.gitkeep'

# Copy config & .env.
scp -r ../../app/database aigachu@aigachu.com:~/apps/Lavenza-II/app