/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Resonance from 'Resonance';

/**
 * Provides specific Resonance properties for messages coming from Discord.
 */
export default class DiscordResonance extends Resonance {

  /**
   * DiscordResonance constructor.
   * @inheritDoc
   */
  constructor(content, message, bot, client) {
    super(content, message, bot, client);
  }

  /**
   * Resolve language to translate content to.
   *
   * In Discord, there are two ways to configure the language:
   *  - Guild (Server) Locale - Setting a language per guild.
   *  - @TODO - Channel Locale - Setting a language per channel.
   *  - User - Setting a language per user.
   *
   * Here, we want to query Gestalt to check if configurations are set for this resonance's environment.
   *
   * If no configurations are set, we simply take the default language set for the bot.
   *
   * @inheritDoc
   */
  async i18n(params) {

  }

  /**
   * Send a message to a destination in Discord.
   *
   * @inheritDoc
   */
  async doSend(destination, content) {
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

}