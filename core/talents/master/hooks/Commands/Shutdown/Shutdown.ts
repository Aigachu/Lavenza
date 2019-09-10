/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Command from "../../../../../lib/Lavenza/Bot/Command/Command";
import Sojiro from "../../../../../lib/Lavenza/Confidant/Sojiro";
import BotManager from "../../../../../lib/Lavenza/Bot/BotManager";

/**
 * Shutdown Command.
 *
 * Handles the 'boot' command, allowing a bot to shutdown other bots in the system.
 */
export default class Shutdown extends Command {

  /**
   * @inheritDoc
   */
  async build(config, talent) {
    // The build function must always run the parent's build function! Don't remove this line.
    await super.build(config, talent);
  }

  /**
   * @inheritDoc
   */
  async execute(resonance) {
    // The raw content here should be the ID of the bot we want to activate.
    let botToShutdown = resonance.instruction.content;

    // Now we should check if the bot exists.
    if (Sojiro.isEmpty(BotManager.bots[botToShutdown])) {
      await resonance.__reply(`Hmm...That bot doesn't seem to exist in the codebase. Did you make a typo? Make sure to enter the exact ID of the bot for this to work.`);
      return;
    }

    // If all is good, we can go ahead and boot the bot.
    await resonance.__reply(`Shutting down {{bot}}...`, {bot: botToShutdown});
    await BotManager.shutdown(botToShutdown);
  }

}