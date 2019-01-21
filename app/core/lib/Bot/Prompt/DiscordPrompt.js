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
export default class DiscordPrompt extends Prompt {

  /**
   * @inheritDoc
   */
  constructor(request, line, resonance, onResponse, bot) {
    super(request, line, resonance, onResponse, bot);
  }

  /**
   * @inheritDoc
   */
  condition(resonance) {

    // In Discord, we wait for the next message that comes from the author, in the configured 'line'.
    return resonance.message.channel.id === this.line.id && resonance.message.author.id === this.resonance.message.author.id;

  }

  /**
   * @inheritDoc
   */
  async prompt() {

    // In discord, the line is always a channel. We send the request message there.
    await this.resonance.send(this.line, this.request);

  }

}