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
  static deploy() {
    // Register all bots from the application files.
    this.deployBots(this.bots);
  }

  // Preparations.
  static prepare() {
    // Register all bots from the application files.
    this.registerBots();

    // Run all Bot preparation functions.
    this.prepareBots();
  }

  /**
   * Run each Bot's prepare function.
   */
  static prepareBots() {
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
  static registerBots() {

    // Initialize variable that will contain all bots.
    let bots = [];

    // Always gotta love flavor.
    Morgana.io('START_BOT_REG');

    // Start Step 1: Get bot directories.
    Morgana.io('START_BOT_DIR_FETCH');
    let botDirectories = Akechi.getDirectoriesFrom(Paths.BOTS);

    // If for some reason, bot directories could not be loaded, we stop the app.
    if (botDirectories === undefined) {
      Morgana.error(3, 'BOT_DIRECTORY_CRAWL_FAILURE');
    }

    // Send success message.
    Morgana.success();

    // Start Step 2: Filter out ignored bots.
    Morgana.io('FILTER_IGNORED_BOTS');

    // Loop through all directories found in the /bots folder.
    botDirectories.every(directory => {

      // Get the bot name. This is in fact the name of the directory.
      let name = Packages.path.basename(directory);

      // If the bot name is part of the ignored bot list, return true now.
      if (name in this.ignoredBots) {
        return true;
      }

      // Instantiate and set the bot to the collection.
      bots.push(new Bot(name, directory));

      return true;
    });

    // Array does not exist, is not an array, or is empty.
    if (Sojiro.isEmpty(bots)) {
      Morgana.error(3, 'NO_BOT_CONFIG_FOUND');
    }

    // Send success message.
    Morgana.success();

    // Final step: Register the bots.
    this.bots = bots;

  }

}

module.exports = BotBunker;
