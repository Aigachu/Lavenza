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
 * This class manages the registering and instantiation of bots.
 *
 * Bots are configured in the 'bots' folder at the root of the application.
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

    // Some more flavor.
    Lavenza.success("All configured bots have been successfully deployed!");

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

    // Some more flavor.
    Lavenza.status("Bot Manager preparations complete!");

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

    // Initialize the array to store bot directories.
    let botDirectories = [];

    // Check if specific bots were set to run in the core.
    if (Lavenza.Core.bots) {

      // Await the processing of all bots that were set to run.
      await Promise.all(Lavenza.Core.bots.map(bot => {

        // We check if a bot directory exists for this bot. If not, we have to throw an error.
        if (!Lavenza.Akechi.directoryExists(Lavenza.Paths.BOTS + '/' + bot)) {
          console.log(Lavenza.Paths.BOTS + '/' + bot);
          Lavenza.throw(`No directory found for {{bot}}. Verify that a folder exists for this bot at /app/bots.`, {bot: bot});
        }

        // If the directory exist, we can set it up for processing later.
        botDirectories.push(Lavenza.Paths.BOTS + '/' + bot);

      })).catch(Lavenza.throw);

    } else {

      // Fetch all bot directories from the 'bots' folder at the root of the application.
      /** @catch Stop execution. */
      botDirectories = await Lavenza.Akechi.getDirectoriesFrom(Lavenza.Paths.BOTS).catch(Lavenza.pocket);

      // If for some reason, bot directories could not be loaded, we stop the app.
      if (botDirectories === undefined) {
        Lavenza.throw("Other than the 'example' folder, no bot folders seem to exist at /app/bots. The whole point of this app is to run bots, so create one!");
      }
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
        Lavenza.warn('Configuration file could not be loaded for following bot: {{bot}}', {bot: name});
        return;
      }

      // Set directory to the configuration. It's nice to have quick access to the bot folder from within the bot.
      config.directory = directory;

      // If the 'active' flag of the config is set and is not 'true', we don't activate this bot.
      if (config.active !== undefined && config.active === false) {
        Lavenza.warn('The {{bot}} bot has been set to inactive. It will not be registered.', {bot: name});
        return;
      }

      // Instantiate and set the bot to the collection.
      this.bots.push(new Bot(name, config));

      // Print a success message.
      Lavenza.success('The {{bot}} bot has successfully been registered!', {bot: name});

    })).catch(Lavenza.stop);

    // Array does not exist, is not an array, or is empty.
    if (Lavenza.isEmpty(this.bots)) {
      Lavenza.throw("No bots were registered after the preparation phase. As a result, there is nothing to run.");
    }
  }

}
