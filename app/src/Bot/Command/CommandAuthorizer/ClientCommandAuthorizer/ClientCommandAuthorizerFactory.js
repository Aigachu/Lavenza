/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import DiscordClientCommandAuthorizer from './DiscordClientCommandAuthorizer';
import ClientTypes from "../../../Client/ClientTypes";
import DiscordClient from "../../../Client/DiscordClient/DiscordClient";

/**
 *
 */
export default class ClientCommandAuthorizerFactory {

  static build(order, resonance) {
    switch (resonance.client.type) {
      case ClientTypes.Discord:
        return DiscordClientCommandAuthorizer;

      // case ClientTypes.Twitch:
      //   client = new TwitchClient(config);
      //   break;

      // case ClientTypes.Slack:
      //   client = new SlackClient(config);
      //   break;
    }
  }

}