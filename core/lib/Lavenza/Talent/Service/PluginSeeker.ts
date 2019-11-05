/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Loader } from "../../Service/Loader/Loader";
import { Service } from "../../Service/Service";
import { ServiceContainer } from "../../Service/ServiceContainer";
import { Talent } from "../Talent";

import { TalentCatalogue } from "./TalentCatalogue";

/**
 * Provides an abstract class for a Plugin Seeker.
 *
 * Talents can blend functionality between each other with Plugins. Plugin Seekers can be defined that will loop
 * through all loaded talents and attempt to find specific classes at a defined path. These classes will be loaded and
 * can be acted upon.
 */
export abstract class PluginSeeker<T> extends Service {

  /**
   * The desired path relative to the talent's root directory where you'd like the service to search for Plugins.
   */
  protected abstract path: string;

  /**
   * ID of a loader defined to act upon all items found in the defined path.
   *
   * This loader can be a FileLoader, DirectoryLoader or a custom defined loader that extends the Loader class.
   */
  protected abstract loader: string;

  /**
   * Build handler for Plugin Seekers.
   *
   * @inheritDoc
   */
  public async build(): Promise<void> {
    // Loop through the Talents Catalogue
    await Promise.all(ServiceContainer.get(TalentCatalogue).all().map(async (talent: Talent) => {
      // Apply the defined loader to the specified path.
      const seekerPath = `${talent.directory}/${this.path}`;
      const loader = ServiceContainer.get(this.loader) as Loader<T>;
      const loadedPlugins = await loader.load(seekerPath);
      await this.plug(loadedPlugins, talent);
    }));
  }

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
  protected abstract async plug(plugins: T[], talent: Talent): Promise<void>;

}


