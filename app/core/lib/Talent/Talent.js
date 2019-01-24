/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import path from "path";

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
   * Perform build tasks.
   *
   * Since Talents will be singletons, there is no constructor. Each talent will call this function once to set
   * their properties.
   *
   * @param {Object} config
   *   The configuration used to build the Talent. Provided from a '?.config.yml' file found in the Talent's folder.
   *
   * @returns {Promise.<void>}
   */
  static async build(config) {
    this.id = path.basename(config.directory); // Here we get the name of the directory and set it as the ID.
    this.config = config;
    this.directory = config.directory;
    this.databases = {};

    // Await the process of loading commands.
    /** @catch Continue execution. */
    await this.loadCommands().catch(Lavenza.continue);

    // Await the process of loading listeners.
    /** @catch Pocket error and continue. */
    await this.loadListeners().catch(Lavenza.pocket);

  }

  /**
   * Perform any initialization tasks for the Talent, in the context of a given bot.
   *
   * These initialization tasks happen after clients are loaded and authenticated for the bot.
   *
   * @param {Bot} bot
   *   The bot to perform initializations for.
   *
   * @returns {Promise<void>}
   */
  static async initialize(bot) {

    // Set the path to the talent's global database.
    this.databases.global = `/talents/${this.id}`;

    // Set the path to the talent's bot specific database.
    this.databases[bot.id] = `/bots/${bot.id}/talents/${this.id}`;

  }

  /**
   * Get the active configuration from the database for this Talent, in the context of a Bot.
   *
   * @param {Bot} bot
   *   The bot context for the configuration we want to fetch. Each bot can have different configuration overrides
   *   for talents.
   *
   * @returns {Promise<Object>}
   *   Returns the configuration fetched from the database.
   */
  static async getActiveConfigForBot(bot) {

    // Await Gestalt's API call to get the configuration from the storage.
    return await Lavenza.Gestalt.get(`/bots/${bot.id}/talents/${this.id}/config`);

  }

  /**
   * Auto-Load all commands from the 'hooks/Commands' folder nested in the Talent's directory.
   *
   * Commands can't necessarily be added alone. They must be bundled in a Talent. This function fetches them all from
   * the 'Commands' folder.
   *
   * @returns {Promise.<void>}
   */
  static async loadCommands() {

    // Initialize the property. We'll store all commands here.
    this.commands = {};
    this.commandAliases = {};

    // Determine the path to this Talent's commands.
    // Each command has its own directory. We'll get the list here.
    let commandDirectoriesPath = this.directory + '/hooks/Commands';
    /** @catch Pocket error. */
    let commandDirectories = await Lavenza.Akechi.getDirectoriesFrom(commandDirectoriesPath).catch(Lavenza.pocket);

    // We'll throw an error for this function if the 'Commands' directory doesn't exist or is empty.
    // This error should be caught and handled above.
    if (Lavenza.isEmpty(commandDirectories)) {
      await Lavenza.throw('No commands were found for the {{talent}} talent. This might not be normal!', {talent: this.id});
    }

    // We'll now act on each command directory found.
    await Promise.all(commandDirectories.map(async directory => {

      // The name of the command will be the directory name.
      let name = path.basename(directory);

      // The ID of the command will be its name in lowercase.
      let id = name.toLowerCase();

      // Get the config file for the command.
      // Each command should have a file with the format 'COMMAND_NAME.config.yml'.
      let configFilePath = directory + '/' + name.toLowerCase() + '.config.yml';
      let config = await Lavenza.Akechi.readYamlFile(configFilePath).catch(Lavenza.continue);

      // Stop if the configuration is empty or wasn't found.
      // We can't load the command without configurations.
      // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
      if (Lavenza.isEmpty(config)) {
        await Lavenza.warn('Configuration file could not be loaded for the {{command}} command in the {{talent}} talent.', {command: name, talent: this.id});
        return;
      }

      // Set directory to the configuration. It's nice to have quick access to the command folder from within the command.
      config.directory = directory;

      // Set the ID to the configuration as well.
      config.id = id;

      // If the configuration exists, we can process by loading the class of the Command.
      // If the class doesn't exist (this could be caused by the configuration being wrong), we stop.
      let command = require(directory + '/' + config.class)['default'];
      if (Lavenza.isEmpty(command)) {
        await Lavenza.warn('Class could not be loaded for the {{command}} command in the {{talent}} talent.', {command: name, talent: this.id});
        return;
      }

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
   *
   * @returns {Promise.<void>}
   */
  static async loadListeners() {

    // Initialize the property. We'll store all listeners here.
    this.listeners = [];

    // The 'Listeners' folder will simply have a collection of Class files. We'll get the list here.
    /** @catch Pocket error. */
    let listenerClassesPath = this.directory + '/hooks/Listeners';
    let listenerClasses = await Lavenza.Akechi.getFilesFrom(listenerClassesPath).catch(Lavenza.pocket);

    // We'll throw an error for this function if the 'Listeners' directory doesn't exist or is empty.
    // This error should be caught and handled above.
    if (Lavenza.isEmpty(listenerClasses)) {
      await Lavenza.throw('No listeners were found for the {{talent}} talent. This might not be normal!', {talent: this.id});
    }

    // Await the loading of all listener classes.
    /** @catch Continue execution. */
    await Promise.all(listenerClasses.map(async listenerClass => {

      // We will simply require the file here.
      let listener = require(listenerClass)['default'];

      // Run listener build tasks.
      // We only do this to assign the talent to the listener. That way, the listener can access the Talent.
      await listener.build(this);

      // If the require fails or the result is empty, we stop.
      if (Lavenza.isEmpty(listener)) {
        await Lavenza.warn('A Listener class could not be loaded in the {{talent}} talent.', {talent: this.id});
        return;
      }

      // If everything goes smoothly, we register the listener to the Talent.
      this.listeners.push(listener);

    }));
  }

}
