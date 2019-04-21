/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Resonance from './Resonance';

/**
 * Provides specific Resonance properties for messages coming from Slack.
 */
export default class SlackResonance extends Resonance {

  /**
   * SlackResonance constructor.
   * @inheritDoc
   */
  constructor(content, message, bot, client) {

    // Run parent constructor.
    super(content, message, bot, client);

    // For Slack, we'll set some useful information to the class.
    this.author = message.author;
    this.workspace = message.workspace;
    this.channel = message.channel;

  }

  /**
   * Resolve language to translate content to for this resonance.
   *
   * In Slack, there is one way to configure the language:
   *  - User - Setting a language per user (per workspace).
   *
   * Here, we want to query Gestalt to check if configurations are set for this
   * resonance's environment.
   *
   * If no configurations are set, we simply take the default language set for
   * the bot.
   *
   * @inheritDoc
   */
  async getLocale() {

    // First, we check if configurations exist for this user.
    let i18nUserConfig = await Lavenza.Gestalt.get(`/i18n/${this.bot.id}/clients/slack/users`).catch(Lavenza.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nUserConfig[this.author.id] && i18nUserConfig[this.author.id].locale && i18nUserConfig[this.author.id].locale !== 'default') {
      return i18nUserConfig[this.author.id].locale;
    }

    // Return the parameters.
    return await this.bot.getActiveConfig().locale;

  }

  /**
   * Send a message to a destination in Slack.
   *
   * @inheritDoc
   */
  static async doSend(bot, destination, content) {
    return await destination.send(content).catch(Lavenza.stop);
  }

  /**
   * Get origin of the resonance.
   *
   * In the case of Slack, we get the channel the message originates from.
   *
   * @inheritDoc
   */
  resolveOrigin() {
    return this.message.channel;
  }

  /**
   * Get privacy of the resonance.
   *
   * In the case of Slack, we get the type of channel the message was heard
   * from.
   *
   * @inheritDoc
   */
  resolvePrivacy() {
    return this.message.channel.is_private === true ? 'private' : 'public';
  }

}
