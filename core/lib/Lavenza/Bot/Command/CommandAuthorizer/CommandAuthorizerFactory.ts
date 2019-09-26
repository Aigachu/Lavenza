/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {DiscordCommandAuthorizer} from './DiscordCommandAuthorizer';
import {TwitchCommandAuthorizer} from './TwitchCommandAuthorizer';
import {Resonance} from "../../Resonance/Resonance";
import {ClientType} from "../../Client/ClientType";
import {Sojiro} from "../../../Confidant/Sojiro";
import {Igor} from "../../../Confidant/Igor";
import {Command} from "../Command";
import {CommandAuthorizer} from "./CommandAuthorizer";

/**
 * Provides a factory to create the appropriate CommandAuthorizer given a client.
 *
 * Each client validates clients in different ways.
 */
export class CommandAuthorizerFactory {

  /**
   * Build the appropriate authorizer given the client.
   *
   * @param resonance
   *   The Resonance returned from the Listener, containing the command.
   * @param command
   *   The Command that was located in the Resonance.
   *
   * @returns
   *   The appropriate CommandAuthorizer given the received message & command.
   */
  public static async build(resonance: Resonance, command: Command): Promise<CommandAuthorizer> {
    // Initialize the variable.
    let authorizer = null;

    //  Depending on the client type, build the appropriate CommandAuthorizer.
    switch (resonance.client.type) {

      // For Discord, we create a specific authorizer.
      case ClientType.Discord: {
        authorizer = new DiscordCommandAuthorizer(resonance, command);
        break;
      }

      case ClientType.Twitch: {
        authorizer = new TwitchCommandAuthorizer(resonance, command);
        break;
      }

      // case ClientTypes.Slack:
      //   client = new SlackClient(config);
      //   break;
    }

    // This really shouldn't happen...But yeah...
    if (Sojiro.isEmpty(authorizer)) {
      await Igor.throw('Command authorizer could not be built. This should not happen. Fix your shitty code, Aiga!');
    }

    // Build the authorizer. Then we're good to go. We can send it back to the listener.
    await authorizer.build(resonance);
    return authorizer;
  }

}