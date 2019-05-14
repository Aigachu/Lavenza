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
  constructor(user, line, resonance, lifespan, onResponse, onError, bot) {
    super(user, line, resonance, lifespan, onResponse, onError, bot);
  }

  /**
   * @inheritDoc
   */
  condition(resonance) {

    // In Discord, we wait for the next message that comes from the author, in the configured 'line'.
    return resonance.message.channel.id === this.line.id && resonance.message.author.id === this.user.id;

  }

}