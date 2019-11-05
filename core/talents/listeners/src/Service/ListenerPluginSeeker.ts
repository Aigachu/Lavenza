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
import { Listener } from "../Listener";

import { ListenerCatalogue } from "./ListenerCatalogue";

/**
 * Provides an abstract class for a Plugin Seeker.
 *
 * Talents can blend functionality between each other with Plugins. Plugin Seekers can be defined that will loop
 * through all loaded talents and attempt to find specific classes at a defined path. These classes will be loaded and
 * can be acted upon.
 */
export class ListenerPluginSeeker extends PluginSeeker<Listener> {

  /**
   * The desired path relative to the talent's root directory where you'd like the service to search for Plugins.
   */
  protected path: string = "Plugins/Listeners";

  /**
   * ID of a loader defined to act upon all items found in the defined path.
   *
   * This loader can be a FileLoader, DirectoryLoader or a custom defined loader that extends the Loader class.
   */
  protected loader: string = "listener.loader";

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
  protected async plug(plugins: Listener[], talent: Talent): Promise<void> {
    // Set these loaded listeners up in the Listener Catalogue with the sections map.
    await ServiceContainer.get(ListenerCatalogue).store(plugins, talent.machineName);
  }

}


