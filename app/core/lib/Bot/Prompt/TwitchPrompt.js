/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Prompt from './Prompt';

/**
 * Provides a class for Prompts set in Discord.
 */
export default class TwitchPrompt extends Prompt {

  /**
   * @inheritDoc
   */
  constructor(user, request, line, resonance, onResponse, bot) {
    super(user, request, line, resonance, onResponse, bot);
  }

  /**
   * @inheritDoc
   */
  condition(resonance) {

    // In Twitch, we wait for the next message that comes from the same user.
    return resonance.message.channel.id === this.line.id && resonance.message.author.id === this.user.id;

  }

  /**
   * @inheritDoc
   */
  async prompt() {

    // In Twitch, the line is always a channel. We send the request message there.
    await this.resonance.send(this.line, this.request);

  }

}