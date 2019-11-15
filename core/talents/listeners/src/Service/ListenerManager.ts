/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { BotCatalogue } from "../../../../lib/Lavenza/Bot/BotCatalogue";
import { Service } from "../../../../lib/Lavenza/Service/Service";
import { ServiceContainer } from "../../../../lib/Lavenza/Service/ServiceContainer";
import { TalentCatalogue } from "../../../../lib/Lavenza/Talent/TalentCatalogue";

import { ListenerCatalogue } from "./ListenerCatalogue";

/**
 * Provides a Manager Service for Listeners.
 */
export class ListenerManager extends Service {

  /**
   * Build handler for the ListenerManager.
   *
   * @inheritDoc
   */
  public async synthesis(): Promise<void> {
    // Plugin are all loaded before synthesis in the genesis phase.
    // Now we want to loop through all bots.
    // Our goal is to assign all listeners loaded into a bot's talents into the bot itself.
    for (const bot of ServiceContainer.get(BotCatalogue).all()) {
      // Loop in all Talents assigned to a specified bot.
      for (const talent of await ServiceContainer.get(TalentCatalogue).getTalentsForBot(bot)) {
        // Get the listeners assigned to the talent.
        const talentListeners = await ServiceContainer.get(ListenerCatalogue).getListenersForEntity(talent);

        // Assign the Talent's listeners to the Bot.
        await ServiceContainer.get(ListenerCatalogue).storeListenersForEntity(talentListeners, bot);
      }
    }
  }

}
