/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */


/**
 * Provides a collection of strings to be used across the application.
 *
 * This allows us to manage all of our strings in Dictionaries.
 *
 * Much easier to modify strings in the future.
 *
 * @see ../Confidants/Futaba
 */
module.exports = {

  // === Status Messages ===
  INITIALIZING: 'Welcome to Lavenza II!\nInitializing Lavenza v@1...\n',
  BEGINNING_PREP: 'Beginning preparations!...',
  SUCCESS: [
      'All right, Joker! Very smooth!',
      'All good! Moving on.',
      'Smooth moves Joker!',
      'Whoa! A critical hit!',
  ],

  // === Bot Preparations ===
  START_BOT_REG: 'Starting Bot Registration process...',
  START_BOT_DIR_FETCH: 'Step 1: Fetching bot directories...',
  FILTER_IGNORED_BOTS: 'Step 2: Filtering ignored bots...',

  // === Warnings ===
  BOT_DIRECTORY_FOUND_BUT_NO_CONFIG: 'A bot directory (@1) was located, but a config.yml file is missing for it. Please create one for the bot to run properly.',

  // === Errors ===
  DECLARE_EXIT: 'Lavenza will now shut down due to the error. Fix me please. ;_;',
  NO_BOT_CONFIG_FOUND: 'Bot folders could not be located in the /bots folder at the root of the application. Did you create any?\n' +
                        'Bot configuration can be created by following the example found in /bots/example directory.',
  BOT_DIRECTORY_CRAWL_FAILURE: 'An error occurred when Akechi tried to find the bot folders in the /bots folder. Please fix the code!',
  ERROR_LEVEL_0: '!!!ERROR!!!',
  ERROR_LEVEL_1: '!!!ERROR!!!',
  ERROR_LEVEL_2: '!!!ERROR!!!',
  ERROR_LEVEL_3: '!!!FATAL ERROR!!!',

};
