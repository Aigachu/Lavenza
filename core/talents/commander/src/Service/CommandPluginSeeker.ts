/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { ServiceContainer } from "../../../../lib/Lavenza/Service/ServiceContainer";
import { PluginSeeker } from "../../../../lib/Lavenza/Talent/Service/PluginSeeker";
import { Talent } from "../../../../lib/Lavenza/Talent/Talent";
import { Command } from "../Command/Command";

import { CommandCatalogue } from "./CommandCatalogue";

/**
 * Provides an abstract class for a Plugin Seeker.
 *
 * Talents can blend functionality between each other with Plugins. Plugin Seekers can be defined that will loop
 * through all loaded talents and attempt to find specific classes at a defined path. These classes will be loaded and
 * can be acted upon.
 */
export class CommandPluginSeeker extends PluginSeeker<Command> {

  /**
   * The desired path relative to the talent's root directory where you'd like the service to search for Plugins.
   */
  protected path: string = "Plugins/Commands";

  /**
   * ID of a loader defined to act upon all items found in the defined path.
   *
   * This loader can be a FileLoader, DirectoryLoader or a custom defined loader that extends the Loader class.
   */
  protected loader: string = "command.loader";

  /**
   * After talents are loaded with the specified loader, you can customize what happens for each set of plugins loaded
   * for a Talent.
   *
   * Each seeker must specify this function.
   *
   * @param plugins
   *   Loaded plugins, if any.
   * @param talent
   *   Talent these plugins were loaded for.
   */
  protected async plug(plugins: Command[], talent: Talent): Promise<void> {
    // Set these loaded commands up in the Command Catalogue with the sections map.
    await ServiceContainer.get(CommandCatalogue).store(plugins, talent.machineName);
  }

}


