/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import {Message as DiscordJSMessage, Channel as DiscordJSChannel, User as DiscordJSUser} from 'discord.js';

// Imports.
import ResonanceFactory from './ResonanceFactory';
import TwitchUser from '../Client/TwitchClient/TwitchUser';
import TwitchChannel from '../Client/TwitchClient/TwitchChannel';

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
    this.order = undefined; // An order is set to the Resonance only if it is found in the command interpreter.
    this.author = undefined; // The author will be resolved depending on the type of Resonance.
  }

  /**
   * Perform build tasks for a Resonance.
   *
   * This function runs shortly after a resonance is constructed. Consider this an asynchronous constructor.
   *
   * @returns {Promise<void>}
   */
  async build() {
    this.origin = await this.resolveOrigin();
    this.locale = await this.getLocale();
    this.private = await this.resolvePrivacy();
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
   * @param {*} content
   *   Content to send back.
   * @param {string} personalizationTag
   *   Tag for text personalizations, if needed. This will use Yoshida to get personalizations for the current bot.
   *
   * @returns {Promise<*>}
   *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
   *   act upon it if needed.
   */
  async reply(content, personalizationTag = '') {

    // Basically call the send method, but we already know the destination.
    return await this.send(this.origin, content, personalizationTag);

  }

  /**
   * Reply to the current resonance, with a translating the string.
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
  async __reply(...parameters) {

    // Parse the parameters obtained.
    let params = await Lavenza.Sojiro.parseI18NParams(parameters);

    // Basically call the send method, but we already know the destination.
    return await this.__send(this.origin, {phrase: params.phrase, locale: params.locale, tag: params.tag}, params.replacers, 'PARSED').catch(Lavenza.stop);

  }

  /**
   * Send a message to a destination using information from the resonance.
   *
   * This will send a formatted message to it's destination.
   *
   * This function acts as a shortcut to sending messages back to a resonance.
   *
   * @param {*} destination
   *   Destination to send this message to.
   * @param {*} content
   *   Content to send back to the destination.
   * @param {string} personalizationTag
   *   Tag for text personalizations, if needed. This will use Yoshida to get personalizations for the current bot.
   *
   * @returns {Promise<*>}
   *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
   *   act upon it if needed.
   */
  async send(destination, content, personalizationTag = '') {

    // If a personalization tag is set, we want to use Yoshida to get a personalization for this bot.
    if (!Lavenza.isEmpty(personalizationTag)) {
      content = await Lavenza.Yoshida.getPersonalization(personalizationTag, content, this.bot).catch(Lavenza.stop);
    }

    // Depending on the type of client the Destination is from, we want to send using the appropriate methods.
    // In the case of Discord, we check if the destination is an instance of any of the DiscordJS classes.
    if (destination instanceof DiscordJSMessage || destination instanceof DiscordJSUser || destination instanceof DiscordJSChannel) {
      // We fire the DiscordResonance's sending method.
      return await ResonanceFactory.send(Lavenza.ClientTypes.Discord, this.bot, destination, content);
    }

    // Twitch objects will contain these kinds of properties.
    if (typeof destination === 'string' || destination instanceof TwitchUser || destination instanceof TwitchChannel) {
      // We fire the TwitchResonance's sending method.
      return await ResonanceFactory.send(Lavenza.ClientTypes.Twitch, this.bot, destination, content);
    }

    // If all fails, we'll simply use this instance's doSend function.
    return await this.constructor.doSend(this.bot, destination, content);

  }

  /**
   * Send a message to a destination using information from the resonance, translating the text.
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
  async __send(destination, ...parameters) {

    // Parse the parameters obtained.
    let params = await Lavenza.Sojiro.parseI18NParams(parameters);

    // If a locale is not set in the parameters, we need to determine what it is using the Resonance.
    if (params.locale === undefined) {
      params.locale = await this.locale;
    }

    // If a locale is STILL not defined after the above code, we set it to the default one set to the bot.
    if (params.locale === undefined) {
      params.locale = await this.bot.getActiveConfig().locale;
    }

    // If a personalization tag is set, we want to use Yoshida to get a personalization for this bot.
    if (!Lavenza.isEmpty(params.tag)) {
      params.phrase = await Lavenza.Yoshida.getPersonalization(params.tag, params.phrase, this.bot).catch(Lavenza.stop);
    }

    // Now, using the information from the parameters, we fetch necessary translations.
    let content = await Lavenza.__({phrase: params.phrase, locale: params.locale}, params.replacers, 'PARSED');

    // Invoke the regular send function.
    return await this.send(destination, content);

  }

  /**
   * Execute the actions required to send a message to a destination.
   *
   * This is an abstract method. Each Resonance must manage sending of messages for its cases depending on its client.
   *
   * @param {Bot} bot
   *   The bot sending the message.
   * @param {*} destination
   *   Destination to send the message to.
   * @param {string} content
   *   Content of the message to send back.
   *
   * @returns {Promise<*>}
   *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
   *   act upon it if needed.
   */
  static async doSend(bot, destination, content) {
    console.log(destination);
    console.log(content);
    await Lavenza.throw('Tried to fire abstract method doSend(). You must implement a doSend() method in the {{class}} class.', {class: this.constructor});
  }

  /**
   * Process parameters through i18n translation specifications for this Resonance.
   *
   * This is an abstract method. Each Resonance must manage translations for its cases depending on its client.
   */
  async getLocale() {
    await Lavenza.throw('Tried to fire abstract method getLocale(). You must implement a getLocale() method in the {{class}} class.', {class: this.constructor});
  }

  /**
   * Determine the origin of the message.
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

  /**
   * Determine whether or not this resonance was a private message to the bot.
   *
   * Depending on the client, the privacy will be determined differently. The goal is to be able to easily send
   * anything back privately if needed.
   *
   * @return {*}
   *   Privacy of the message. Depending on the client's checks, it will return either 'public' or 'private'.
   */
  resolvePrivacy() {
    Lavenza.throw('Tried to fire abstract method resolvePrivacy(). You must implement a resolvePrivacy() method in the {{class}} class.', {class: this.constructor});
  }

}