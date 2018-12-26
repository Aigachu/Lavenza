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

  constructor(request, resonance, onResponse, bot) {
    super(request, resonance, onResponse, bot);
  }

  condition(resonance) {
    return resonance.message.author.id === this.resonance.message.author.id;
  }

  async prompt() {
    this.resonance.message.channel.send(this.request);
  }
}