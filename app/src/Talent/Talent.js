/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

import path from "path";

/**
 *
 */
export default class Talent {
  static async build(info) {
    this.id = path.basename(info.directory);
    this.description = info.description;
    this.version = info.version;
    this.directory = info.directory;
    await this.loadCommands().catch(Lavenza.continue);
    await this.loadListeners().catch(Lavenza.continue);
  }

  static async loadCommands() {
    this.commands = {};

    let commandDirectoriesPath = this.directory + '/Commands';
    let commandDirectories = await Lavenza.Akechi.getDirectoriesFrom(commandDirectoriesPath).catch(Lavenza.pocket);

    if (Lavenza.isEmpty(commandDirectories)) {
      Lavenza.throw('NO_COMMANDS_FOUND_FOR_TALENT', [this.id]);
    }

    await Promise.all(commandDirectories.map(async directory => {
      let name = path.basename(directory);
      // Get the config file for the bot.
      let configFilePath = directory + '/' + name + '.config.yml';
      let config = await Lavenza.Akechi.readYamlFile(configFilePath).catch(Lavenza.continue);

      // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.

      if (Lavenza.isEmpty(config)) {
        Lavenza.warn('COMMAND_CONFIG_FILE_NOT_FOUND', [name, this.id]);
        return;
      }

      let command = require(directory + '/' + config.class);

      if (Lavenza.isEmpty(command)) {
        Lavenza.warn('COMMAND_CLASS_MISSING', [name, this.id]);
        return;
      }

      // If the configuration is not empty, let's successfully register the bot.
      await command.build(config, this).catch(Lavenza.stop);

      this.commands[config.key] = command;
      config.aliases.forEach(alias => {
        this.commands[alias] = command;
      });

    })).catch(Lavenza.stop);
  }

  static async loadListeners() {
    this.listeners = [];

    let listenerClassesPath = this.directory + '/Listeners';
    let listenerClasses = await Lavenza.Akechi.getFilesFrom(listenerClassesPath).catch(Lavenza.pocket);

    if (Lavenza.isEmpty(listenerClasses)) {
      Lavenza.throw('NO_LISTENERS_FOUND_FOR_TALENT', [this.id]);
    }

    await Promise.all(listenerClasses.map(async listenerClass => {
      let listener = require(listenerClass);

      if (Lavenza.isEmpty(listener)) {
        Lavenza.warn('LISTENER_CLASS_MISSING', [name, this.id]);
        return;
      }

      this.listeners.push(listener);

    })).catch(Lavenza.stop);
  }
}

module.exports = Talent;
