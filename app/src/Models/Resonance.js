/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a model that regroups information about a message received from a client.
 *
 * I love the name. But yes, this is a model to house a collection of useful information about a message a bot
 * receives. It will be used at the bot level, once a message is heard.
 */
export default class Resonance {

  /**
   * Resonance constructor.
   *
   * @param {string} content
   *   The raw string content of the message received. This is deciphered by the bot.
   * @param {Message} message
   *   The message object received, unmodified. This is useful, since different clients might send different kinds of
   *   messages. It's always nice to have the original message.
   * @param {Bot} bot
   *   The bot that heard this resonance.
   * @param {*} client
   *   The client that sent the original message.
   */
  constructor(content, message, bot, client) {
    this.content = content;
    this.message = message;
    this.bot = bot;
    this.client = client;
  }

}