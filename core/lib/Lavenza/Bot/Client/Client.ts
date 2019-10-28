/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Igor } from "../../Confidant/Igor";
import { Bot } from "../Bot";
import { Command } from "../Command/Command";
import { CommandAuthorizer } from "../Command/CommandAuthorizer/CommandAuthorizer";
import { PromptException } from "../Prompt/Exception/PromptException";
import { Prompt } from "../Prompt/Prompt";
import { Resonance } from "../Resonance/Resonance";

import { BotClientConfig, ClientConfigurations } from "./ClientConfigurations";
import { ClientType } from "./ClientType";
import { ClientUser } from "./ClientUser";

/**
 * Provides a base class for Clients.
 */
export abstract class Client {

  /**
   * Store the Bot this client was initialized for.
   */
  public bot: Bot;

  /**
   * Store the type of client for ease of access.
   */
  public type: ClientType;

  /**
   * Store client configuration.
   */
  public config: BotClientConfig;

  /**
   * Store the adapter that will be use to connect to the application this client is for.
   */
  public abstract connector: unknown;

  /**
   * Client constructor.
   *
   * @param bot
   *   The Bot this client is for.
   * @param config
   *   The configurations for this Client.
   */
  protected constructor(bot: Bot, config: BotClientConfig) {
    this.bot = bot;
    this.config = config;
  }

  /**
   * Listen to a message heard in a client.
   *
   * Now, explanations.
   *
   * This function will be used in clients to send a 'communication' back to the bot. This happens whenever a message
   * is 'heard', meaning that the bot is in a chat room and a message was sent by someone (or another bot).
   *
   * When this function is ran, we fetch the raw content of the message sent, and we build a Resonance object with it.
   * This is a fancy name for an object that stores information about a received communication. Then, we send off the
   * Resonance to the listeners that are on the bot with all the information needed to act upon the message that was
   * heard.
   *
   * Listeners will receive the Resonance, and then they react to them. Perfect example is the CommandListener, that
   * will receive a Resonance and determine whether a command was issued to the Bot. Custom Listeners defined in Talents
   * can do whatever they want when they hear a message!
   *
   * This function will also have logic pertaining to Prompts, but this can be explained elsewhere. :)
   *
   * @param message
   *   Message object from this client, obtained from a message event.
   */
  public async resonate(message: unknown): Promise<void> {
    // Construct a 'Resonance'.
    const resonance = await this.buildResonance(message);

    // Run build tasks on the resonance.
    await resonance.build();

    // Fire all of the bot's prompts, if any.
    await Promise.all(this.bot.prompts.map(async (prompt) => {
      // Fire the listen function.
      await prompt.listen(resonance);
    }));

    // Fire all of the bot's listeners.
    await Promise.all(this.bot.listeners.map(async (listener) => {
      // Fire the listen function.
      await listener.listen(resonance);
    }));
  }

  /**
   * The command authority function. This function will return TRUE if the command is authorized, and FALSE otherwise.
   *
   * Each client will have it's own CommandAuthorizer implementation that will extend the core functionality.
   *
   * @returns
   *   Returns true if the command is authorized. False otherwise.
   */
  public async authorize(command: Command, resonance: Resonance): Promise<boolean> {
    // Build the authorizer.
    const authorizer = await this.buildCommandAuthorizer(command, resonance);
    await authorizer.build();

    // Return the result of the authorizer.
    return authorizer.authorize();
  }

  /**
   * Set up prompts for a client.
   *
   * @inheritDoc
   *   From Resonance class.
   *
   * @see Resonance
   */
  public async prompt(
    user: ClientUser,
    line: unknown,
    resonance: Resonance,
    lifespan: number,
    onResponse: (resonance: Resonance, prompt: Prompt) => Promise<void>,
    onError: (error: PromptException) => Promise<void> = async (e) => {
      console.log(e);
    })
    : Promise<void> {
    // Build the prompt.
    const prompt = await this.buildPrompt(user, line, resonance, lifespan, onResponse, onError);

    // Set the prompt to the bot.
    this.bot.prompts.push(prompt);

    // Await resolution of the prompt.
    await prompt.await()
      .catch(Igor.pocket);
  }

  /**
   * Set up a bridge to the connector.
   *
   * This is needed to define and set the connector property for the client to work.
   *
   * Without this, nothing will work.
   */
  public abstract async bridge(): Promise<void>;

  /**
   * Perform build tasks for a client.
   *
   * This will include setting up the connector and other preparatory tasks.
   */
  public abstract async build(): Promise<void>;

  /**
   * Authenticate to the client application.
   */
  public abstract async authenticate(): Promise<void>;

  /**
   * Disconnect from the client application.
   */
  public abstract async disconnect(): Promise<void>;

  /**
   * The Gestalt function is used to setup database tables for a given object.
   *
   * In this case, these are the database setup tasks for Clients connected to Bots.
   *
   * You can see the result of these calls in the database.
   */
  public abstract async gestalt(): Promise<void>;

  /**
   * Build a Resonance to send to this client's bot.
   *
   * Creates an object that stores information about a message overheard in the client.
   *
   * @param message
   *   The message object obtained from the client.
   *
   * @return
   *   A resonance object containing important information about the message heard.
   */
  public abstract async buildResonance(message: unknown): Promise<Resonance>;

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
  public abstract async buildPrompt(
    user: unknown,
    line: unknown,
    resonance: Resonance,
    lifespan: number,
    onResponse: (resonance: Resonance, prompt: Prompt) => Promise<void>,
    onError: (error: PromptException) => Promise<void>)
    : Promise<Prompt>;

  /**
   * Build the command authorizer for this client.
   *
   * @param command
   *   The command that is being requested.
   * @param resonance
   *   The resonance that was used to invoke the command.
   *
   * @returns
   *   A command authorizer to be used to check if the command can be used.
   */
  public abstract async buildCommandAuthorizer(command: Command, resonance: Resonance): Promise<CommandAuthorizer>;

  /**
   * Provides help text for the current command.
   * @param command
   *   Command to fire help text for.
   * @param resonance
   *   Resonance that invoked this command. All information about the client and message are here.
   */
  public abstract help(command: Command, resonance: Resonance): Promise<void>;

  /**
   * Get a user object from the client's database.
   *
   * @param identifier
   *   The unique identifier of the user to obtain.
   */
  public abstract async getUser(identifier: string): Promise<ClientUser>;

  /**
   * Get configurations specific to the actual client.
   */
  public abstract async getActiveConfigurations(): Promise<ClientConfigurations>;

  /**
   * Get command prefix configured for a client for a certain resonance, if any.
   *
   * @param resonance
   *   The resonance describing the context where a message was sent.
   */
  public abstract async getCommandPrefix(resonance: Resonance): Promise<string>;

  /**
   * Type for a specified amount of seconds in a given channel.
   *
   * @param seconds
   *   Number of seconds to type for.
   * @param channel
   *   Channel to type in.
   */
  public abstract async typeFor(seconds: number, channel: unknown): Promise<void>;

}
