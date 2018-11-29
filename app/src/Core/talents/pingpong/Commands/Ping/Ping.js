/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

class Ping extends Lavenza.Command {
  static execute(content, message, bot, client) {
    message.reply('Pong!');
  }
}

module.exports = Ping;