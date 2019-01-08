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
   * @inheritDoc
   */
  static execute(order, resonance) {
    resonance.message.reply(Lavenza.__('Pong!'));
  }

}