/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../../Bot/Bot";
import { BotCatalogue } from "../../Bot/BotCatalogue";
import { Sojiro } from "../../Confidant/Sojiro";
import { Talent } from "../../Talent/Talent";
import { TalentCatalogue } from "../../Talent/TalentCatalogue";
import { Loader } from "../Loader/Loader";
import { Service } from "../Service";
import { ServiceContainer } from "../ServiceContainer";

/**
 * Provides an abstract class for Plugin Seekers.
 *
 * Talents can blend functionality between each other and offer added functionality to Bots with the use of Plugins.
 * Plugin Seekers can be defined that will loop through all loaded talents/bots and attempt to find specific classes at
 * a defined path. These classes will be loaded and can be acted upon.
 */
export abstract class PluginSeeker<T> extends Service {

  /**
   * Service Tags.
   *
   * Plugin Seekers should only have this tag anyways.
   */
  public tags: string[] = [ "plugin_seeker" ];

  /**
   * The desired path relative to the bot/talent's root directory where you'd like the service to search for Plugins.
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
  public async seek(): Promise<void> {
    // Loop through the Talents Catalogue
    await Promise.all(ServiceContainer.get(TalentCatalogue).all().map(async (talent: Talent) => {
      // Apply the defined loader to the specified path.
      const seekerPath = `${talent.directory}/${this.path}`;
      const loader = ServiceContainer.get(this.loader) as Loader<T>;
      const loadedPlugins = await loader.load(seekerPath);
      if (!Sojiro.isEmpty(loadedPlugins)) {
        await this.plug(loadedPlugins, talent);
      }
    }));

    // Loop through the Bots Catalogue
    await Promise.all(ServiceContainer.get(BotCatalogue).all().map(async (bot: Bot) => {
      // Apply the defined loader to the specified path.
      const seekerPath = `${bot.directory}/${this.path}`;
      const loader = ServiceContainer.get(this.loader) as Loader<T>;
      const loadedPlugins = await loader.load(seekerPath);
      if (!Sojiro.isEmpty(loadedPlugins)) {
        await this.plug(loadedPlugins, bot);
      }
    }));
  }

  /**
   * After plugins are loaded with the specified loader, you can customize what happens for each set of plugins loaded.
   *
   * Each seeker must specify this function.
   *
   * @param plugins
   *   Loaded plugins, if any.
   * @param entity
   *   Bot or Talent these plugins were found in and loaded for.
   */
  protected abstract async plug(plugins: T[], entity: Bot | Talent): Promise<void>;

}


