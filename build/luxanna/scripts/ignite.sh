#!/usr/bin/env bash

# Ignite Lavenza.
ssh aigachu@aigachu.com 'cd apps/Lavenza-II/app; forever -m5 start summon.js --babel --bot=lavenza;'
