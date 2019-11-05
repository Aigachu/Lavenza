/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as tmi from "tmi.js";

// Imports.
import { Igor } from "../../../Confidant/Igor";
import { Morgana } from "../../../Confidant/Morgana";
import { Sojiro } from "../../../Confidant/Sojiro";
import { Gestalt } from "../../../Service/Gestalt/Gestalt";
import { Bot } from "../../Bot";
import { Command } from "../../../../../talents/commander/src/Command/Command";
import { PromptException } from "../../Prompt/Exception/PromptException";
import { Client } from "../Client";
import { BotClientConfig } from "../ClientConfigurations";
import { ClientType } from "../ClientType";

import { TwitchChannel } from "./Entity/TwitchChannel";
import { TwitchMessage } from "./Entity/TwitchMessage";
import { TwitchUser } from "./Entity/TwitchUser";
import { TwitchCommandAuthorizer } from "./TwitchCommandAuthorizer";
import {
  BotTwitchClientConfig,
  TwitchClientChannelConfigurations,
  TwitchClientConfigurations,
} from "./TwitchConfigurations";
import { TwitchPrompt } from "./TwitchPrompt";
import { TwitchResonance } from "./TwitchResonance";

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
      // Send a message confirming our connection to Twitch.
      await Morgana.success("Twitch client successfully connected for {{bot}}!", {bot: this.bot.id});

      // We sync the client configurations.
      const channels = await Gestalt.sync({}, `/bots/${this.bot.id}/clients/${this.type}/channels`);

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
        await Gestalt.update(`/bots/${this.bot.id}/clients/${this.type}/channels`, channels);
      }));
    });

    // Event: When the twitch client receives a message.
    this.connector.on("message", (target, context, message, self) => {
      // Ignore messages from this bot.
      if (self) {
        return;
      }

      // Build the author information.
      const author = new TwitchUser(context.username, context.username, context["display-name"]);

      // Build channel information.
      const channel = new TwitchChannel(target, target.replace("#", ""), context["message-type"]);

      // Have bot listen to this.
      this.resonate(new TwitchMessage(message, author, channel, context))
        .catch(Igor.stop);
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
    // Initialize i18n contexts, creating them if they don't exist.
    // Translations are manageable through all of these contexts.
    await Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/channels`);
    await Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/users`);
  }

  /**
   * Send help dialog through Twitch.
   *
   * @TODO - A couple of ideas here.
   *    1. Having help text be determine per command, and having the default behavior being the current behaviour.
   *    2. Making it possible to customize help text per command at will.
   *    3. Linking to online documentation whenever needed (Since Twitch and surely other clients can't format text...)
   *
   * @inheritDoc
   */
  public async help(command: Command, resonance: TwitchResonance): Promise<void> {
    await resonance.send(resonance.author, "Sadly, command help text is currently not available for Twitch.");
  }

  /**
   * Twitch client's resonance builder.
   *
   * @inheritDoc
   */
  public async buildResonance(message: TwitchMessage): Promise<TwitchResonance> {
    return new TwitchResonance(message.content, message, this.bot, this);
  }

  /**
   * Twitch's prompt builder.
   *
   * @inheritDoc
   */
  public async buildPrompt(
    user: TwitchUser,
    line: TwitchChannel,
    resonance: TwitchResonance,
    lifespan: number,
    onResponse: (resonance: TwitchResonance, prompt: TwitchPrompt) => Promise<void>,
    onError: (error: PromptException) => Promise<void>)
    : Promise<TwitchPrompt> {
    return new TwitchPrompt(
      user,
      line,
      resonance,
      lifespan,
      onResponse,
      onError,
      this.bot,
    );
  }

  /**
   * Twitch's Command Authorizer builder.
   *
   * @inheritDoc
   */
  public async buildCommandAuthorizer(
    command: Command,
    resonance: TwitchResonance,
  ): Promise<TwitchCommandAuthorizer> {
    return new TwitchCommandAuthorizer(command, resonance);
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
   * Get active Twitch configurations for this bot.
   *
   * @inheritDoc
   */
  public async getActiveConfigurations(): Promise<TwitchClientConfigurations> {
    return await Gestalt.get(`/bots/${this.bot.id}/clients/${this.type}`) as TwitchClientConfigurations;
  }

  /**
   * Get command prefix, taking into consideration that Twitch context.
   *
   * A custom command prefix can be set per channel.
   *
   * @inheritDoc
   */
  public async getCommandPrefix(resonance: TwitchResonance): Promise<string> {
    // Get client specific configurations.
    const clientConfig = await this.getActiveConfigurations();
    if (resonance.message.channel && clientConfig.channels[resonance.message.channel.id]) {
      return clientConfig.channels[resonance.message.channel.id].commandPrefix || undefined;
    }
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
