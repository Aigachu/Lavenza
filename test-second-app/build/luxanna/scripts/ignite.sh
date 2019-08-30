#!/usr/bin/env bash

#
# Basically a quick utility script to start Lavenza.
#

# Ignite Lavenza.
ssh aigachu@aigachu.com 'cd apps/Lavenza-II/app; pm2 start summon.js --name=lavenza -- --babel --bot=lavenza;'
