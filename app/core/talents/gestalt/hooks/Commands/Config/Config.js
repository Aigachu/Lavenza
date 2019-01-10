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
export default class Config extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static execute(resonance) {
    console.log(resonance.order.args);
    resonance.message.reply('```\n' + resonance.order.args.toString() + '\n```');
    resonance.message.reply('Config command!');
  }

}