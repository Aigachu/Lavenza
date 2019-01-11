#!/usr/bin/env bash

#
# Quick script to push the translations to Luxanna.
#
# WARNING: THIS WILL WIPE THE TRANSLATIONS ON LUXANNA. HIGHLY RECOMMENDED TO BACK UP THE LUXANNA TRANSLATIONS FIRST.
#

# Delete Luxanna's translations.
ssh aigachu@aigachu.com 'cd apps/Lavenza-II/app; rm -rf lang; mkdir lang; touch lang/.gitkeep'

# Upload translations to Luxanna.
scp -r ../../../app/lang aigachu@aigachu.com:~/apps/Lavenza-II/app