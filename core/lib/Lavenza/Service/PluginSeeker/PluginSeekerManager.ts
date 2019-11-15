/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { AbstractObject } from "../../Types";
import { Service } from "../Service";
import { ServiceContainer } from "../ServiceContainer";

import { PluginSeeker } from "./PluginSeeker";

/**
 * Provides a manager for plugin seekers.
 */
export class PluginSeekerManager extends Service {

  /**
   * Run all plugin seeker services.
   *
   * This will simply make sure that all plugins are loaded for all defined Plugin Seekers.
   */
  public static async seekPlugins(): Promise<void> {
    // Now we want to obtain all Plugin Seeker services and fire them.
    // We put AbstractObject here since the typing of the PluginSeeker doesn't matter in this context.
    for (const service of ServiceContainer.getServicesWithTag("plugin_seeker") as Array<PluginSeeker<AbstractObject>>) {
      // For each plugin seeker, we run the seek() function.
      // This should run all plugin seekers and load them all wherever needed.
      await service.seek();
    }
  }

  /**
   * Run Genesis process handler.
   *
   * @inheritDoc
   */
  public async genesis(): Promise<void> {
    await PluginSeekerManager.seekPlugins();
  }

}
