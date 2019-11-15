/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Igor } from "../Confidant/Igor";
import { Sojiro } from "../Confidant/Sojiro";
import { Core } from "../Core/Core";
import { Catalogue } from "../Service/Catalogue/Catalogue";
import { ServiceContainer } from "../Service/ServiceContainer";

import { Bot } from "./Bot";
import { BotDirectoryLoader } from "./BotDirectoryLoader";

/**
 * Provides a Catalogue for Bots.
 *
 * This class manages the storage and retrieval of bots.
 *
 * Bots are configured in the 'bots' folder at the root of the application.
 *
 */
export class BotCatalogue extends Catalogue<Bot> {

  /**
   * Genesis handler for the BotCatalogue Service.
   *
   * This runs in the genesis phase of the application.
   *
   * @see Core.summon();
   *
   * @inheritDoc
   */
  public async genesis(): Promise<void> {
    // Load all Bots from the specified installation directory.
    this.repository = await ServiceContainer.get(BotDirectoryLoader).load(Core.paths.bots);

    // Check if we loaded duplicate bots and end if we do.
    if (Sojiro.arrayHasDuplicates(this.repository, "id")) {
      await Igor.throw("Duplicate bots were loaded during the build phase. Please make sure you don't have duplicated bots!");
    }
  }

  /**
   * Fetch all of the summoned bots from the catalogue.
   *
   * @returns
   *   An array of all bots that are currently summoned.
   */
  public allSummoned(): Bot[] {
    return this.all().filter((bot: Bot) => bot.summoned === true);
  }

  /**
   * Fetch a Bot from the repository.
   *
   * @param id
   *   ID of the Bot to obtain.
   *
   * @returns
   *   Bot found in the repository. Returns undefined if no Talent is found.
   */
  public getBot(id: string): Bot {
    return this.find((bot: Bot) => bot.id === id);
  }

}
