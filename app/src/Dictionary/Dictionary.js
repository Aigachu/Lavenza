/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a collection of strings to be used across the application.
 *
 * @TODO - We'll be converting to https://www.npmjs.com/package/i18n down the line, which will be much better AND allow for translations to other languages! Hype!
 *
 * This allows us to manage all of our strings in one place.
 *
 * Much easier to modify strings in the future.
 *
 * @see ../Confidants/Futaba
 *   Futaba uses this dictionary. When using the Lavenza logging functions, you can provide a 'Key' instead of a real
 *   line of text, and Futaba will translate it by checking if the key exists in this dictionary. Pretty handy.
 */
export default {

  // === Status Messages ===
  INITIALIZING: 'Welcome to Lavenza II!\nInitializing Lavenza v@1...\n',
  PREPARATION_PHASE: 'Executing phase: PREPARATION!',
  SUCCESS: [
      'All right, Joker! Very smooth!',
      'All good! Moving on.',
      'Smooth moves Joker!',
      'Whoa! A critical hit!',
  ],
  ERROR: [
      '!!!ERROR!!!',
      'Oh shit...Something went wrong Joker...',
      'Oh my god suck my DYACK...',
      `Must be Javascript's fault...`,
  ],

  // === Gestalt ===
  GESTALT_PREP: '<Gestalt>: Initializing...',
  GESTALT_BOOTSTRAP: '<Gestalt>: Bootstrapping database...',
  GESTALT_READY: '<Gestalt>: Ready.',

  // === Bot Preparations ===
  BOT_MANAGER_PREP: '<BotManager>: Launching preparations...',
  BOT_MANAGER_DEPLOY: '<BotManager>: Deploying...',
  START_BOT_REG: 'Starting Bot Registration process...',
  START_BOT_DIR_FETCH: 'Step 1: Fetching bot directories...',
  REGISTER_BOTS: 'Step 2: Registering bots...',
  BOT_REGISTERED: 'Successfully registered @1!',
  BOT_INACTIVE: 'The {@1} bot was found, but it is currently set as inactive. It will be ignored.',
  BOT_MANAGER_READY: '<BotManager>: Preparations completed!',
  CLIENTS_INITIALIZED_FOR_BOT: 'Clients successfully initialized for {@1}!',
  CLIENTS_AUTHENTICATED_FOR_BOT: 'Clients successfully authenticated for {@1}!',
  BOT_MANAGER_DEPLOYED: '<BotManager>: Deployment complete!',
  COMMANDS_SET_FOR_BOT: 'Commands successfully inherited from all talents for {@1}!',
  LISTENERS_SET_FOR_BOT: 'Listeners successfully set & inherited from all talents for {@1}!',

  // === Talents ===
  TALENT_MANAGER_PREP: '<TalentManager>: Launching preparations...',
  START_TALENT_LOAD: 'Starting Talent Loading process...',
  CORE_TALENT_LOADED: 'Loaded {@1} core talent!',
  CUSTOM_TALENT_LOADED: 'Loaded {@1} custom talent!',
  NO_COMMANDS_FOUND_FOR_TALENT: 'There were no commands defined for the {@1} talent. This might not be normal!',
  NO_TALENT_CONFIG_FOUND_FOR_BOT: 'The {@1} bot has no talent configuration! No custom talents will be loaded for it.',
  CUSTOM_TALENT_NOT_FOUND: 'The {@1} custom talent was not found and could not be loaded.',
  COMMAND_CONFIG_FILE_NOT_FOUND: 'Could not locate a config file for the {@1} command in the {@2} talent. This command will not work.',
  COMMAND_PLATFORM_CONFIG_MISSING: 'The [platforms] key is missing from the configuration in the {@1} command of the {@2} talent. This command will not be functional.',
  COMMAND_CLASS_MISSING: 'Command class could not be loaded for the {@1} command in the {@2} talent.',
  NO_LISTENERS_FOUND_FOR_TALENT: 'There are no listeners defined in the {@1} talent!',
  TALENT_DOES_NOT_EXIST: 'The {@1} talent does not exist!',
  TALENT_MANAGER_READY: '<TalentManager>: Preparations completed!',
  TALENTS_LOADED_FOR_BOT: 'Talents successfully granted to {@1}',
  ERROR_LOADING_TALENT: 'An error occurred when trying to load the {@1} custom talent. Please verify that it truly exists and is properly configured.',

  // === Discord ===
  DISCORD_CLIENT_DISCONNECT: 'Discord client for {@1} has disconnected...',
  DISCORD_CLIENT_CONNECT: 'Discord client for {@1} has connected!',

  // === Warnings ===
  BOT_DIRECTORY_FOUND_BUT_NO_CONFIG: 'A bot directory (@1) was located, but a config.yml file is missing for it. Please create one for the bot to run properly.',

  // === Errors ===
  DECLARE_EXIT: 'Lavenza will now shut down due to the error. Fix me please. ;_;',
  NO_BOT_CONFIG_FOLDER_FOUND: 'Bot folders could not be located in the /bots folder at the root of the application. Did you create any?\n' +
                        'Bot configuration can be created by following the example found in /bots/example directory.',
  BOT_CONFIG_FILE_NOT_FOUND: 'Bot configuration file not found for {@1}. Please create a configuration file based on the /bots/example/example.config.yml file.',
  BOT_DIRECTORY_CRAWL_FAILURE: 'An error occurred when Akechi tried to find the bot folders in the /bots folder. Please fix the code!',
  CLIENT_AUTHENTICATION_FAILURE: 'Failed to authenticate the {@1} client for @2. You may want to check authentication configurations.',

}
