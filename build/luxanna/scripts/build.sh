#!/bin/bash

#
# Manually runs a build operation to deploy Lavenza on the Luxanna server.
# This can only run if you have SSH Keys setup to connect to the Luxanna server. This can only be granted / setup with
# Aiga! So check with him how to set it up. Continuous integration may be set up again in the future like it was on
# the Maidens, but for now this is not a priority.
#
# Important note: The bots in the /app/bots folder of the application are the ones that will be deployed.
#

# On Luxanna, stop any bot processes that may currently be running.
echo "Stop any bot processes that may currently be running."
echo "--------------------------------------"
echo "forever stopall;"
ssh aigachu@aigachu.com 'forever stopall;'
echo "--------------------------------------"

# On Luxanna, clone repository if not present.
# Generate ssh key for aigachu user and put it in github.
echo "Clone repository if not present."
echo "--------------------------------------"
echo "cd apps; git clone git@github.com:Aigachu/Lavenza-II.git"
ssh aigachu@aigachu.com 'cd apps; git clone git@github.com:Aigachu/Lavenza-II.git'
echo "--------------------------------------"

# On Luxanna, prune origin first.
echo "Prune origin."
echo "--------------------------------------"
echo "cd apps/Lavenza-II/; git remote prune origin;"
ssh aigachu@aigachu.com 'cd apps/Lavenza-II; git remote prune origin;'
echo "--------------------------------------"

# On Luxanna, perform a git reset to make sure we're working with a clean version of the repo.
echo "Reset codebase."
echo "--------------------------------------"
echo "cd apps/Lavenza-II/; git reset --hard;"
ssh aigachu@aigachu.com 'cd apps/Lavenza-II; git reset --hard;'
echo "--------------------------------------"

# On Luxanna, pull latest changes.
echo "Pull latest changes."
echo "--------------------------------------"
echo "cd apps/Lavenza-II; git pull;"
ssh aigachu@aigachu.com 'cd apps/Lavenza-II; git pull;'
echo "--------------------------------------"

# On Luxanna, checkout the live branch.
echo "Checkout the live branch."
echo "--------------------------------------"
echo "cd apps/Lavenza-II; git checkout live;"
ssh aigachu@aigachu.com 'cd apps/Lavenza-II; git checkout live;'
echo "--------------------------------------"

# On Luxanna, re-install node libraries.
echo "Re-install node libraries."
echo "--------------------------------------"
#echo "cd apps/Lavenza-II/app; rm -rf node_modules;"
#ssh aigachu@aigachu.com 'cd apps/Lavenza-II/app; rm -rf node_modules;'
echo "cd apps/Lavenza-II/app; npm install;"
ssh aigachu@aigachu.com 'cd apps/Lavenza-II/app; npm install;'
echo "--------------------------------------"

# Copy config & .env to the Lavenza codebase on Luxanna.
scp -r ../../../app/bots aigachu@aigachu.com:~/apps/Lavenza-II/app
scp ../../../app/.env aigachu@aigachu.com:~/apps/Lavenza-II/app

# Summon the bots using Forever.
# Forever will automatically restart the bots if they crash, but only a maximum of 5 times.
echo "Summoning bots..."
echo "--------------------------------------"
echo "cd apps/Lavenza-II/app; forever -m5 start summon.js --babel --bot=lavenza;"
ssh aigachu@aigachu.com 'cd apps/Lavenza-II/app; forever -m5 start summon.js --babel --bot=lavenza;'
echo "--------------------------------------"
echo "Script is done executing!"
