/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Includes
import { Message, TextChannel, User } from "discord.js";

import { Bot } from "../Bot/Bot";
import { PromptException } from "../Prompt/Exception/PromptException";
import { Prompt } from "../Prompt/Prompt";
import { PromptInfo } from "../Prompt/PromptInfo";
import { Resonance } from "../Resonance/Resonance";

import { Client } from "./Client";
import { BotClientConfig } from "./ClientConfigurations";
import { ClientMessage } from "./ClientMessage";
import { ClientType } from "./ClientType";
import { DiscordClient } from "./Discord/DiscordClient";
import { BotDiscordClientConfig } from "./Discord/DiscordConfigurations";
import { DiscordPrompt } from "./Discord/DiscordPrompt";
import { DiscordResonance } from "./Discord/DiscordResonance";
import { TwitchChannel } from "./Twitch/Entity/TwitchChannel";
import { TwitchMessage } from "./Twitch/Entity/TwitchMessage";
import { TwitchUser } from "./Twitch/Entity/TwitchUser";
import { TwitchClient } from "./Twitch/TwitchClient";
import { BotTwitchClientConfig } from "./Twitch/TwitchConfigurations";
import { TwitchPrompt } from "./Twitch/TwitchPrompt";
import { TwitchResonance } from "./Twitch/TwitchResonance";

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
  public static async buildClient(type: ClientType, config: BotClientConfig, bot: Bot): Promise<Client> {
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

    }

    // Bridge a connection to the application for the client.
    await client.bridge();

    // Run build tasks for client.
    await client.build();

    // Return the client.
    return client;
  }

  /**
   * Build a Resonance to send to this client's bot.
   *
   * Creates an object that stores information about a message overheard in the client.
   *
   * @param client
   *   Client to build the resonance for.
   * @param message
   *   The message object obtained from the client.
   *
   * @return
   *   A resonance object containing important information about the message heard.
   */
  public static async buildResonance(client: Client, message: ClientMessage): Promise<Resonance> {
    // Initialize the object.
    let resonance: Resonance;

    // Depending on the requested type, we build the appropriate client.
    switch (client.type) {

      // Create a DiscordClient if the type is Discord.
      case ClientType.Discord: {
        resonance = new DiscordResonance(message.content, message as Message, client.bot, client as DiscordClient);
        break;
      }

      // Create a TwitchClient if the type is Discord.
      case ClientType.Twitch: {
        resonance = new TwitchResonance(message.content, message as TwitchMessage, client.bot, client as TwitchClient);
      }
    }

    // Run build tasks on the resonance.
    await resonance.build();

    // Return the resonance.
    return resonance;
  }

  /**
   * Build and return a Prompt Object specific to a client.
   *
   * @param promptInfo
   *   Info used to build the prompt object.
   *
   * @returns
   *   A prompt that will be active and set to this client's bot.
   */
  public static async buildPrompt(promptInfo: PromptInfo): Promise<Prompt> {
    // Initialize the object.
    let prompt: Prompt;

    // Depending on the requested type, we build the appropriate client.
    switch (promptInfo.clientType) {

      // Create a DiscordClient if the type is Discord.
      case ClientType.Discord: {
        prompt = new DiscordPrompt(promptInfo);
        break;
      }

      // Create a TwitchClient if the type is Discord.
      case ClientType.Twitch: {
        prompt = new TwitchPrompt(promptInfo);
      }

    }

    // Return the prompt.
    return prompt;
  }

}
