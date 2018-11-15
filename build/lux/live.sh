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
ssh aigachu@138.197.174.254 'forever stopall;'
echo "--------------------------------------"

# Clone repository if not present.
# Generate ssh key for aigachu user and put it in github.
echo "Clone repository if not present."
echo "--------------------------------------"
echo "cd nodejs/apps; git clone git@github.com:Aigachu/discord-maidens.git"
ssh aigachu@138.197.174.254 'cd nodejs/apps; git clone git@github.com:Aigachu/discord-maidens.git'
echo "--------------------------------------"

# Prune origin first.
echo "Prune origin."
echo "--------------------------------------"
echo "cd nodejs/apps/discord-maidens/node; git remote prune origin;"
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; git remote prune origin;'
echo "--------------------------------------"

# Checkout the live branch.
echo "Checkout the live branch."
echo "--------------------------------------"
echo "cd nodejs/apps/discord-maidens/node; git checkout live;"
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; git checkout live;'
echo "--------------------------------------"

# Pull latest changes.
echo "Pull latest changes."
echo "--------------------------------------"
echo "cd nodejs/apps/discord-maidens/node; git pull;"
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; git pull;'
echo "--------------------------------------"

# Re-install node libraries.
echo "Re-install node libraries."
echo "--------------------------------------"
echo "cd nodejs/apps/discord-maidens/node; rm -rf node_modules;"
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; rm -rf node_modules;'
echo "cd nodejs/apps/discord-maidens/node; npm install;"
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; npm install;'
echo "--------------------------------------"

# Alert for settings.
# DO NOT track settings for each bot.
# Different environnements will have different settings and because github is public,
# people will have access to their tokens. You do NOT want that to happen!
echo "[WARNING] - Make sure settings.js is set for all maidens!!"

# Summon the bots.
echo "Summoning bots..."
echo "--------------------------------------"
echo "cd nodejs/apps/discord-maidens/node; forever start summon.js;"
ssh aigachu@138.197.174.254 'cd nodejs/apps/discord-maidens/node; forever start summon.js;'
echo "--------------------------------------"
echo "Script is done executing!"
