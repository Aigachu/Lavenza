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
 * The idea here is that bot features are coded in their own folders. The power here comes from the flexibility we have
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
   * @param {Object} info
   *   The information used to build the Talent. Provided from a '?.info.yml' file found in the Talent's folder.
   *
   * @returns {Promise.<void>}
   */
  static async build(info) {
    this.id = path.basename(info.directory); // Here we get the name of the directory and set it as the ID.
    this.description = info.description;
    this.version = info.version;
    this.directory = info.directory;

    // Await the process of loading commands.
    /** @catch Continue execution. */
    await this.loadCommands().catch(Lavenza.continue);

    // Await the process of loading listeners.
    /** @catch Continue execution. */
    await this.loadListeners().catch(Lavenza.continue);
  }

  /**
   * Auto-Load all commands from the 'Commands' folder nested in the Talent's directory.
   *
   * Commands can't necessarily be added alone. They must be bundled in a Talent. This function fetches them all from
   * the 'Commands' folder.
   *
   * @returns {Promise.<void>}
   */
  static async loadCommands() {

    // Initialize the property. We'll store all commands here.
    this.commands = {};

    // Determine the path to this Talent's commands.
    // Each command has its own directory. We'll get the list here.
    /** @catch Pocket error. */
    let commandDirectoriesPath = this.directory + '/Commands';
    let commandDirectories = await Lavenza.Akechi.getDirectoriesFrom(commandDirectoriesPath).catch(Lavenza.pocket);

    // We'll throw an error for this function if the 'Commands' directory doesn't exist or is empty.
    // This error should be caught and handled above.
    if (Lavenza.isEmpty(commandDirectories)) {
      Lavenza.throw('NO_COMMANDS_FOUND_FOR_TALENT', [this.id]);
    }

    // We'll now act on each command directory found.
    /** @catch Continue execution. */
    await Promise.all(commandDirectories.map(async directory => {

      // The name of the command will be the directory name.
      let name = path.basename(directory);

      // Get the config file for the command.
      // Each command should have a file with the format 'COMMANDNAME.config.yml'.
      /** @catch Continue execution. */
      let configFilePath = directory + '/' + name + '.config.yml';
      let config = await Lavenza.Akechi.readYamlFile(configFilePath).catch(Lavenza.continue);

      // Stop if the configuration is empty or wasn't found.
      // We can't load the command without configurations.
      // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
      if (Lavenza.isEmpty(config)) {
        Lavenza.warn('COMMAND_CONFIG_FILE_NOT_FOUND', [name, this.id]);
        return;
      }

      // If the configuration exists, we can process by loading the class of the Command.
      // If the class doesn't exist (this could be caused by the configuration being wrong), we stop.
      let command = require(directory + '/' + config.class);
      if (Lavenza.isEmpty(command)) {
        Lavenza.warn('COMMAND_CLASS_MISSING', [name, this.id]);
        return;
      }

      // Now let's successfully register the command to the Talent.
      // Commands have build tasks too and are also singletons. We'll run them here.
      /** @catch Stop execution. */
      await command.build(config, this).catch(Lavenza.stop);

      // Set the command to this Talent.
      this.commands[config.key] = command;

      // Set command aliases.
      config.aliases.forEach(alias => {
        this.commands[alias] = command;
      });

    })).catch(Lavenza.stop);
  }

  /**
   * Auto-Load all listeners from the 'Listeners' folder nested in the Talent's directory.
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
    let listenerClassesPath = this.directory + '/Listeners';
    let listenerClasses = await Lavenza.Akechi.getFilesFrom(listenerClassesPath).catch(Lavenza.pocket);

    // We'll throw an error for this function if the 'Listeners' directory doesn't exist or is empty.
    // This error should be caught and handled above.
    if (Lavenza.isEmpty(listenerClasses)) {
      Lavenza.throw('NO_LISTENERS_FOUND_FOR_TALENT', [this.id]);
    }

    // Await the loading of all listener classes.
    /** @catch Continue execution. */
    await Promise.all(listenerClasses.map(async listenerClass => {

      // We will simply require the file here.
      let listener = require(listenerClass);

      // Run listener build tasks.
      // We only do this to assign the talent to the listener. That way, the listener can access the Talent.
      /** @catch Stop execution. */
      await listener.build(this).catch(Lavenza.stop);

      // If the require fails or the result is empty, we stop.
      if (Lavenza.isEmpty(listener)) {
        Lavenza.warn('LISTENER_CLASS_MISSING', [name, this.id]);
        return;
      }

      // If everything goes smoothly, we register the listener to the Talent.
      this.listeners.push(listener);
    })).catch(Lavenza.stop);
  }

}

module.exports = Talent;
