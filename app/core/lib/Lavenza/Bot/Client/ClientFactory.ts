/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Includes
import DiscordClient from './DiscordClient/DiscordClient';
import TwitchClient from './TwitchClient/TwitchClient';
import ClientType from "./ClientType";
import {BotClientConfig, BotDiscordClientConfig, BotTwitchClientConfig} from "../BotConfigurations";
import Bot from "../Bot";
import ClientInterface from "./ClientInterface";
// import SlackClient from './SlackClient/SlackClient';

/**
 * Provide a factory class that manages the creation of the right client given a type.
 */
export default class ClientFactory {

  /**
   * Creates a client instance given a type, bot and configuration.
   *
   * Each type of client has a different class. We will properly decouple and manage the functionality of each type of
   * client.
   *
   * @param type
   *   Type of client to build.
   * @param config
   *   Configuration object to create the client with, fetched from the bot's configuration file.
   * @param bot
   *   Bot that this client will be linked to.
   *
   * @returns
   *   Client that was instantiated.
   */
  static async build(type: ClientType, config: BotClientConfig, bot: Bot): Promise<ClientInterface> {

    // Initialize the object.
    let client: ClientInterface;

    // Depending on the requested type, we build the appropriate client.
    switch (type) {

      // Create a DiscordClient if the type is Discord.
      case ClientType.Discord: {
        client = new DiscordClient(config as BotDiscordClientConfig, bot);
        break;
      }

      // Create a TwitchClient if the type is Discord.
      case ClientType.Twitch: {
        client = new TwitchClient(config as BotTwitchClientConfig, bot);
        break;
      }

      // // Create a SlackClient if the type is Discord.
      // case ClientType.Slack: {
      //   client = new SlackClient(config, bot);
      //   break;
      // }

    }

    return client;
  }

};
