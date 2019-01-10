/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Ping command.
 *
 * Literally just replies with 'Pong!'.
 *
 * A great testing command.
 */
export default class Ping extends Lavenza.Command {

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
    await super.build(config, talent).catch(Lavenza.stop);

    // Example of setting a property to use across the command.
    this.pingMessage = 'Pong!'

  }

  /**
   * @inheritDoc
   */
  static execute(resonance) {
    console.log(resonance.message.author.id);
    resonance.reply('Pong! Here is your ID: {{id}}', {id: resonance.message.author.id});
  }

}