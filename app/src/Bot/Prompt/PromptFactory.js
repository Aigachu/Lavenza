/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Prompt from './Prompt';
import DiscordPrompt from './DiscordPrompt';

import ClientTypes from "../Client/ClientTypes";

/**
 * Provide a factory class that manages the creation of the right client given a type.
 */
export default class PromptFactory {


  static async build(request, resonance, onResponse, bot) {

    // Initialize the object.
    let prompt = {};

    // Depending on the requested type, we build the appropriate client.
    switch (resonance.client.type) {
      case ClientTypes.Discord:
        prompt = new DiscordPrompt(request, resonance, onResponse, bot);
        break;

      // case ClientTypes.Twitch:
      //   client = new TwitchClient(config);
      //   break;

      // case ClientTypes.Slack:
      //   client = new SlackClient(config);
      //   break;
    }

    // Whatever the prompt, fire the request.
    await prompt.prompt().catch(Lavenza.stop);

    return prompt;
  }

}
