#!/usr/bin/env bash

#
# Basically a quick utility script to start Lavenza.
#

# Ignite Lavenza.
ssh aigachu@aigachu.com 'cd apps/Lavenza-II/app; forever -m5 start summon.js --babel --bot=lavenza;'
