#!/usr/bin/env bash

#
# Basically a quick utility script to shutdown Lavenza.
#

# Shutdown Lavenza
ssh aigachu@aigachu.com 'pm2 stop lavenza;'
ssh aigachu@aigachu.com 'pm2 stop yuria;'