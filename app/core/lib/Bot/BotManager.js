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
   * Preparation handler for the BotManager.
   *
   * Registers all bots and fires all of *their* preparation handlers.
   *
   * @returns {Promise.<void>}
   */
  static async prepare() {
    // Await registration of all bots from the application files.
    // Upon error in registration, stop the application.
    await this.registerAllBotsInDirectory();

    // We'll run preparation handlers for all bots as this should only be done once.
    await this.prepareAllBots();

    // Some more flavor.
    await Lavenza.success("Bot Manager preparations complete!");
  }

  /**
   * Execution handler for the BotManager.
   *
   * Deploy only the "Master" bot.
   *
   * @returns {Promise.<void>}
   */
  static async run() {
    // Boot master bot that will manage all other bots in the codebase.
    await this.bootMasterBot();

    // Some more flavor.
    await Lavenza.success("Booted the master bot, {{bot}}!", {bot: Lavenza.Core.settings['master']});

    // Boot auto-boot bots.
    // Some bots are set up for auto-booting. We'll handle those too.
    await this.bootAutoBoots();
  }

  /**
   * Activates the Master Bot for your application.
   *
   * @returns {Promise.<void>}
   */
  static async bootMasterBot() {
    // Await deployment of the master bot.
    await this.boot(Lavenza.Core.settings['master']);
  }

  /**
   * Boots all bots set up in the 'autoboot' array of the settings.
   *
   * @returns {Promise.<void>}
   */
  static async bootAutoBoots() {
    // If the autoboot array is empty, we don't do anything here.
    if (Lavenza.isEmpty(Lavenza.Core.settings['autoboot'])) {
      await Lavenza.warn(`No bots set up for autobooting. Continuing!`);
      return;
    }

    // Boot all bots set up in autobooting.
    await Promise.all(Lavenza.Core.settings['autoboot'].map(async (botId) => {
      await this.boot(botId);
      await Lavenza.success("Successfully Auto-Booted {{bot}}!", {bot: botId});
    }));
  }

  /**
   * Run deployment handlers for all bots loaded in the Manager.
   *
   * @param {string} bot
   *    The ID of the bot to deploy.
   *
   * @returns {Promise.<void>}
   */
  static async boot(bot) {
    // If the bot isn't found, we can't boot it.
    if (Lavenza.isEmpty(this.bots[bot])) {
      await Lavenza.warn(`Tried to boot an non-existent bot: {{bot}}. Gracefully continuing the program.`, {bot: bot});
      return;
    }

    // Await deployment handlers for a single bot.
    await this.bots[bot].deploy();
  }

  /**
   * Shutdown a bot.
   *
   * @param {string} bot
   *   ID of the Bot to shutdown.
   *
   * @returns {Promise<void>}
   */
  static async shutdown(bot) {
    // If the bot isn't found, we can't shut it down.
    if (Lavenza.isEmpty(this.bots[bot])) {
      await Lavenza.warn(`Tried to shutdown an non-existent bot: {{bot}}. Gracefully continuing the program.`, {bot: bot});
      return;
    }

    await this.bots[bot].shutdown();
  }

  /**
   * Run preparation handlers for a single bot loaded in the Manager.
   *
   * @param {string} bot
   *    The ID of the bot to prepare.
   *
   * @returns {Promise.<void>}
   */
  static async prepareBot(bot) {
    // Await preparation handler for a single bot.
    await this.bots[bot].prepare();
  }

  /**
   * Run preparation handlers for all bots loaded in the Manager.
   *
   * @returns {Promise.<void>}
   */
  static async prepareAllBots() {
    // Await preparation handlers for all bots.
    await Promise.all(Object.keys(this.bots).map(async botId => {
      // Await preparation handler for a single bot.
      await this.bots[botId].prepare();
    }));
  }

  /**
   * Run registration and instantiate a bot.
   *
   * @param {string} botId
   *    The ID of the bot to register.
   * @param {string} directory
   *    Path to the directory where this bot's files are located.
   *
   * @returns {Promise.<void>}
   */
  static async registerBot(botId, directory = undefined) {

    // If the directory isn't provided, we'll get it ourselves.
    if (directory === undefined) {
      directory = Lavenza.Paths.BOTS + '/' + botId;
    }

    // If the bot name is part of the ignored bot list, return now.
    if (botId in this.ignoredBots) {
      return;
    }

    // Get the config file for the bot.
    /** @catch Continue execution. */
    let configFilePath = directory + '/' + Lavenza.Keys.BOT_CONFIG_FILE_NAME;
    let config = await Lavenza.Akechi.readYamlFile(configFilePath).catch(Lavenza.continue);

    // If the configuration is empty, stop here.
    // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
    if (Lavenza.isEmpty(config)) {
      await Lavenza.warn('Configuration file could not be loaded for following bot: {{bot}}', {bot: botId});
      return;
    }

    // Set directory to the configuration. It's nice to have quick access to the bot folder from within the bot.
    config.directory = directory;

    // If the 'active' flag of the config is set and is not 'true', we don't activate this bot.
    if (config.active !== undefined && config.active === false) {
      await Lavenza.warn('The {{bot}} bot has been set to inactive. It will not be registered.', {bot: botId});
      return;
    }

    // Instantiate and set the bot to the collection.
    let bot = new Bot(botId, config);
    if (bot.id === Lavenza.Core.settings['master']) {
      bot.isMaster = true;
    }
    Object.assign(this.bots, {[botId]: bot});

    // Print a success message.
    await Lavenza.success('The {{bot}} bot has successfully been registered!', {bot: botId});
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
  static async registerAllBotsInDirectory() {

    // Initialize variable that will contain all bots.
    this.bots = {};

    // Fetch all bot directories from the 'bots' folder at the root of the application.
    let botDirectories = await Lavenza.Akechi.getDirectoriesFrom(Lavenza.Paths.BOTS).catch(Lavenza.pocket);

    // If for some reason, bot directories could not be loaded, we stop the app.
    if (botDirectories === undefined) {
      await Lavenza.throw("Other than the 'example' folder, no bot folders seem to exist in /app/bots. The whole point of this app is to run bots, so create one!");
    }

    // Loop through all directories we need to.
    await Promise.all(botDirectories.map(async directory => {

      // Get the bot name. This is in fact the name of the directory.
      let name = path.basename(directory);

      // Register the bot.
      await this.registerBot(name);

    }));

    // Array does not exist, is not an array, or is empty.
    if (Lavenza.isEmpty(this.bots)) {
      await Lavenza.throw("No bots were registered after the preparation phase. As a result, there is nothing to run.");
    }
  }

}
