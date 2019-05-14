/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Resonance from './Resonance';

/**
 * Provides specific Resonance properties for messages coming from Discord.
 */
export default class DiscordResonance extends Resonance {

  /**
   * DiscordResonance constructor.
   * @inheritDoc
   */
  constructor(content, message, bot, client) {

    // Run parent constructor.
    super(content, message, bot, client);

    // For Discord, we'll set some useful information to the class.
    this.author = message.author;
    this.guild = message.guild;
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
    let i18nUserConfig = await Lavenza.Gestalt.get(`/i18n/${this.bot.id}/clients/discord/users`).catch(Lavenza.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nUserConfig[this.author.id] && i18nUserConfig[this.author.id].locale && i18nUserConfig[this.author.id].locale !== 'default') {
      return i18nUserConfig[this.author.id].locale;
    }

    // Second, we check if configurations exist for this channel.
    let i18nChannelConfig = await Lavenza.Gestalt.get(`/i18n/${this.bot.id}/clients/discord/channels`).catch(Lavenza.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nChannelConfig[this.author.id] && i18nChannelConfig[this.author.id].locale && i18nChannelConfig[this.author.id].locale !== 'default') {
      return i18nChannelConfig[this.channel.id].locale;
    }

    // First, we check if configurations exist for this guild.
    let i18nGuildConfig = await Lavenza.Gestalt.get(`/i18n/${this.bot.id}/clients/discord/guilds`).catch(Lavenza.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nGuildConfig[this.author.id] && i18nGuildConfig[this.author.id].locale && i18nGuildConfig[this.author.id].locale !== 'default') {
      return i18nGuildConfig[this.guild.id].locale;
    }

    // Return the parameters.
    return await this.bot.getActiveConfig().locale;

  }

  /**
   * Send a message to a destination in Discord.
   *
   * @inheritDoc
   */
  static async doSend(bot, destination, content) {
    return await destination.send(content).catch(Lavenza.stop);
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
   * In the case of Discord, we get the type of channel the message was heard from.
   *
   * @inheritDoc
   */
  resolvePrivacy() {
    return this.message.channel.type === "dm" ? 'private' : 'public';
  }

  /**
   * Emulate the bot typing for a given amount of seconds.
   *
   * In the case of Discord, we simply fire the client's typeFor function.
   *
   * @inheritDoc
   */
  async typeFor(seconds, destination) {
    return this.client.typeFor(seconds, destination);
  }

}