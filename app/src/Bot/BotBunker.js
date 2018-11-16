/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */

// Confidants.
const Akechi = require('../Confidants/Akechi');
const Morgana = require('../Confidants/Morgana');
const Sojiro = require("../Confidants/Sojiro");
const Igor = require('../Confidants/Igor');

// Includes.
const Bot = require('../Bot/Bot');

/**
 * Provides a object for the Bot Bunker.
 *
 * This class managers the registering and instantiation of bots. This is the
 * fruit of the application, for now of course.
 */
class BotBunker {

  // Ignored bot names.
  // We use this to prevent loading unneeded bot folders, like the example one.
  static get ignoredBots() {
    return {
      example: 'example',
    };
  }

  /**
   * Initialize and run bots.
   */
  static async deploy() {
    // Register all bots from the application files.
    await this.deployBots().catch(Igor.stop);
  }

  /**
   *
   * @returns {Promise<void>}
   */
  static async prepare() {
    // Register all bots from the application files.
    // Upon error in registration, stop the application.
    await this.registerBots().catch(Igor.stop);

    // Run all Bot preparation functions.
    await this.prepareBots().catch(Igor.stop);
  }

  /**
   * Run each Bot's deploy function.
   */
  static async deployBots() {
    this.bots.every(bot => {
      bot.deploy();
      return true;
    });
  }

  /**
   * Run each Bot's prepare function.
   */
  static async prepareBots() {
    this.bots.every(bot => {
      bot.prepare();
      return true;
    });
  }

  /**
   * Check the available bots in the application and register them.
   *
   * This will create and prepare the bots for use in the application.
   */
  static async registerBots() {

    // Initialize variable that will contain all bots.
    let bots = [];

    // Always gotta love flavor.
    Morgana.log('START_BOT_REG');

    // Start Step 1: Get bot directories.
    Morgana.log('START_BOT_DIR_FETCH');
    let botDirectories = await Akechi.getDirectoriesFrom(Paths.BOTS);

    // If for some reason, bot directories could not be loaded, we stop the app.
    if (botDirectories === undefined) {
      throw new Error('BOT_DIRECTORY_CRAWL_FAILURE');
    }

    // Send success message.
    Morgana.success();

    // Start Step 2: Filter out ignored bots.
    Morgana.log('FILTER_IGNORED_BOTS');

    // Loop through all directories found in the /bots folder.
    await Promise.all(botDirectories.map(async directory => {
      // Get the bot name. This is in fact the name of the directory.
      let name = Packages.path.basename(directory);

      // If the bot name is part of the ignored bot list, return true now.
      if (name in this.ignoredBots) {
        return true;
      }

      // Get the config file for the bot.
      let configFilePath = directory + '/' + Keys.BOT_CONFIG_FILE_NAME;
      let config = await Akechi.readYamlFile(configFilePath).catch(Igor.continue);

      // If the configuration is not empty, let's successfully register the bot.
      if (!Sojiro.isEmpty(config)) {
        // Instantiate and set the bot to the collection.
        bots.push(new Bot(name, directory, config));
      } else {
        Morgana.status('BOT_CONFIG_FILE_NOT_FOUND', [name]);
      }

      return true;
    })).catch(Igor.continue);

    // Array does not exist, is not an array, or is empty.
    if (Sojiro.isEmpty(bots)) {
      throw new Error('NO_BOT_CONFIG_FOLDER_FOUND');
    }

    // Send success message.
    Morgana.success();

    // Final step: Register the bots.
    this.bots = bots;

  }

}

module.exports = BotBunker;
