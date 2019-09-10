/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from 'path';

// Imports.
import Akechi from "../Confidant/Akechi";
import Gestalt from "../Gestalt/Gestalt";
import Sojiro from "../Confidant/Sojiro";
import Morgana from "../Confidant/Morgana";
import Igor from "../Confidant/Igor";
import Bot from "../Bot/Bot";
import Listener from "../Bot/Listener/Listener";
import Command from "../Bot/Command/Command";
import {TalentConfigurations} from "./TalentConfigurations";
import {AssociativeObject} from "../Types";
import {CommandConfigurations} from "../Bot/Command/CommandConfigurations";
/**
 * Provides a base class for 'Talents'.
 *
 * 'Talents', in the context of this application, are bundles of functionality that can be granted to any given bot.
 *
 * Think of talents as..."Plugins" from Wordpress, or "Modules" from Drupal, or "Packages" from Laravel.
 *
 * The idea here is that bot features are coded in their own folders and contexts. The power here comes from the flexibility we have
 * since talents can be granted to multiple bots, and talents can be tracked in separate repositories if needed. Also,
 * they can easily be toggled on and off. Decoupling the features from the bots seemed like a good move.
 */
export default class Talent {

  /**
   * Unique machine name of the talent.
   *
   * This machine name will automatically take the name of the directory where it is created. As per standards, this
   * directory's name will be written in snake_case.
   */
  public machineName: string;

  /**
   * Talent configuration.
   */
  public config: TalentConfigurations;

  /**
   * Path to the directory of the Talent.
   */
  public directory: string;

  /**
   * Object to store relevant paths to the Talent's database entries.
   *
   * Contains paths to Gestalt databases for this Talent.
   *    - databases.global    - Path to global database. i.e. /talents/{TALENT_NAME}
   *    - databases.{BOT_ID}  - Path to bot specific database for this talent. i.e. /bots/{YOUR_BOT}/talents/{TALENT_NAME}
   */
  public databases: AssociativeObject<string>;

  /**
   * Object to store this Talent's commands.
   */
  public commands: AssociativeObject<Command>;

  /**
   * Object to store this Talent's command aliases.
   */
  public commandAliases: AssociativeObject<string>;

  /**
   * Object to store this Talent's listeners.
   */
  public listeners: Array<Listener>;

  /**
   * Perform build tasks.
   *
   * Each talent will call this function once to set their properties.
   *
   * @param config The configuration used to build the Talent. Provided from a 'config.yml' file found in the Talent's folder.
   */
  async build(config: TalentConfigurations) {
    // Initialize fields.
    this.machineName = path.basename(config.directory); // Here we get the name of the directory and set it as the ID.
    this.config = config;
    this.directory = config.directory;
    this.databases = {};
    this.commands = {};
    this.commandAliases = {};
    this.listeners = [];

    // Set the path to the talent's global database.
    this.databases.global = `/talents/${this.machineName}`;

    // Await the process of loading commands.
    await this.loadCommands();

    // Await the process of loading listeners.
    await this.loadListeners();
  }

  /**
   * The Gestalt function is used to setup database tables for a given object.
   *
   * In this case, these are the database setup tasks for Talents.
   *
   * You can see the result of these calls in the database.
   */
  async gestalt() {
    // Initialize the database collection for this talent if it doesn't already exist.
    await Gestalt.createCollection(`/talents/${this.machineName}`);
  }

