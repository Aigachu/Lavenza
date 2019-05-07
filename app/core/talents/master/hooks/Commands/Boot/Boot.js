/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Boot Command.
 *
 * Handles the 'boot' command, allowing a bot to boot other bots in the system.
 */
export default class Boot extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async build(config, talent) {

    // The build function must always run the parent's build function! Don't remove this line.
    await super.build(config, talent);

  }

  /**
   * @inheritDoc
   */
  static async execute(resonance) {
    // The raw content here should be the ID of the bot we want to activate.
    let botToBoot = resonance.order.rawContent;

    // Now we should check if the bot exists.
    if (Lavenza.isEmpty(Lavenza.BotManager.bots[botToBoot])) {
      await resonance.__reply(`Hmm...That bot doesn't seem to exist in the codebase. Did you make a typo? Make sure to enter the exact ID of the bot for this to work.`);
      return;
    }

    // If all is good, we can go ahead and boot the bot.
    await resonance.__reply(`Initializing boot process for {{bot}}. They should be active shortly!`, {bot: botToBoot});
    await Lavenza.BotManager.boot(botToBoot);
  }

}