/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from 'path';

// Imports.
import Akechi from '../Confidant/Akechi';
import Morgana from '../Confidant/Morgana';
import Sojiro from '../Confidant/Sojiro';
import Igor from '../Confidant/Igor';
import Bot from './Bot';
import Core from "../Core/Core";
import {BotConfigurations} from "./BotConfigurations";
import {AssociativeObject} from "../Types";
import Gestalt from "../Gestalt/Gestalt";

/**
 * Provides a Manager for Bots.
 *
 * This class manages the registering and instantiation of bots.
 *
 * Bots are configured in the 'bots' folder at the root of the application.
 *
 */
export default class BotManager {

  /**
   * Store ignored bot names.
   * We use this to prevent loading unneeded bot folders, like the example one.
   */
  private static ignoredBots: Object = {
    example: 'example',
  };

  /**
   * Store a list of all bots in the application.
   */
  public static bots: AssociativeObject<Bot>;

  /**
   * This is a static class. The constructor will never be used.
   */
  private constructor() {}

  /**
   * Preparation handler for the BotManager.
   *
   * Registers all bots and fires all of *their* preparation handlers.
   */
  static async build() {
    // Await registration of all bots from the application files.
    // Upon error in registration, stop the application.
    await this.registerAllBotsInDirectory();

    // We'll run preparation handlers for all bots as this should only be done once.
    await this.prepareAllBots();

    // Some more flavor.
    await Morgana.success("Bot Manager preparations complete!");
  }

  /**
   * Perform bootstrapping tasks for Database for all bots.
   */
  static async gestalt() {
    // Some flavor.
    await Morgana.status("Running Gestalt bootstrap process for the Bot Manager...");

    // Creation of the Bots collection.
    await Gestalt.createCollection('/bots');

    // Run Gestalt handlers for each Bot.
    await Promise.all(Object.keys(this.bots).map(async botId => {
      let bot: Bot = await this.getBot(botId);
      await bot.gestalt();
    }));

    // Some flavor.
    await Morgana.status("Gestalt bootstrap process complete for the Bot Manager!");
  }

  /**
   * Retrieve a Bot from the Manager.
   *
   * @param id
   *   ID of the bot we want to retrieve.
   */
  static async getBot(id: string): Promise<Bot> {
    return this.bots[id];
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
    await Morgana.success("Booted the master bot, {{bot}}!", {bot: Core.settings.master});

    // Boot auto-boot bots.
    // Some bots are set up for auto-booting. We'll handle those too.
    await this.bootAutoBoots();
  }

  /**
   * Activates the Master Bot for your application.
   */
  static async bootMasterBot() {
    // Await deployment of the master bot.
    await this.boot(Core.settings.master);
  }

  /**
   * Boots all bots set up in the 'autoboot' array of the settings.
   */
  static async bootAutoBoots() {
    // If the autoboot array is empty, we don't do anything here.
    if (Sojiro.isEmpty(Core.settings.autoboot)) {
      await Morgana.warn(`No bots set up for autobooting. Continuing!`);
      return;
    }

    // Boot all bots set up in autobooting.
    await Promise.all(Core.settings.autoboot.map(async (botId) => {
      await this.boot(botId);
      await Morgana.success("Successfully Auto-Booted {{bot}}!", {bot: botId});
    }));
  }

  /**
   * Run deployment handlers for all bots loaded in the Manager.
   *
   * @param botId
   *    The ID of the bot to deploy.
   */
  static async boot(botId: string) {
    // If the bot isn't found, we can't boot it.
    if (Sojiro.isEmpty(this.bots[botId])) {
      await Morgana.warn(`Tried to boot an non-existent bot: {{botId}}. Gracefully continuing the program.`, {botId: botId});
      return;
    }

    // Await deployment handlers for a single bot.
    let bot: Bot = await this.getBot(botId);
    await bot.deploy();
  }

  /**
   * Shutdown a bot.
   *
   * @param botId
   *   ID of the Bot to shutdown.
   */
  static async shutdown(botId: string) {
    // If the bot isn't found, we can't shut it down.
    if (Sojiro.isEmpty(this.bots[botId])) {
      await Morgana.warn(`Tried to shutdown an non-existent bot: {{botId}}. Gracefully continuing the program.`, {botId: botId});
      return;
    }

    let bot: Bot = await this.getBot(botId);
    await bot.shutdown();
  }

  /**
   * Run preparation handlers for a single bot loaded in the Manager.
   *
   * @param botId
   *    The ID of the bot to prepare.
   */
  static async prepareBot(botId: string) {
    // Await preparation handler for a single bot.
    let bot: Bot = await this.getBot(botId);
    await bot.prepare();
  }

  /**
   * Run preparation handlers for all bots loaded in the Manager.
   */
  static async prepareAllBots() {
    // Await preparation handlers for all bots.
    await Promise.all(Object.keys(this.bots).map(async botId => {
      // Await preparation handler for a single bot.
      await this.prepareBot(botId);
    }));
  }

  /**
   * Run registration and instantiate a bot.
   *
   * This will automatically load a 'config.yml' file in every bot's directory.
   *
   * @param botId
   *    The ID of the bot to register.
   * @param directory
   *    Path to the directory where this bot's files are located.
   */
  static async registerBot(botId: string, directory: string = undefined) {
    // If the directory isn't provided, we'll get it ourselves.
    if (directory === undefined) {
      directory = Core.paths.bots + '/' + botId;
    }

    // If the bot name is part of the ignored bot list, return now.
    if (botId in this.ignoredBots) {
      return;
    }

    // Get the config file for the bot.
    let configFilePath = directory + '/' + 'config.yml';
    let config: BotConfigurations = await Akechi.readYamlFile(configFilePath).catch(Igor.continue);

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
    if (bot.id === Core.settings.master) {
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
    let botDirectories = await Akechi.getDirectoriesFrom(Core.paths.bots);

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

}
