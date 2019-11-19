/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { BotCatalogue } from "../../../../../lib/Lavenza/Bot/BotCatalogue";
import { Resonance } from "../../../../../lib/Lavenza/Resonance/Resonance";
import { ServiceContainer } from "../../../../../lib/Lavenza/Service/ServiceContainer";
import { Command } from "../../../../commander/src/Command/Command";
import { Instruction } from "../../../../commander/src/Instruction/Instruction";

/**
 * Boot Command.
 *
 * Handles the 'boot' command, allowing a bot to boot other bots in the system.
 */
export class Boot extends Command {

  /**
   * Execute command.
   *
   * @inheritDoc
   */
  public async execute(instruction: Instruction, resonance: Resonance): Promise<void> {
    // The raw content here should be the ID of the bot we want to activate.
    // We'll attempt the load the bot with this content.
    const botToBoot = ServiceContainer.get(BotCatalogue).getBot(resonance.content);

    // If the bot doesn't exist, we can't boot it.
    if (!botToBoot) {
      await resonance.__reply("Hmm...That bot doesn't seem to exist in the codebase. Did you make a typo? Make sure to enter the exact ID of the bot for this to work.");

      return;
    }

    // Now we should check if the bot is already online.
    if (botToBoot.summoned) {
      await resonance.__reply("That bot is already online!");

      return;
    }

    // If all is good, we can go ahead and boot the bot.
    await resonance.__reply("Initializing boot process for {{bot}}. They should be active shortly!", {bot: botToBoot.id });
    await botToBoot.summon();
  }

}
