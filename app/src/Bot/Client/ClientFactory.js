/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */

// Includes
const ClientTypes = require('./ClientTypes');
const DiscordClient = require('./DiscordClient/DiscordClient');
// const TwitchClient = require('./TwitchClient/TwitchClient');
// const SlackClient = require('./SlackClient/SlackClient');

class ClientFactory {

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

module.exports = ClientFactory;
