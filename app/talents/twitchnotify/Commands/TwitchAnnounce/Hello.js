/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Hello command.
 *
 * Literally just replies with 'Hello!'.
 *
 * A great testing command.
 */
class Hello extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {
    resonance.message.reply('Hello!');
  }

}

module.exports = Hello;