/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Pong command.
 *
 * Literally just replies with 'Ping!'.
 *
 * A great testing command.
 */
export default class CPrefix extends Lavenza.Command {

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
    // Manage the 's' option.
    if ('s' in resonance.order.args) {
      // If the value is empty, we should get out.
      if (Lavenza.isEmpty(resonance.order.args.s)) return;

      // Get the current cprefix.
      let currentConfig = await Lavenza.Gestalt.get(`/bots/${resonance.bot.id}/config/core`);
      let currentPrefix = currentConfig.command_prefix;

      // Update the cprefix.
      await Lavenza.Gestalt.update(`/bots/${resonance.bot.id}/config/core`, {command_prefix: resonance.order.args.s});

      // Send a confirmation.
      await resonance.__reply(`I've updated the command prefix from {{oldPrefix}} to {{newPrefix}}.`, {
        oldPrefix: await Lavenza.bold(currentPrefix),
        newPrefix: await Lavenza.bold(resonance.order.args.s)
      });
    }
  }

}