/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../../../../lib/Lavenza/Bot/Bot";
import { PluginSeeker } from "../../../../lib/Lavenza/Service/PluginSeeker/PluginSeeker";
import { ServiceContainer } from "../../../../lib/Lavenza/Service/ServiceContainer";
import { Talent } from "../../../../lib/Lavenza/Talent/Talent";
import { Command } from "../Command/Command";

import { CommandCatalogue } from "./CommandCatalogue";

/**
 * Provides a plugin seeker for Commands.
 */
export class CommandPluginSeeker extends PluginSeeker<Command> {

  /**
   * The desired path relative to the talent's root directory where you'd like the service to search for Plugins.
   */
  protected path: string = "plugins/Commands";

  /**
   * ID of a loader defined to act upon all items found in the defined path.
   *
   * This loader can be a FileLoader, DirectoryLoader or a custom defined loader that extends the Loader class.
   */
  protected loader: string = "commander.loader";

  /**
   * After plugins are loaded with the specified loader, you can customize what happens for each set of plugins.
   *
   * Each seeker must specify this function.
   *
   * @param plugins
   *   Loaded plugins, if any.
   * @param entity
   *   Entity these plugins were loaded for.
   */
  protected async plug(plugins: Command[], entity: Bot | Talent): Promise<void> {
    // Set loaded commands up in the Listener Catalogue with the sections map.
    await ServiceContainer.get(CommandCatalogue).storeCommandsForEntity(plugins, entity);
  }

}


