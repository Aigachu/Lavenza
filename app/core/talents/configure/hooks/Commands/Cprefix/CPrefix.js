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
   * The execution of the command's actions.
   *
   * If this is a command that is available in multiple clients, you can make cases surrounding the 'type' property
   * of the resonance's client. A simple way to do this is to implement a switch statement on 'resonance.client.type'.
   *
   * Available for use is also the this.handlers() function. The best way to understand this is to take a long at this
   * command's folder and code!
   *
   * Alternatively, you can adopt any design pattern you want.
   *
   * @inheritDoc
   */
  static async execute(resonance) {

  }

}