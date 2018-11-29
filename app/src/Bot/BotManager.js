/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import path from 'path';

// Imports.
import Bot from './Bot';

/**
 * Provides a object for Joker.
 *
 * Another name for this could be BotManager.
 *
 * This class manages the registering and instantiation of bots. This is the
 * fruit of the application, for now of course. Bots can be considered Persona in a way, and Joker has the ability
 * to command lots of them.
 *
 * This is getting out of hand already. LOL.
 */
export default class BotManager {

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
    await this.deployBots().catch(Lavenza.stop);
  }

  /**
   *
   * @returns {Promise<void>}
   */
  static async prepare() {
    // Register all bots from the application files.
    // Upon error in registration, stop the application.
    await this.registerBots().catch(Lavenza.stop);

    // Run all Bot preparation functions.
    await this.prepareBots().catch(Lavenza.stop);
  }

  /**
   * Run each Bot's deploy function.
   */
  static async deployBots() {
    await Promise.all(this.bots.map(async bot => {
      await bot.deploy().catch(Lavenza.continue);
    }));
  }

  /**
   * Run each Bot's prepare function.
   */
  static async prepareBots() {
    await Promise.all(this.bots.map(async bot => {
      await bot.prepare().catch(Lavenza.continue);
    }));
  }

  /**
   * Check the available bots in the application and register them.
   *
   * This will create and prepare the bots for use in the application.
   */
  static async registerBots() {

    // Initialize variable that will contain all bots.
    this.bots = [];

    // Always gotta love flavor.
    Lavenza.status('START_BOT_REG');

    // Start Step 1: Get bot directories.
    Lavenza.status('START_BOT_DIR_FETCH');
    let botDirectories = await Lavenza.Akechi.getDirectoriesFrom(Lavenza.Paths.BOTS);

    // If for some reason, bot directories could not be loaded, we stop the app.
    if (botDirectories === undefined) {
      Lavenza.throw('BOT_DIRECTORY_CRAWL_FAILURE');
    }

    // Send success message.
    Lavenza.success();

    // Start Step 2: Filter out ignored bots.
    Lavenza.status('REGISTER_BOTS');

    // Loop through all directories found in the /bots folder.
    await Promise.all(botDirectories.map(async directory => {
      // Get the bot name. This is in fact the name of the directory.
      let name = path.basename(directory);

      // If the bot name is part of the ignored bot list, return true now.
      if (name in this.ignoredBots) {
        return true;
      }

      // Get the config file for the bot.
      let configFilePath = directory + '/' + Lavenza.Keys.BOT_CONFIG_FILE_NAME;
      let config = await Lavenza.Akechi.readYamlFile(configFilePath).catch(Lavenza.continue);
      config.directory = directory;

      // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.

      // If the configuration is not empty, let's successfully register the bot.
      if (!Lavenza.isEmpty(config)) {
        // If the 'active' flag of the config is set and is not 'true', we don't activate this bot.
        if (config.active !== undefined && config.active === false) {
          Lavenza.warn('BOT_INACTIVE', [name]);
          return;
        }

        // Instantiate and set the bot to the collection.
        this.bots.push(new Bot(name, config));
        Lavenza.success('BOT_REGISTERED', [name]);
      } else {
        Lavenza.warn('BOT_CONFIG_FILE_NOT_FOUND', [name]);
      }

      return true;
    })).catch(Lavenza.continue);

    // Array does not exist, is not an array, or is empty.
    if (Lavenza.isEmpty(this.bots)) {
      Lavenza.throw('NO_BOT_CONFIG_FOLDER_FOUND');
    }

    // Send success message.
    Lavenza.success();

  }

}
