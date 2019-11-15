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

import { CommandCatalogue } from "./CommandCatalogue";

/**
 * Provides a Manager Service for Commands.
 */
export class CommandManager extends Service {

  /**
   * Build handler for the CommandManager.
   *
   * @inheritDoc
   */
  public async synthesis(): Promise<void> {
    // Now we want to loop through all bots.
    // Our goal is to assign all listeners loaded into a bot's talents into the bot itself.
    for (const bot of ServiceContainer.get(BotCatalogue).all()) {
      // Loop in all Talents assigned to a specified bot.
      for (const talent of await ServiceContainer.get(TalentCatalogue).getTalentsForBot(bot)) {
        // Assign the proper listeners.
        const talentCommands = await ServiceContainer.get(CommandCatalogue).getCommandsForEntity(talent);
        await ServiceContainer.get(CommandCatalogue).storeCommandsForEntity(talentCommands, bot);
      }
    }
  }

}
