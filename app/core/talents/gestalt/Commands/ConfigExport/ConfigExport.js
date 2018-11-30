/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Command that exports configurations to .yml files.
 */
class ConfigExport extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static execute(order, resonance) {
    resonance.message.reply('Hello!');
  }

}

module.exports = ConfigExport;