  /**
   * Perform any initialization tasks for the Talent, in the context of a given bot.
   *
   * These initialization tasks happen after clients are loaded and authenticated for the bot.
   *
   * @param bot The bot to perform initializations for.
   */
  async initialize(bot: Bot) {
    // Set the path to the talent's bot specific database.
    this.databases[bot.id] = `/bots/${bot.id}/talents/${this.machineName}`;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Get the active configuration from the database for this Talent, in the context of a Bot.
   *
   * Bots can override talent configurations for themselves. As a result, in the database, we must store configurations
   * specific to this talent in the bot's database table.
   *
   * @param bot
   *   The bot context for the configuration we want to fetch. Each bot can have different configuration overrides
   *   for talents.
   *
   * @returns
   *   The active database configuration for the talent configuration, specific to a given Bot.
   */
  async getActiveConfigForBot(bot: Bot): Promise<TalentConfigurations> {
    // Await Gestalt's API call to get the configuration from the storage.
    return await Gestalt.get(`/bots/${bot.id}/talents/${this.machineName}/config`);
  }

  /**
   * Auto-Load all commands from the 'hooks/Commands' folder nested in the Talent's directory.
   *
   * Commands can't necessarily be added alone. They must be bundled in a Talent. This function fetches them all from
   * the 'Commands' folder.
   */
  async loadCommands() {
    // Determine the path to this Talent's commands.
    // Each command has its own directory. We'll get the list here.
    let commandDirectoriesPath = `${this.directory}/hooks/Commands`;
    let commandDirectories = await Akechi.getDirectoriesFrom(commandDirectoriesPath);

    // We'll throw an error for this function if the 'Commands' directory doesn't exist or is empty.
    // This error should be caught and handled above.
    if (Sojiro.isEmpty(commandDirectories)) {
      // await Lavenza.warn('No commands were found for the {{talent}} talent. This might not be normal!', {talent: this.id});
      return;
    }

    // We'll now act on each command directory found.
    await Promise.all(commandDirectories.map(async directory => {
      // The name of the command will be the directory name.
      let name = path.basename(directory);

      // The ID of the command will be its name in lowercase.
      let id = name.toLowerCase();

      // Get the config file for the command.
      // Each command should have a file with the format 'COMMAND_NAME.config.yml'.
      let configFilePath = `${directory}/config.yml`;
      let config: CommandConfigurations = await Akechi.readYamlFile(configFilePath).catch(Igor.continue);

      // Stop if the configuration is empty or wasn't found.
      // We can't load the command without configurations.
      // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
      if (Sojiro.isEmpty(config)) {
        await Morgana.warn('Configuration file could not be loaded for the {{command}} command in the {{talent}} talent.', {command: name, talent: this.machineName});
        return;
      }

      // Set directory to the configuration. It's nice to have quick access to the command folder from within the command.
      config.directory = directory;

      // If the configuration exists, we can process by loading the class of the Command.
      // If the class doesn't exist (this could be caused by the configuration being wrong), we stop.
      let command = require(`${directory}/${config.class}`)['default'];
      if (Sojiro.isEmpty(command)) {
        await Morgana.warn('Class could not be loaded for the {{command}} command in the {{talent}} talent.', {command: name, talent: this.machineName});
        return;
      }
      command = new command(id, directory);

      // Now let's successfully register the command to the Talent.
      // Commands have build tasks too and are also singletons. We'll run them here.
      await command.build(config, this);

      // Set the command to this Talent.
      this.commands[config.key] = command;

      // Set command aliases.
      config['aliases'].forEach(alias => {
        this.commandAliases[alias] = command.config.key;
      });
    }));
  }

  /**
   * Auto-Load all listeners from the 'hooks/Listeners' folder nested in the Talent's directory.
   *
   * Listeners are other entities that are used to...Pretty much LISTEN to messages received by clients.
   * Listeners then decide what to do with these messages they hear.
   *
   * Each Talent can have Listeners defined as well.
   */
  async loadListeners() {
    // The 'Listeners' folder will simply have a collection of Class files. We'll get the list here.
    // We'll ge the tentative path first.
    let listenerClassesPath = `${this.directory}/hooks/Listeners`;

    // If this directory doesn't exist, we simply return.
    if (!await Akechi.isDirectory(listenerClassesPath)) {
      return;
    }

    // Get the list of listener classes at the path.
    let listenerClasses = await Akechi.getFilesFrom(listenerClassesPath);

    // We'll throw an error for this function if the 'Listeners' directory doesn't exist or is empty.
    // This error should be caught and handled above.
    if (Sojiro.isEmpty(listenerClasses)) {
      // await Lavenza.warn('No listeners were found for the {{talent}} talent. This might not be normal!', {talent: this.id});
      return;
    }

    // Await the loading of all listener classes.
    await Promise.all(listenerClasses.map(async listenerClass => {
      // We will simply require the file here.
      let listener = require(listenerClass)['default'];
      listener = new listener();

      // Run listener build tasks.
      // We only do this to assign the talent to the listener. That way, the listener can access the Talent.
      await listener.build(this);

      // If the require fails or the result is empty, we stop.
      if (Sojiro.isEmpty(listener)) {
        await Morgana.warn('A Listener class could not be loaded in the {{talent}} talent.', {talent: this.machineName});
        return;
      }

      // If everything goes smoothly, we register the listener to the Talent.
      this.listeners.push(listener);
    }));
  }

}
