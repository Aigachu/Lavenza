/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

import { Gestalt } from "../../Gestalt/Gestalt";
// Includes
import { Bot } from "../Bot";

import { Client } from "./Client";
import { BotClientConfig } from "./ClientConfigurations";
import { ClientType } from "./ClientType";
import { DiscordClient } from "./Discord/DiscordClient";
import { BotDiscordClientConfig } from "./Discord/DiscordConfigurations";
import { TwitchClient } from "./Twitch/TwitchClient";
import { BotTwitchClientConfig } from "./Twitch/TwitchConfigurations";

/**
 * Provide a factory class that manages the creation of the right client given a type.
 */
export class ClientFactory {

  /**
   * Creates a client instance given a type, bot and configuration.
   *
   * A client is created for each Bot.
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
  public static async build(type: ClientType, config: BotClientConfig, bot: Bot): Promise<Client> {
    // Initialize the object.
    let client: Client;

    // Depending on the requested type, we build the appropriate client.
    switch (type) {

      // Create a DiscordClient if the type is Discord.
      case ClientType.Discord: {
        client = new DiscordClient(bot, config as BotDiscordClientConfig);
        break;
      }

      // Create a TwitchClient if the type is Discord.
      case ClientType.Twitch: {
        client = new TwitchClient(bot, config as BotTwitchClientConfig);
      }

      // // Create a SlackClient if the type is Discord.
      // Case ClientType.Slack: {
      //   Client = new SlackClient(config, bot);
      //   Break;
      // }

    }

    // Bridge a connection to the application for the client.
    await client.bridge();

    // Run build tasks for client.
    await client.build();

    // Make sure database collection exists for this client for the given bot.
    await Gestalt.createCollection(`/bots/${bot.id}/clients/${client.type}`);

    // Make sure database collection exists for permissions in this client.
    await Gestalt.createCollection(`/bots/${bot.id}/clients/${client.type}`);

    // Initialize i18n database collection for this client if it doesn't already exist.
    await Gestalt.createCollection(`/i18n/${bot.id}/clients/${client.type}`);

    // Return the client.
    return client;
  }

}
