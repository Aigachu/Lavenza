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

/**
 * Shutdown Command.
 *
 * Handles the 'boot' command, allowing a bot to shutdown other bots in the system.
 */
export class Shutdown extends Command {

  /**
   * Execute command.
   *
   * @inheritDoc
   */
  public async execute(resonance: Resonance): Promise<void> {
    // The raw content here should be the ID of the bot we want to shutdown.
    // We'll attempt the load the bot with this content.
    const botToShutdown = ServiceContainer.get(BotCatalogue).getBot(resonance.content);

    // Now we should check if the bot exists.
    if (!botToShutdown) {
      await resonance.__reply("Hmm...That bot doesn't seem to exist in the codebase. Did you make a typo? Make sure to enter the exact ID of the bot for this to work.");

      return;
    }

    // Now we should check if the bot is already online.
    if (botToShutdown.summoned) {
      await resonance.__reply("That bot is already offline!");

      return;
    }

    // If all is good, we can go ahead and boot the bot.
    await resonance.__reply("Shutting down {{bot}}...", {bot: botToShutdown.id});
    await botToShutdown.shutdown();
  }

}
