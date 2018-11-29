import ClientTypes from "../Client/ClientTypes";

/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

export default class Listener {
  static listen(content, message, bot, client) {
    Lavenza.log(`(${bot.name}) - Message heard from {${client.type}} client: "${content}"`);
  }
}