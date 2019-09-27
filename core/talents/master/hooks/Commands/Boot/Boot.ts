/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {Sojiro} from "../../../../../lib/Lavenza/Confidant/Sojiro";
import {BotManager} from "../../../../../lib/Lavenza/Bot/BotManager";
import {Command} from "../../../../../lib/Lavenza/Bot/Command/Command";

/**
 * Boot Command.
 *
 * Handles the 'boot' command, allowing a bot to boot other bots in the system.
 */
export class Boot extends Command {

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
    let botToBoot = resonance.instruction.content;

    // Now we should check if the bot exists.
    if (Sojiro.isEmpty(BotManager.bots[botToBoot])) {
      await resonance.__reply(`Hmm...That bot doesn't seem to exist in the codebase. Did you make a typo? Make sure to enter the exact ID of the bot for this to work.`);
      return;
    }

    // If all is good, we can go ahead and boot the bot.
    await resonance.__reply(`Initializing boot process for {{bot}}. They should be active shortly!`, {bot: botToBoot});
    await BotManager.boot(botToBoot);
  }

}
