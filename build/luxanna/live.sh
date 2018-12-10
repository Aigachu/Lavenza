#!/bin/bash
#
# Build instructions for live environment.
# This scripts runs automatically when code is committed and pushed on the 'live' branch.
# 
# All of this is configured on Codeship.
# 
# @see: https://app.codeship.com/aigachu-sama-nameless-star-7
# 
# If you don't have access to codeship, then talk to Aiga!
# 

# Stop any bot processes that may currently be running.
echo "Stop any bot processes that may currently be running."
echo "--------------------------------------"
echo "forever stopall;"
ssh aigachu@aigachu.com 'forever stopall;'
echo "--------------------------------------"

# Clone repository if not present.
# Generate ssh key for aigachu user and put it in github.
echo "Clone repository if not present."
echo "--------------------------------------"
echo "cd apps; git clone git@github.com:Aigachu/Lavenza-II.git"
ssh aigachu@aigachu.com 'cd apps; git clone git@github.com:Aigachu/Lavenza-II.git'
echo "--------------------------------------"

# Prune origin first.
echo "Prune origin."
echo "--------------------------------------"
echo "cd apps/Lavenza-II/; git remote prune origin;"
ssh aigachu@aigachu.com 'cd apps/Lavenza-II; git remote prune origin;'
echo "--------------------------------------"

# Checkout the live branch.
echo "Checkout the live branch."
echo "--------------------------------------"
echo "cd apps/Lavenza-II; git checkout live;"
ssh aigachu@aigachu.com 'cd apps/Lavenza-II; git checkout live;'
echo "--------------------------------------"

# Pull latest changes.
echo "Pull latest changes."
echo "--------------------------------------"
echo "cd apps/Lavenza-II; git pull;"
ssh aigachu@aigachu.com 'cd apps/Lavenza-II; git pull;'
echo "--------------------------------------"

# Re-install node libraries.
echo "Re-install node libraries."
echo "--------------------------------------"
echo "cd apps/Lavenza-II/app; rm -rf node_modules;"
ssh aigachu@aigachu.com 'cd apps/Lavenza-II/app; rm -rf node_modules;'
echo "cd apps/Lavenza-II/app; npm install;"
ssh aigachu@aigachu.com 'cd apps/Lavenza-II/app; npm install;'
echo "--------------------------------------"

# Copy config & .env.
# scp -r ../../app/bots aigachu@aigachu.com:~/apps/Lavenza-II/app

# Alert for settings.
# DO NOT track settings for each bot.
# Different environnements will have different settings and because github is public,
# people will have access to their tokens. You do NOT want that to happen!
echo "[WARNING] - Make sure config is set for all bots!"

# Summon the bots.
#echo "Summoning bots..."
#echo "--------------------------------------"
#echo "cd apps/Lavenza-II/app; forever start summon.js --babel --bot=lavenza;"
#ssh aigachu@aigachu.com 'cd apps/Lavenza-II; forever start summon.js --babel --bot=lavenza;'
#echo "--------------------------------------"
#echo "Script is done executing!"
