/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import DiscordCommandAuthorizer from './DiscordCommandAuthorizer';
import ClientTypes from "../../Client/ClientTypes";

/**
 * Provides a factory to create the appropriate CommandAuthorizer given a client.
 *
 * Each client validates clients in different ways.
 */
export default class CommandAuthorizerFactory {

  /**
   * Build the appropriate authorizer given the client.
   *
   * @param {Resonance} resonance
   *   The Resonance returned from the Listener, containing the command.
   *
   * @returns {Promise<CommandAuthorizer>}
   */
  static async build(resonance) {

    // Initialize the variable.
    let authorizer = null;

    //  Depending on the client type, build the appropriate CommandAuthorizer.
    switch (resonance.client.type) {

      // For Discord, we create a specific authorizer.
      case ClientTypes.Discord: {
        authorizer = new DiscordCommandAuthorizer(resonance);
        break;
      }

      // case ClientTypes.Twitch:
      //   client = new TwitchClient(config);
      //   break;

      // case ClientTypes.Slack:
      //   client = new SlackClient(config);
      //   break;
    }

    // This really shouldn't happen...But yeah...
    if (Lavenza.isEmpty(authorizer)) {
      await Lavenza.throw('Command authorizer could not be built. This should not happen. Fix your shitty code, Aiga!');
    }

    // Build the authorizer. Then we're good to go. We can send it back to the listener.
    await authorizer.build();
    return authorizer;
  }



}