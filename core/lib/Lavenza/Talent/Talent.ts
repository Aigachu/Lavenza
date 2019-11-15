/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from "path";

// Imports.
import { Bot } from "../Bot/Bot";
import { Akechi } from "../Confidant/Akechi";
import { ServiceContainer } from "../Service/ServiceContainer";
import { AssociativeObject } from "../Types";

import { TalentConfigurations } from "./TalentConfigurations";

/**
 * Provides a base class for 'Talents'.
 *
 * 'Talents', in the context of this application, are bundles of functionality that can be granted to any given bot.
 *
 * Think of talents as..."Plugins" from Wordpress, or "Modules" from Drupal, or "Packages" from Laravel.
 *
 * The idea here is that bot features are coded in their own folders and contexts. The power here comes from the
 * flexibility we have since talents can be granted to multiple bots, and talents can be tracked in separate
 * repositories if needed. Also, they can easily be toggled on and off. Decoupling the features from the bots
 * seemed like a good move.
 */
export class Talent {

  /**
   * Talent configuration.
   */
  public config: TalentConfigurations;

  /**
   * Object to store relevant paths to the Talent's database entries.
   *
   * Contains paths to Gestalt databases for this Talent.
   *  - databasePaths.global    - Path to global database. i.e. /talents/{TALENT_NAME}
   *  - databasePaths.{BOT_ID}  - Path to bot specific database for this talent. i.e. /bots/{YOUR_BOT}/talents/{TALENT_NAME}
   */
  public databasePaths: AssociativeObject<string> = {};

  /**
   * Path to the directory of the Talent.
   */
  public directory: string;

  /**
   * Unique machine name of the talent.
   *
   * This machine name will automatically take the name of the directory where it is created. As per standards, this
   * directory's name will be written in snake_case.
   */
  public machineName: string;

  /**
   * Perform genesis tasks.
   *
   * Each talent will call this function once to set their properties in the genesis phase of the application.
   *
   * @param config
   *   The configuration used to build the Talent. Provided from a 'config.yml' file found in the Talent's folder.
   */
  public async build(config: TalentConfigurations): Promise<void> {
    // Initialize fields.
    this.machineName = path.basename(config.directory); // Here we get the name of the directory and set it as the ID.
    this.config = config;
    this.directory = config.directory;
  }

  /**
   * Perform any initialization tasks for the Talent, in the context of a given bot.
   *
   * These initialization tasks happen after clients are loaded and authenticated for the bot. This is going to be done
   * in the execution phase.
   *
   * @param bot The bot to perform initializations for.
   */
  public async initialize(bot: Bot): Promise<void> {
    // Set the path to the talent's bot specific database.
    this.databasePaths[bot.id] = `/bots/${bot.id}/talents/${this.machineName}`;
  }

  /**
   * Load services that may be defined in this Talent.
   */
  public async loadTalentServices(): Promise<void> {
    // Check if a services.yml file exists in this talent.
    if (!await Akechi.fileExists(`${this.directory}/${this.machineName}.services.yml`)) {
      return;
    }

    // Otherwise, use the ServiceContainer to load the specified services.
    await ServiceContainer.load(`${this.directory}/${this.machineName}.services.yml`);
  }

}
