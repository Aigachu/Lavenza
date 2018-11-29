/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Includes
import ClientTypes from './ClientTypes';
import DiscordClient from './DiscordClient/DiscordClient';
// import TwitchClient from './TwitchClient/TwitchClient';
// import SlackClient from './SlackClient/SlackClient';

export default class ClientFactory {

  static build(type, config, bot) {
    let client = {};
    switch (type) {
      case ClientTypes.Discord:
        client = new DiscordClient(config, bot);
        break;

      // case ClientTypes.Twitch:
      //   client = new TwitchClient(config);
      //   break;

      // case ClientTypes.Slack:
      //   client = new SlackClient(config);
      //   break;
    }

    return client;
  }

}
