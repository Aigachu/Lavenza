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


  static async build(request, line, resonance, onResponse, bot) {

    // Initialize the object.
    let prompt = {};

    // Depending on the requested type, we build the appropriate client.
    switch (resonance.client.type) {

      // For Discord clients, we build a Discord Prompt.
      case Lavenza.ClientTypes.Discord: {
        prompt = new DiscordPrompt(request, line, resonance, onResponse, bot);
        break;
      }

      // For Twitch clients, we build a Twitch Prompt.
      case Lavenza.ClientTypes.Twitch: {
          prompt = new TwitchPrompt(request, line, resonance, onResponse, bot);
        break;
      }

      // // For Slack clients, we build a Slack Prompt.
      // case ClientTypes.Slack: {
      //   prompt = new SlackPrompt(request, line, resonance, onResponse, bot);
      //   break;
      // }

    }

    // Whatever the prompt, fire the request.
    await prompt.prompt();

    return prompt;
  }

}
