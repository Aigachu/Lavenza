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
        resonance = new DiscordResonance(message.content, message as Message, client.bot, client);
        break;
      }

      // Create a TwitchClient if the type is Discord.
      case ClientType.Twitch: {
        resonance = new TwitchResonance(message.content, message as TwitchMessage, client.bot, client);
      }
    }

    // Run build tasks on the resonance.
    await resonance.build();

    // Return the resonance.
    return resonance;
  }

  /**
   * Set up a prompt to a specified user.
   *
   * Prompts are interactive ways to query information from a user in a seamless conversational way.
   *
   * Commands can issue prompts to expect input from the user in their next messages. For example, is a user uses the
   * '!ping' command, in the code we can use Prompts to prompt the user for information afterwards. The prompt can send
   * a message along the lines of "Pong! How are you?" and act upon the next reply the person that initially called the
   * command writes (Or act upon any future message really).
   *
   * @param client
   *   Client to build the prompt for.
   * @param user
   *   User that is being prompted.
   * @param line
   *   The communication line for this prompt. Basically, where we want the interaction to happen.
   * @param resonance
   *   The Resonance tied to this prompt.
   * @param lifespan
   *   The lifespan of this Prompt.
   *   If the bot doesn't receive an answer in time, we cancel the prompt.
   *   10 seconds is the average time a white boy waits for a reply from a girl he's flirting with after sending her a
   *   message. You want to triple that normally. You're aiming for a slightly more patient white boy. LMAO! Thank you
   *   AVION for this wonderful advice!
   * @param onResponse
   *   The callback function that runs once a response has been heard.
   * @param onError
   *   The callback function that runs once a failure occurs. Failure includes not getting a response.
   *
   * @returns
   *   A prompt that will be active and set to this client's bot.
   */
  public static async buildPrompt(
    client: Client,
    user: unknown,
    line: unknown,
    resonance: Resonance,
    lifespan: number,
    onResponse: (resonance: Resonance, prompt: Prompt) => Promise<void>,
    onError: (error: PromptException) => Promise<void>)
    : Promise<Prompt> {
    // Initialize the object.
    let prompt: Prompt;

    // Depending on the requested type, we build the appropriate client.
    switch (client.type) {

      // Create a DiscordClient if the type is Discord.
      case ClientType.Discord: {
        prompt = new DiscordPrompt(
          user as User,
          line as TextChannel,
          resonance as DiscordResonance,
          lifespan,
          onResponse,
          onError,
          client.bot,
        );
        break;
      }

      // Create a TwitchClient if the type is Discord.
      case ClientType.Twitch: {
        prompt = new TwitchPrompt(
          user as TwitchUser,
          line as TwitchChannel,
          resonance as TwitchResonance,
          lifespan,
          onResponse,
          onError,
          client.bot,
        );
      }

    }

    // Return the prompt.
    return prompt;
  }

}
