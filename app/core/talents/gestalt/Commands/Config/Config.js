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
class Config extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static execute(order, resonance) {
    console.log(order.args);
    resonance.message.reply('```\n' + order.args.toString() + '\n```');
    resonance.message.reply('Config command!');
  }

}

module.exports = Config;