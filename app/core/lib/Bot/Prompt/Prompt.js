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

  /**
   * Prompt constructor.
   *
   * @param {*} user
   *   User that is being prompted.
   * @param {String} request
   *   Message that will be sent describing the requested information.
   * @param {*} line
   *   The communication line for this prompt. Basically, where we want the interaction to happen.
   * @param {Lavenza.Resonance|Resonance} resonance
   *   The Resonance tied to this prompt.
   * @param {*} onResponse
   *   The callback function that runs once a response has been heard.
   * @param {Bot} bot
   *   The Bot this prompt is being created for.
   */
  constructor(user, request, line, resonance, onResponse, bot) {
    this.request = request;
    this.line = line;
    this.resonance = resonance;
    this.requester = resonance.author;
    this.user = user;
    this.onResponse = onResponse;
    this.bot = bot;
    this.ee = new EventEmitter();
  }

  /**
   * Prompts have their own listen functions.
   *
   * Checks the condition with a received resonance, and resolves the Prompt
   * if conditions are matched.
   *
   * @param {Lavenza.Resonance|Resonance} resonance
   *   The resonance that was heard by the Prompt.
   *
   * @returns {Promise<void>}
   */
  async listen(resonance) {

    // If the resonance that was just heard is not from the same client, we do nothing.
    if (resonance.client.type !== this.resonance.client.type) {
      return;
    }

    // We check the condition defined in this prompt. If it passes, we resolve it.
    if (await this.condition(resonance)) {

      // Emit the event that will alert the Prompt that it should be resolved.
      this.ee.emit('prompt-response');

      // Fire the callback.
      this.onResponse(resonance, this);

      // Disable this prompt since it's resolved.
      await this.disable();
    }
  }

  /**
   * Await the resolution of the prompt.
   *
   * If the prompt doesn't get resolved by the user within the lifespan, it will
   * cancel itself. Otherwise, after resolution, we clear the awaiting status.
   *
   * @param {int} seconds
   *   Amount of time to wait for an answer, in seconds.
   *
   * @returns {Promise<any>}
   *   Resolution of the prompt, or an error.
   */
  await(seconds) {

    // We manage the Promise here.
    return new Promise((resolve, reject) => {

      // Set the bomb. We'll destroy the prompt if it takes too long to execute.
      let timer = setTimeout(async () => {

        // Check if the prompt still exists after the time has elapsed.
        if (this.bot.prompts.includes(this)) {
          // If the lifespan depletes, we remove the prompt.
          await this.disable();
          reject('Prompt failed to complete in time.');
        }

      }, seconds * 1000);

      // If we get a response, we clear the bomb and return early.
      this.ee.on('prompt-response', () => {
        clearTimeout(timer);
        resolve();
      });

    });

  }

  /**
   * Disable this prompt.
   *
   * @returns {Promise<void>}
   */
  async disable() {
    await this.bot.removePrompt(this);
  }

  /**
   * Method defining the conditions for this prompt to be resolved.
   *
   * This is an abstract method.
   */
  async condition() {
    await Lavenza.throw('This method should not have been called. A Prompt acts differently depending on the client it is created for. Please create a Prompt that applies to the client you are in when calling this.');
  }

  /**
   * Trigger the prompt message. Read this one as the verb.
   *
   * This is an abstract method.
   *
   * @returns {Promise<void>}
   */
  async prompt() {
    await Lavenza.throw('This method should not have been called. A Prompt acts differently depending on the client it is created for. Please create a Prompt that applies to the client you are in when calling this.');
  }
}