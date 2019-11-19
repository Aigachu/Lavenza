/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as tmi from "tmi.js";

// Imports.
import { Bot } from "../../Bot/Bot";
import { Morgana } from "../../Confidant/Morgana";
import { Sojiro } from "../../Confidant/Sojiro";
import { Core } from "../../Core/Core";
import { EventSubscriberManager } from "../../Service/EventSubscriber/EventSubscriberManager";
import { Client } from "../Client";
import { BotClientConfig } from "../ClientConfigurations";
import { ClientType } from "../ClientType";

import { TwitchChannel } from "./Entity/TwitchChannel";
import { TwitchMessage } from "./Entity/TwitchMessage";
import { TwitchUser } from "./Entity/TwitchUser";
import {
  BotTwitchClientConfig, TwitchClientChannelConfigurations,
} from "./TwitchConfigurations";

/**
 * Provides a class for Twitch Clients managed in Lavenza.
 *
 * This class extends tmi.js. Much love to their work and developers!
 *
 * @see https://www.npmjs.com/package/twitch
 */
export class TwitchClient extends Client {

  /**
   * The type of client.
   *
   * @inheritDoc
   */
  public type: ClientType = ClientType.Twitch;

  /**
   * Client configuration for the Bot this client is connected to.
   *
   * @inheritDoc
   */
  public config: BotTwitchClientConfig;

  /**
   * Store the connector that will be use to connect Twitch.
   *
   * @inheritDoc
   */
  public connector: tmi.Client;

  /**
   * @inheritDoc
   */
  public constructor(bot: Bot, config: BotClientConfig) {
    super(bot, config);
  }

  /**
   * Bridge a connection to Twitch.
   *
   * We'll use TMI here!
   *
   * @inheritDoc
   */
  public async bridge(): Promise<void> {
    this.connector = new tmi.Client(
      {
        channels: this.config.channels,
        identity: {
          password: this.bot.env.TWITCH_OAUTH_TOKEN,
          username: this.config.username,
        },
      });
  }

  /**
   * Run build tasks to prepare any necessary functions.
   *
   * Treat this as a proper constructor.
   */
  public async build(): Promise<void> {
    // Event: When the client connects to Twitch and is ready.
    this.connector.on("connected", async () => {
      // Run Event Subscribers for this event.
      await EventSubscriberManager.runEventSubscribers(this, "connected", {});
    });

    // Event: When the twitch client receives a message.
    this.connector.on("message", async (target, context, message, self) => {
      // Ignore messages from this bot.
      if (self) {
        return;
      }

      // Build the author information.
      const author = new TwitchUser(context.username, context.username, context["display-name"]);

      // Build channel information.
      const channel = new TwitchChannel(target, target.replace("#", ""), context["message-type"]);

      // Build the message.
      const msg = new TwitchMessage(message, author, channel, context);

      // Run Event Subscribers for this event.
      await EventSubscriberManager.runEventSubscribers(this, "message", {msg});
    });
  }

  /**
   * Authenticate the client. (Connect to Twitch)
   */
  public async authenticate(): Promise<void> {
    // Simply call TMI's connect function.
    await this.connector.connect();
  }

  /**
   * Disconnect from Twitch.
   */
  public async disconnect(): Promise<void> {
    // Simply call TMI's disconnect function.
    await this.connector.disconnect();
    await Morgana.warn("Twitch client disconnected for {{bot}}.", {bot: this.bot.id});
  }

  /**
   * Bootstrap database folders for Twitch client.
   *
   * @inheritDoc
   */
  public async gestalt(): Promise<void> {
    // We sync the client configurations.
    const channels = await Core.gestalt().sync({}, `/bots/${this.bot.id}/clients/${this.type}/channels`);

    // Generate configuration for each channel.
    await Promise.all(this.config.channels.map(async (channel) => {
      // For all guilds, we initialize this default configuration.
      const baseChannelConfig: TwitchClientChannelConfigurations = {
        commandPrefix: this.bot.config.commandPrefix,
        name: channel,
        userEminences: {},
      };
      if (!(channel in channels)) {
        channels[channel] = baseChannelConfig;
      }
      await Core.gestalt().update(`/bots/${this.bot.id}/clients/${this.type}/channels`, channels);
    }));

    // Initialize i18n contexts, creating them if they don't exist.
    // Translations are manageable through all of these contexts.
    await Core.gestalt().sync({}, `/i18n/${this.bot.id}/clients/${this.type}/channels`);
    await Core.gestalt().sync({}, `/i18n/${this.bot.id}/clients/${this.type}/users`);
  }

  /**
   * Fetch a Twitch user's information.
   *
   * @inheritDoc
   */
  public async getUser(identifier: string): Promise<TwitchUser> {
    return {
      displayName: identifier,
      id: identifier,
      username: identifier,
    } as unknown as TwitchUser;
  }

  /**
   * A little utility function to order the bot to type for a set amount of seconds in a given channel.
   *
   * @param seconds
   *   Amount of seconds to type for.
   * @param channel
   *   The Twitch channel to type in. Not necessary since it doesn't change anything.
   */
  public async typeFor(seconds: number, channel?: TwitchChannel): Promise<void> {
    await Sojiro.wait(seconds);
  }

}
