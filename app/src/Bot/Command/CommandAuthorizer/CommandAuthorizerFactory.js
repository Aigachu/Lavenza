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
 *
 */
export default class CommandAuthorizerFactory {

  static async build(order, resonance) {
    let authorizer = null;
    switch (resonance.client.type) {
      case ClientTypes.Discord:
        authorizer = new DiscordCommandAuthorizer(order, resonance);

      // case ClientTypes.Twitch:
      //   client = new TwitchClient(config);
      //   break;

      // case ClientTypes.Slack:
      //   client = new SlackClient(config);
      //   break;
    }

    if (Lavenza.isEmpty(authorizer)) {
      Lavenza.throw('Command authorizer could not be built. This should not happen. Fix your shitty code, Aiga!');
    }

    await authorizer.build().catch(Lavenza.stop);
    return authorizer;
  }



}