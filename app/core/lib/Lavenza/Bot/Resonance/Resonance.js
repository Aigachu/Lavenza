/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
const DiscordJS = require('discord.js');
const DiscordJSMessage = DiscordJS.Message;
const DiscordJSChannel = DiscordJS.Channel;
const DiscordJSUser = DiscordJS.User;

// Imports.
const ResonanceFactory = require('./ResonanceFactory');
const ClientTypes = require('../Client/ClientTypes');
const TwitchUser = require('../Client/TwitchClient/TwitchUser');
const TwitchChannel = require('../Client/TwitchClient/TwitchChannel');
const Sojiro = require('../../Confidants/Sojiro');
const Yoshida = require('../../Confidants/Yoshida');
const Igor = require('../../Confidants/Igor');

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
module.exports = class Resonance {

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
   * Set up a prompt to a specified user.
   *
   * Prompts are interactive ways to query information from a user in a seamless conversational way.
   *
   * @param {*} user
   *   User that is being prompted.
   * @param {*} line
   *   The communication line for this prompt. Basically, where we want the interaction to happen.
   * @param {int} lifespan
   *   The lifespan of this Prompt.
   *   If the bot doesn't receive an answer in time, we cancel the prompt.
   *   10 seconds is the average time a white boy waits for a reply from a girl he's flirting with after sending her a
   *   message. You want to triple that normally. You're aiming for a slightly more patient white boy. LMAO! Thank you
   *   AVION for this wonderful advice!
   * @param {*} onResponse
   *   The callback function that runs once a response has been heard.
   * @param {*} onError
   *   The callback function that runs once a failure occurs. Failure includes not getting a response.
   */
  async prompt(user, line, lifespan, onResponse, onError = (e) => { console.log(e); }) {
    // Simply run this through the bot's prompt function.
    await this.bot.prompt(user, line, this, lifespan, onResponse, onError);
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
    let params = await Sojiro.parseI18NParams(parameters);

    // Basically call the send method, but we already know the destination.
    return await this.__send(this.origin, {phrase: params.phrase, locale: params.locale, tag: params.tag}, params.replacers, 'PARSED').catch(Igor.stop);
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
    if (!Sojiro.isEmpty(personalizationTag)) {
      content = await Yoshida.personalize(content, personalizationTag, this.bot).catch(Igor.stop);
    }

    // If all fails, we'll simply use this instance's doSend function.
    // Which will currently crash the program.
    return await this.doSend(this.bot, destination, content).catch(Igor.stop);
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
    let params = await Yoshida.parseI18NParams(parameters);

    // If a locale is not set in the parameters, we need to determine what it is using the Resonance.
    if (params.locale === undefined) {
      params.locale = await this.locale;
    }

    // If a locale is STILL not defined after the above code, we set it to the default one set to the bot.
    if (params.locale === undefined) {
      params.locale = await this.bot.getActiveConfig().locale;
    }

    // If a personalization tag is set, we want to use Yoshida to get a personalization for this bot.
    if (!Sojiro.isEmpty(params.tag)) {
      params.phrase = await Yoshida.personalize(params.phrase, params.tag, this.bot).catch(Igor.stop);
    }

    // Now, using the information from the parameters, we fetch necessary translations.
    let content = await Yoshida.translate({phrase: params.phrase, locale: params.locale}, params.replacers, 'PARSED');

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
  async doSend(bot, destination, content) {
    await Igor.throw('Tried to fire abstract method doSend(). You must implement a doSend() method in the {{class}} class.', {class: this.constructor});
  }

  /**
   * Process parameters through i18n translation specifications for this Resonance.
   *
   * This is an abstract method. Each Resonance must manage translations for its cases depending on its client.
   */
  async getLocale() {
    await Igor.throw('Tried to fire abstract method getLocale(). You must implement a getLocale() method in the {{class}} class.', {class: this.constructor});
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
  async resolveOrigin() {
    await Igor.throw('Tried to fire abstract method resolveOrigin(). You must implement a resolveOrigin() method in the {{class}} class.', {class: this.constructor});
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
  async resolvePrivacy() {
    await Igor.throw('Tried to fire abstract method resolvePrivacy(). You must implement a resolvePrivacy() method in the {{class}} class.', {class: this.constructor});
  }

  /**
   * Emulate the bot typing for a given amount of seconds.
   *
   * Each client will have its way of handling this. We just need a proper shortcut function to simplify coding in
   * commands.
   *
   * @param {int} seconds
   *   The amount of seconds to type or wait for.
   * @param {*} destination
   *   Destination to type in, if needed.
   */
  async typeFor(seconds, destination = undefined) {
    await Igor.throw('Tried to fire abstract method typeFor(). You must implement a typeFor() method in the {{class}} class.', {class: this.constructor});
  }
};