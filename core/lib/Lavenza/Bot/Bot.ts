/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as DotEnv from "dotenv";

// Imports.
import { Client } from "../Client/Client";
import { BotClientConfig } from "../Client/ClientConfigurations";
import { ClientFactory } from "../Client/ClientFactory";
import { ClientType } from "../Client/ClientType";
import { Akechi } from "../Confidant/Akechi";
import { Morgana } from "../Confidant/Morgana";
import { Sojiro } from "../Confidant/Sojiro";
import { Prompt } from "../Prompt/Prompt";
import { ServiceContainer } from "../Service/ServiceContainer";
import { TalentCatalogue } from "../Talent/TalentCatalogue";
import { AssociativeObject, Joker } from "../Types";

import {
  BotConfigurations,
} from "./BotConfigurations";
import { BotEnvironmentVariables } from "./BotEnvironmentVariables";


/**
 * Provides a class for Bots.
 *
 * Bots are the fruit of this application. They're the whole point of it. And this is where it all happens!
 *
 * Configuration for bots are managed in a 'config.yml' file found in their folder. From there, functions in here
 * manage the authentication to the bot's clients and what talents the bot has.
 */
export class Bot {

  /**
   * Stores the unique ID of the bot.
   */
  public id: string;

  /**
   * Stores the bot's environment variables.
   */
  public env: BotEnvironmentVariables;

  /**
   * Stores the base configuration of the bot.
   */
  public config: BotConfigurations;

  /**
   * Stores the path to the directory where the files for this bot are stored.
   */
  public directory: string;

  /**
   * Object to store list of Clients the bot has.
   */
  public clients: AssociativeObject<Client> = {};

  /**
   * Array to store a list of all Prompts attached to this bot.
   */
  public prompts: Prompt[] = [];

  /**
   * Object to store data about the bot's master user.
   */
  public joker: Joker = {} as unknown as Joker;

  /**
   * Boolean to determine whether the bot is set to maintenance mode or not.
   */
  public maintenance: boolean = false;

  /**
   * Boolean to determine if the bot is the Master Bot. There can only be one!
   */
  public isMaster: boolean = false;

  /**
   * Boolean to store whether or no the bot is summoned.
   */
  public summoned: boolean = false;

  /**
   * Bot constructor.
   *
   * @param id
   *   ID of the bot. This is the name of the folder, not a reader-friendly name.
   * @param config
   *   Configuration loaded from the bot's 'NAME.config.yml' file.
   * @param directory
   *   Path to the directory where this bot's files are stored.
   */
  public constructor(id: string, config: BotConfigurations, directory: string) {
    this.id = id;
    this.config = config;
    this.directory = directory;
  }

  /**
   * Synthesis handler for a Bot.
   *
   * The BotManager service will run all synthesis handlers for bots during the Synthesis phase.
   *
   * Initializes clients, talents, commands and listeners.
   */
  public async synthesis(): Promise<void> {
    // Load environment variables.
    await this.loadEnvironmentVariables()
      .catch(async () => {
        await Morgana.error(`Could not load environent variables for ${this.id}. Is the .env created for this bot?`);
      });
  }

  /**
   * Summoning handler for this Bot.
   *
   * Authenticates the clients and initializes talents.
   */
  public async summon(): Promise<void> {
    // If the bot is already summoned, we don't want to do anything here.
    if (this.summoned) {
      await Morgana.warn("Tried to summon {{bot}}, but the bot is already summoned!", {bot: this.id});

      return;
    }

    // If the environment variables aren't set, we can't do anything here.
    if (Sojiro.isEmpty(this.env)) {
      await Morgana.error("Tried to summon '{{bot}}', but the bot has no environment variables set!", {bot: this.id});
      await Morgana.error("Make sure a .env file exists for {{bot}}!", {bot: this.id});

      return;
    }

    // Await client initialization.
    await this.initializeClients();

    // Await clients authentication.
    await this.authenticateClients();

    // Await building of architect.
    await this.setJoker();

    // Set the bot's summoned flag to true.
    this.summoned = true;
  }

