/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from "path";

// Imports.
import { Akechi } from "../../../../lib/Lavenza/Confidant/Akechi";
import { Igor } from "../../../../lib/Lavenza/Confidant/Igor";
import { Morgana } from "../../../../lib/Lavenza/Confidant/Morgana";
import { Sojiro } from "../../../../lib/Lavenza/Confidant/Sojiro";
import { DirectoryLoader } from "../../../../lib/Lavenza/Service/Loader/DirectoryLoader";
import { Command } from "../Command/Command";
import { CommandConfigurations } from "../Command/CommandConfigurations";

/**
 * Provides a Directory Service Service for Commands.
 */
export class CommandDirectoryLoader extends DirectoryLoader<Command> {

  /**
   * Load a command from a given directory found in the loader.
   *
   * @param commandDirectoryPath
   *   Path to the directory housing the command.
   *
   * @return
   *   The loaded and instantiated Command.
   */
  public async process(commandDirectoryPath: string): Promise<Command> {
    // The name of the command will be the directory name.
    const name: string = path.basename(commandDirectoryPath);

    // The ID of the command will be its name in lowercase.
    const id: string = name.toLowerCase();

    // Get the config file for the command.
    // Each command should have a file with the format 'COMMAND_NAME.config.yml'.
    const configFilePath = `${commandDirectoryPath}/config.yml`;
    const config = await Akechi.readYamlFile(configFilePath)
      .catch(Igor.continue) as CommandConfigurations;

    // Stop if the configuration is empty or wasn't found.
    // We can't load the command without configurations.
    // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
    if (Sojiro.isEmpty(config)) {
      await Morgana.warn("Configuration file could not be loaded for the {{command}} command.", {command: name});

      return;
    }

    // Set directory to the configuration.
    // It's nice to have quick access to the command folder from within the command.
    config.directory = commandDirectoryPath;

    // If the configuration exists, we can process by loading the class of the Command.
    // If the class doesn't exist (this could be caused by the configuration being wrong), we stop.
    let command: Command = await import(`${commandDirectoryPath}/${config.class}`);
    if (Sojiro.isEmpty(command)) {
      await Morgana.warn(
        "Class could not be loaded for the {{command}}",
        {command: name},
      );

      return;
    }
    command = new command[config.class](id, config.key, commandDirectoryPath);

    // Now let's successfully register the command to the Talent.
    // Commands have build tasks too and are also singletons. We'll run them here.
    await command.build(config);

    // Set the command to the list of commands we loaded.
    return command;
  }

}
