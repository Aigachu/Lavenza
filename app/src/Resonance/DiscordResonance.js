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
   * @inheritDoc
   */
  async i18n(content) {
    await this.message.reply(content).catch(Lavenza.stop);
  }

  /**
   * @inheritDoc
   */
  async reply(content, replacers) {
    await this.message.reply(content).catch(Lavenza.stop);
  }

  /**
   * @inheritDoc
   */
  async send(content, replacers, destination) {
    await destination.send(content).catch(Lavenza.stop);
  }

}