  /**
   * Shutdown the bot, disconnecting it from all clients.
   */
  public async shutdown(): Promise<void> {
    // If the bot isn't summoned, we can't shut it down.
    if (!this.summoned) {
      await Morgana.warn("Tried to shutdown {{bot}}, but it's already disconnected!", {bot: this.id});

      return;
    }

    // Disconnect the bot from all clients.
    await this.disconnectClients();

    // Set the bot's summoned flag to true.
    this.summoned = false;
  }

  /**
   * Retrieve a specific client from a Bot.
   *
   * @param clientType
   *   The type of client to return from the bot.
   *
   * @returns
   *   The requested client.
   */
  public async getClient(clientType: ClientType): Promise<Client> {
    return this.clients[clientType];
  }

  /**
   * Retrieve configuration for a specific client in a bot.
   *
   * @param clientType
   *   The type of client configuration to return for the bot.
   *
   * @returns
   *   The requested client configuration from the base files.
   */
  public async getClientConfig(clientType: ClientType): Promise<BotClientConfig> {
    // Determine path to client configuration.
    const pathToClientConfig = `${this.directory}/clients/${clientType}.yml`;

    // Attempt to fetch client configuration.
    if (!await Akechi.fileExists(pathToClientConfig)) {
      return undefined;
    }

    // Load configuration since it exists.
    return await Akechi.readYamlFile(pathToClientConfig) as BotClientConfig;
  }

  /**
   * Remove a prompt from the current bot.
   *
   * @param prompt
   *   The prompt to remove from this bot.
   */
  public async removePrompt(prompt: Prompt): Promise<void> {
    this.prompts = Sojiro.removeFromArray(this.prompts, prompt) as Prompt[];
  }

  /**
   * Disconnect all of the clients in this bot.
   */
  public async disconnectClients(): Promise<void> {
    // Await the authentication of the clients linked to the bot.
    for (const key of Object.keys(this.clients)) {
      // Await authentication of the bot.
      await this.disconnectClient(ClientType[key]);
    }
  }

  /**
   * Disconnect from a determined client on this bot.
   *
   * @param clientType
   *   The client ID to disconnect from.
   */
  public async disconnectClient(clientType: ClientType): Promise<void> {
    // Simply call the client's disconnect function.
    const client: Client = await this.getClient(clientType);
    await client.disconnect();
  }

  /**
   * Load the .env file specific to this bot, and parse its contents.
   */
  private async loadEnvironmentVariables(): Promise<void> {
    const envFileData = await Akechi.readFile(`${this.directory}/.env`);
    this.env = DotEnv.parse(envFileData) as unknown as BotEnvironmentVariables;
  }

  /**
   * For each client, we build Joker's identification and data.
   *
   * We should be able to access Joker's information from the bot at all times.
   */
  private async setJoker(): Promise<void> {
    // Await processing of all clients.
    for (const [key, client] of Object.entries(this.clients)) {
      const config = await this.getClientConfig(ClientType[key]);
      this.joker[key] = await client.getUser(config.joker);
    }
  }

  /**
   * Authenticate all of the clients in this bot.
   */
  private async authenticateClients(): Promise<void> {
    // Await the authentication of the clients linked to the bot.
    for (const client of Object.values(this.clients)) {
      // Await authentication of the bot.
      await client.authenticate();
    }
  }

  /**
   * Initialize all clients for this bot.
   *
   * Initialization uses the client configuration to properly create the clients.
   */
  private async initializeClients(): Promise<void> {
    // Await the processing and initialization of all clients in the configurations.
    for (const clientId of this.config.clients) {
      // Load configuration since it exists.
      const clientConfig = await this.getClientConfig(ClientType[clientId]);

      if (Sojiro.isEmpty(clientConfig)) {
        await Morgana.warn(
          "Configuration file could not be loaded for the {{client}} client in {{bot}}. This client will not be instantiated." +
          'To create a configuration file, you can copy the ones found in the "example" bot folder.',
          {
            bot: this.id,
            client: clientId,
          });

        return;
      }

      // Uses the ClientFactory to build the appropriate factory given the type.
      // The client is then set to the bot.
      this.clients[ClientType[clientId]] = await ClientFactory.buildClient(ClientType[clientId], clientConfig, this);
    }
  }

}
