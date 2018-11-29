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
 * Provides a Manager for Bots.
 *
 * This class manages the registering and instantiation of bots. Bots are configured in the 'bots' folder at the root
 * of the application.
 *
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
   * Deployment handler for the BotManager.
   *
   * This function essentially authenticates and readies all bots.
   *
   * @returns {Promise.<void>}
   */
  static async deploy() {
    // Await deployment of all bots loaded in the manager.
    /** @catch Stop execution. */
    await this.deployBots().catch(Lavenza.stop);
  }

  /**
   * Preparation handler for the BotManager.
   *
   * Registers all bots and fires all of *their* preparation handlers.
   *
   * @returns {Promise.<void>}
   */
  static async prepare() {

    // Await registration all bots from the application files.
    // Upon error in registration, stop the application.
    /** @catch Stop execution. */
    await this.registerBots().catch(Lavenza.stop);

    // Await preparation handlers of all bots loaded in the manager.
    /** @catch Stop execution. */
    await this.prepareBots().catch(Lavenza.stop);

  }

  /**
   * Run deployment handlers for all bots loaded in the Manager.
   *
   * @returns {Promise.<void>}
   */
  static async deployBots() {

    // Await deployment handlers for all bots.
    /** @catch Stop execution. */
    await Promise.all(this.bots.map(async bot => {

      // Await deployment handlers for a single bot.
      /** @catch Stop execution. */
      await bot.deploy().catch(Lavenza.stop);

    })).catch(Lavenza.stop);

  }

  /**
   * Run preparation handlers for all bots loaded in the Manager.
   *
   * @returns {Promise.<void>}
   */
  static async prepareBots() {

    // Await preparation handlers for all bots.
    /** @catch Stop execution. */
    await Promise.all(this.bots.map(async bot => {

      // Await preparation handler for a single bot.
      /** @catch Stop execution. */
      await bot.prepare().catch(Lavenza.stop);

    })).catch(Lavenza.stop);

  }

  /**
   * Registration function for the bots.
   *
   * Bots are instantiated through configuration files located in the 'bots' folder at the root of the application.
   * Check that folder out for more information.
   *
   * This function crawls that folder and instantiates the bots with their configuration files.
   *
   * @returns {Promise.<void>}
   */
  static async registerBots() {

    // Initialize variable that will contain all bots.
    this.bots = [];

    // Fetch all bot directories from the 'bots' folder at the root of the application.
    /** @catch Stop execution. */
    let botDirectories = await Lavenza.Akechi.getDirectoriesFrom(Lavenza.Paths.BOTS).catch(Lavenza.pocket);

    // If for some reason, bot directories could not be loaded, we stop the app.
    if (botDirectories === undefined) {
      Lavenza.throw('NO_BOT_CONFIG_FOLDER_FOUND');
    }

    // Loop through all directories found in the /bots folder.
    /** @catch Stop execution. */
    await Promise.all(botDirectories.map(async directory => {

      // Get the bot name. This is in fact the name of the directory.
      let name = path.basename(directory);

      // If the bot name is part of the ignored bot list, return true now.
      if (name in this.ignoredBots) {
        return;
      }

      // Get the config file for the bot.
      /** @catch Continue execution. */
      let configFilePath = directory + '/' + Lavenza.Keys.BOT_CONFIG_FILE_NAME;
      let config = await Lavenza.Akechi.readYamlFile(configFilePath).catch(Lavenza.continue);

      // If the configuration is empty, stop here.
      // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
      if (Lavenza.isEmpty(config)) {
        Lavenza.warn('BOT_CONFIG_FILE_NOT_FOUND', [name]);
        return;
      }

      // Set directory to the configuration. It's nice to have quick access to the bot folder from within the bot.
      config.directory = directory;

      // If the 'active' flag of the config is set and is not 'true', we don't activate this bot.
      if (config.active !== undefined && config.active === false) {
        Lavenza.warn('BOT_INACTIVE', [name]);
        return;
      }

      // Instantiate and set the bot to the collection.
      this.bots.push(new Bot(name, config));

      // Print a success message.
      Lavenza.success('BOT_REGISTERED', [name]);

    })).catch(Lavenza.stop);

    // Array does not exist, is not an array, or is empty.
    if (Lavenza.isEmpty(this.bots)) {
      Lavenza.throw('NO_BOTS_LOADED');
    }
  }

}
