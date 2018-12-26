/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import EventEmitter from 'events';

/**
 * Provides a base class for Prompts.
 *
 * Prompts can be set for a bot to await input from a user. Using the received input, it can then act upon it.
 */
export default class Prompt {

  constructor(request, resonance, onResponse, bot) {
    this.request = request;
    this.resonance = resonance;
    this.onResponse = onResponse;
    this.bot = bot;
    this.ee = new EventEmitter();
  }

  async listen(resonance) {
    if (this.condition(resonance)) {
      this.ee.emit('prompt-response', this);
      this.onResponse(resonance, this).catch(Lavenza.stop);
      this.disable().catch(Lavenza.stop);
    }
  }

  await(seconds) {
    return new Promise((resolve, reject) => {
      // Set the bomb. We'll destroy the prompt if it takes too long to execute.
      let timer = setTimeout(async () => {
        // Check if the prompt still exists after the time has elapsed.
        if (this.bot.prompts.includes(this)) {
          // If the lifespan depletes, we remove the prompt.
          await this.disable().catch(Lavenza.stop);
          reject('Prompt failed to complete in time.');
        }
      }, seconds * 1000);

      // If we get a response, we clear the bomb and return early.
      this.ee.on('prompt-response', (prompt) => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  condition() {
    Lavenza.throw('This method should not have been called. A Prompt acts differently depending on the client it is created for. Please create a Prompt that applies to the client you are in when calling this.');
  }

  async disable() {
    await this.bot.removePrompt(this);
  }

  async prompt() {
    Lavenza.throw('This method should not have been called. A Prompt acts differently depending on the client it is created for. Please create a Prompt that applies to the client you are in when calling this.');
  }
}