/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
const Resonance = require('./Resonance');
const TwitchUser = require('../Client/TwitchClient/TwitchUser');
const TwitchChannel = require('../Client/TwitchClient/TwitchChannel');
const ClientTypes = require('../Client/ClientTypes');
const Gestalt = require('../../Gestalt/Gestalt');
const Igor = require('../../Confidants/Igor');
const Sojiro = require('../../Confidants/Sojiro');

/**
 * Provides specific Resonance properties for messages coming from Discord.
 */
module.exports = class TwitchResonance extends Resonance {

  /**
   * DiscordResonance constructor.
   * @inheritDoc
   */
  constructor(content, message, bot, client) {
    // Run parent constructor.
    super(content, message, bot, client);

    // For Twitch, we'll set some useful information to the class.
    this.author = message.author;
    this.channel = message.channel;
  }

  /**
   * Resolve language to translate content to for this resonance.
   *
   * In Discord, there are three ways to configure the language:
   *  - Guild (Server) Locale - Setting a language per guild.
   *  - Channel Locale - Setting a language per channel.
   *  - User - Setting a language per user.
   *
   * Here, we want to query Gestalt to check if configurations are set for this resonance's environment.
   *
   * If no configurations are set, we simply take the default language set for the bot.
   *
   * @inheritDoc
   */
  async getLocale() {
    // First, we check if configurations exist for this user.
    let i18nUserConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/twitch/users`).catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nUserConfig[this.author.id] && i18nUserConfig[this.author.id].locale && i18nUserConfig[this.author.id].locale !== 'default') {
      return i18nUserConfig[this.author.id].locale;
    }

    // Second, we check if configurations exist for this channel.
    let i18nChannelConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/twitch/channels`).catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nChannelConfig[this.author.id] && i18nChannelConfig[this.author.id].locale && i18nChannelConfig[this.author.id].locale !== 'default') {
      return i18nChannelConfig[this.channel.id].locale;
    }

    // Return the parameters.
    return await this.bot.getActiveConfig().locale;
  }

  /**
   * Send a message to a destination in Discord.
   *
   * @inheritDoc
   */
  async doSend(bot, destination, content) {

    // If the destination is a channel, and it's a private whisper channel, we use TMI's whisper function instead.
    if (destination instanceof TwitchChannel && destination.type === 'whisper') {
      return await bot.getClient(ClientTypes.Twitch).whisper(destination.id, content);
    }

    // If the destination is a user, then we send a whisper as well.
    if (destination instanceof TwitchUser) {
      return await bot.getClient(ClientTypes.Twitch).whisper(destination.username, content);
    }

    // If the destination is a string and doesn't start with '#', we send it through a whisper.
    if (typeof destination === 'string' && !destination.startsWith('#')) {
      return await bot.getClient(ClientTypes.Twitch).whisper(destination, content);
    }

    // If the destination is a string and starts with '#', we send it to the channel.
    if (typeof destination === 'string' && !destination.startsWith('#')) {
      return await bot.getClient(ClientTypes.Twitch).say(destination, content);
    }

    // Otherwise, we just send it to the destination, assuming it's simply the name of a channel.
    return await bot.getClient(ClientTypes.Twitch).say(destination.id, content);
  }

  /**
   * Get origin of the resonance.
   *
   * In the case of Discord, we get the channel the message originates from.
   *
   * @inheritDoc
   */
  resolveOrigin() {
    return this.message.channel;
  }

  /**
   * Get privacy of the resonance.
   *
   * In the case of Twitch, we get the type of message that was sent.
   *
   * @inheritDoc
   */
  resolvePrivacy() {
    return this.message.channel.type === "whisper" ? 'private' : 'public';
  }

  /**
   * Emulate the bot typing for a given amount of seconds.
   *
   * In the case of Twitch, we simply wait for the amount of seconds, as Twitch doesn't have typing notifiers.
   *
   * @inheritDoc
   */
  async typeFor(seconds, destination = undefined) {
    return Sojiro.wait(seconds);
  }

};