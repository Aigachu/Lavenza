/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import DiscordPrompt from './DiscordPrompt';
import TwitchPrompt from './TwitchPrompt';

/**
 * Provide a factory class that manages the creation of the right client given a type.
 */
export default class PromptFactory {

  /**
   * Set up a prompt to a specified user.
   *
   * Prompts are interactive ways to query information from a user in a seamless conversational way.
   *
   * @param {*} user
   *   User that is being prompted.
   * @param {*} line
   *   The communication line for this prompt. Basically, where we want the interaction to happen.
   * @param {Lavenza.Resonance|Resonance} resonance
   *   The Resonance tied to this prompt.
   * @param {int} lifespan
   *   The lifespan of this Prompt.
   *   If the bot doesn't receive an answer in time, we cancel the prompt.
   *   10 seconds is the average time a white boy waits for a reply from a girl he's flirting with after sending her a
   *   message. You want to triple that normally. You're aiming for a slightly more patient white boy. LMAO!
   * @param {*} onResponse
   *   The callback function that runs once a response has been heard.
   * @param {*} onError
   *   The callback function that runs once a failure occurs. Failure includes not getting a response.
   * @param {Bot} bot
   *   The bot that is prompting the user.
   *
   * @returns {Promise<void>}
   */
  static async build(user, line, resonance, lifespan, onResponse, onError, bot) {

    // Initialize the object.
    let prompt = {};

    // Depending on the requested type, we build the appropriate client.
    switch (resonance.client.type) {

      // For Discord clients, we build a Discord Prompt.
      case Lavenza.ClientTypes.Discord: {
        prompt = new DiscordPrompt(user, line, resonance, lifespan, onResponse, onError, bot);
        break;
      }

      // For Twitch clients, we build a Twitch Prompt.
      case Lavenza.ClientTypes.Twitch: {
          prompt = new TwitchPrompt(user, line, resonance, lifespan, onResponse, onError, bot);
        break;
      }

      // // For Slack clients, we build a Slack Prompt.
      // case ClientTypes.Slack: {
      //   prompt = new SlackPrompt(request, line, resonance, onResponse, bot);
      //   break;
      // }

    }

    return prompt;
  }

}
