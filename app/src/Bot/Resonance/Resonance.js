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
 * receives.
 *
 * If a message contains a command, it will be stored here after being deciphered. Everything happens here, and all
 * relevant data can be found here.
 *
 * To manage different types of clients, this class also acts as a parent class to child classes that are more
 * client specific. This being said, child classes make good use of functions and properties in this class.
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
    this.order = undefined;
    this.origin = this.resolveOrigin();
  }

  /**
   * Execute command coming from this resonance.
   *
   * The command is attached to the order linked to this resonance, if any.
   *
   * And order is only built and attached to the resonance if it's found through the CommandInterpreter.
   */
  executeCommand() {
    this.order.command.execute(this);
  }

  /**
   * Execute help request for a command, coming from this resonance.
   *
   * The command is attached to the order linked to this resonance, if any.
   *
   * And order is only built and attached to the resonance if it's found through the CommandInterpreter.
   */
  executeHelp() {
    this.order.command.help(this);
  }

  /**
   * Reply to the current resonance.
   *
   * This will send a formatted reply to the Resonance, replying directly to the message that was heard.
   *
   * We make this function flexible, similar to how i18n.__() works. It will allow multiple definitions for function
   * calls and act depending on what types of parameters are given.
   *
   * @param {*} parameters
   *   Parameters to parse from the call.
   *
   * @returns {Promise<*>}
   *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
   *   act upon it if needed.
   */
  async reply(...parameters) {

    // Parse the parameters obtained.
    let params = Lavenza.Sojiro.parseI18NParams(parameters);

    // Basically call the send method, but we already know the destination.
    await this.send(this.origin, {phrase: params.phrase, locale: params.locale}, params.replacers, 'PARSED').catch(Lavenza.stop);

  }

  /**
   * Send a message to a destination using information from the resonance.
   *
   * This will send a formatted message to it's destination.
   *
   * This function acts as a shortcut to sending messages back to a resonance. It
   * will handle translation of the text as well.
   *
   * We make this function flexible, similar to how i18n.__() works. It will allow multiple definitions for function
   * calls and act depending on what types of parameters are given.
   *
   * @param {*} destination
   *   Destination to send this message to.
   * @param {*} parameters
   *   Parameters to parse from the call.
   *
   * @returns {Promise<*>}
   *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
   *   act upon it if needed.
   */
  async send(destination, ...parameters) {

    // Parse the parameters obtained.
    let params = Lavenza.Sojiro.parseI18NParams(parameters);

    // If a locale is not set in the parameters, we need to determine what it is using the Resonance.
    if (params.locale === undefined) {
      params = await this.i18n(params).catch(Lavenza.stop);
    }

    // Now, using the information from the parameters, we fetch necessary translations.
    let content = Lavenza.__(params, 'PARSED');

    // And finally we can send the message to the destination.
    return await this.doSend(destination, content).catch(Lavenza.stop);

  }

  /**
   * Execute the actions required to send a message to a destination.
   *
   * This is an abstract method. Each Resonance must manage sending of messages for its cases depending on its client.
   *
   * @param {*} destination
   *   Destination to send the message to.
   * @param {string} content
   *   Content of the message to send back.
   */
  async doSend(destination, content) {
    console.log(destination);
    console.log(content);
    Lavenza.throw('Tried to fire abstract method doSend(). You must implement a doSend() method in the {{class}} class.', {class: this.constructor});
  }

  /**
   * Process parameters through i18n translation specifications for this Resonance.
   *
   * This is an abstract method. Each Resonance must manage translations for its cases depending on its client.
   *
   * @param {Array} args
   *   Arguments used to properly
   */
  async i18n(args) {
    console.log(args);
    Lavenza.throw('Tried to fire abstract method i18n(). You must implement a i18n() method in the {{class}} class.', {class: this.constructor});
  }

  /**
   * Obtain the origin of the message.
   *
   * Depending on the client, the origin will be determined differently. The goal is to be able to easily send
   * anything back to the origin, without necessarily having to go get it.
   *
   * @return {*}
   *   Origin of the message. Depending on the client, it could be anything.
   */
  resolveOrigin() {
    Lavenza.throw('Tried to fire abstract method resolveOrigin(). You must implement a resolveOrigin() method in the {{class}} class.', {class: this.constructor});
  }

}