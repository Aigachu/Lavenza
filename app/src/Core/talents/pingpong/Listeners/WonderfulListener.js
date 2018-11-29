/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

class WonderfulListener extends Lavenza.Listener {
  static listen(content, message, bot, client) {
    if (content === 'wonderful') {
      message.reply('Wonderful! <3');
    }
  }
}

module.exports = WonderfulListener;