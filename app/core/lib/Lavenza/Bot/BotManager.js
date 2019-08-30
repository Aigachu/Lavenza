/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
const path = require('path');

// Imports.
const Akechi = require('../Confidants/Akechi');
const Morgana = require('../Confidants/Morgana');
const Sojiro = require('../Confidants/Sojiro');
const Igor = require('../Confidants/Igor');
const Bot = require('./Bot');
const StaticClass = require('../Model/StaticClass');

/**
 * Provides a Manager for Bots.
 *
 * This class manages the registering and instantiation of bots.
 *
 * Bots are configured in the 'bots' folder at the root of the application.
 *
 */
module.exports = class BotManager extends StaticClass {

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
   */
  static async build(core) {
    // Initialize variable that will store talents.
    this.core = core;
    this.bots = {};

    // Await registration of all bots from the application files.
    // Upon error in registration, stop the application.
    await this.registerAllBotsInDirectory();

    // We'll run preparation handlers for all bots as this should only be done once.
    await this.prepareAllBots();

    // Some more flavor.
    await Morgana.success("Bot Manager preparations complete!");
  }

  /**
   * Execution handler for the BotManager.
   *
   * Deploy only the "Master" bot.
   */
  static async run() {
    // Boot master bot that will manage all other bots in the codebase.
    await this.bootMasterBot();

    // Some more flavor.
    await Morgana.success("Booted the master bot, {{bot}}!", {bot: this.core.settings.master});

    // Boot auto-boot bots.
    // Some bots are set up for auto-booting. We'll handle those too.
    await this.bootAutoBoots();
  }

  /**
   * Activates the Master Bot for your application.
   */
  static async bootMasterBot() {
    // Await deployment of the master bot.
    await this.boot(this.core.settings.master);
  }

  /**
   * Boots all bots set up in the 'autoboot' array of the settings.
   */
  static async bootAutoBoots() {
    // If the autoboot array is empty, we don't do anything here.
    if (Sojiro.isEmpty(this.core.settings.autoboot)) {
      await Morgana.warn(`No bots set up for autobooting. Continuing!`);
      return;
    }

    // Boot all bots set up in autobooting.
    await Promise.all(this.core.settings.autoboot.map(async (botId) => {
      await this.boot(botId);
      await Morgana.success("Successfully Auto-Booted {{bot}}!", {bot: botId});
    }));
  }

  /**
   * Run deployment handlers for all bots loaded in the Manager.
   *
   * @param {string} botId
   *    The ID of the bot to deploy.
   */
  static async boot(botId) {
    // If the bot isn't found, we can't boot it.
    if (Sojiro.isEmpty(this.bots[botId])) {
      await Morgana.warn(`Tried to boot an non-existent bot: {{botId}}. Gracefully continuing the program.`, {botId: botId});
      return;
    }

    // Await deployment handlers for a single bot.
    await this.bots[botId].deploy();
  }

  /**
   * Shutdown a bot.
   *
   * @param {string} botId
   *   ID of the Bot to shutdown.
   */
  static async shutdown(botId) {
    // If the bot isn't found, we can't shut it down.
    if (Sojiro.isEmpty(this.bots[botId])) {
      await Morgana.warn(`Tried to shutdown an non-existent bot: {{botId}}. Gracefully continuing the program.`, {botId: botId});
      return;
    }

    await this.bots[botId].shutdown();
  }

  /**
   * Run preparation handlers for a single bot loaded in the Manager.
   *
   * @param {string} botId
   *    The ID of the bot to prepare.
   */
  static async prepareBot(botId) {
    // Await preparation handler for a single bot.
    await this.bots[botId].prepare();
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
   * This will automatically load a 'config.yml' file in every bot's directory.
   *
   * @param {string} botId
   *    The ID of the bot to register.
   * @param {string} directory
   *    Path to the directory where this bot's files are located.
   */
  static async registerBot(botId, directory = undefined) {
    // If the directory isn't provided, we'll get it ourselves.
    if (directory === undefined) {
      directory = this.core.paths.bots + '/' + botId;
    }

    // If the bot name is part of the ignored bot list, return now.
    if (botId in this.ignoredBots) {
      return;
    }

    // Get the config file for the bot.
    /** @catch Continue execution. */
    let configFilePath = directory + '/' + 'config.yml';
    let config = await Akechi.readYamlFile(configFilePath).catch(Igor.continue);

    // If the configuration is empty, stop here.
    // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
    if (Sojiro.isEmpty(config)) {
      await Morgana.warn('Configuration file could not be loaded for following bot: {{bot}}', {bot: botId});
      return;
    }

    // Set directory to the configuration. It's nice to have quick access to the bot folder from within the bot.
    config.directory = directory;

    // If the 'active' flag of the config is set and is not 'true', we don't activate this bot.
    if (config.active !== undefined && config.active === false) {
      await Morgana.warn('The {{bot}} bot has been set to inactive. It will not be registered.', {bot: botId});
      return;
    }

    // Instantiate and set the bot to the collection.
    let bot = new Bot(botId, config);
    if (bot.id === this.core.settings.master) {
      bot.isMaster = true;
    }
    Object.assign(this.bots, {[botId]: bot});

    // Print a success message.
    await Morgana.success('The {{bot}} bot has successfully been registered!', {bot: botId});
  }

  /**
   * Registration function for the bots.
   *
   * Bots are instantiated through configuration files located in the 'bots' folder at the root of the application.
   * Check that folder out for more information.
   *
   * This function crawls that folder and instantiates the bots with their configuration files.
   */
  static async registerAllBotsInDirectory() {
    // Fetch all bot directories from the 'bots' folder at the root of the application.
    let botDirectories = await Akechi.getDirectoriesFrom(this.core.paths.bots).catch(Lavenza.pocket);

    // If for some reason, bot directories could not be loaded, we stop the app.
    if (botDirectories === undefined) {
      await Igor.throw("Other than the 'example' folder, no bot folders seem to exist in /app/bots. The whole point of this app is to run bots, so create one!");
    }

    // Loop through all directories we need to.
    await Promise.all(botDirectories.map(async directory => {
      // Get the bot name. This is in fact the name of the directory.
      let name = path.basename(directory);

      // Register the bot.
      await this.registerBot(name);
    }));

    // Array does not exist, is not an array, or is empty.
    if (Sojiro.isEmpty(this.bots)) {
      await Igor.throw("No bots were registered after the preparation phase. As a result, there is nothing to run.");
    }
  }

};
