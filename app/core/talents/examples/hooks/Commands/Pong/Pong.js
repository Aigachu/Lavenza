/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Pong command.
 *
 * The last tutorial command. It'll be way more advanced. :)
 */
export default class Pong extends Lavenza.Command {

  /**
   * This is the static build function of the command.
   *
   * You can treat this as a constructor. Assign any properties that the command may
   * use!
   *
   * @inheritDoc
   */
  static async build(config, talent) {

    // The build function must always run the parent's build function! Don't remove this line.
    await super.build(config, talent);

  }

  /**
   * @inheritDoc
   */
  static execute(resonance) {
    resonance.reply('Pong! Here is your ID: {{id}}! {{tea}}', {id: resonance.author.id, tea: ':tea:'});
  }

}