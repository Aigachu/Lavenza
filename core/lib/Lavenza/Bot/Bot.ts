/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as DotEnv from "dotenv";

import { Command } from "../../../talents/commander/src/Command/Command";
import { Akechi } from "../Confidant/Akechi";
import { Morgana } from "../Confidant/Morgana";
import { Sojiro } from "../Confidant/Sojiro";
import { Core } from "../Core/Core";
import { AssociativeObject, Joker } from "../Types";

import {
  BotConfigurations,
} from "./BotConfigurations";
import { BotEnvironmentVariables } from "./BotEnvironmentVariables";
import { Client } from "./Client/Client";
import { BotClientConfig } from "./Client/ClientConfigurations";
import { ClientFactory } from "./Client/ClientFactory";
import { ClientType } from "./Client/ClientType";
import { Prompt } from "./Prompt/Prompt";
import { Resonance } from "./Resonance/Resonance";

// Imports.
// Holy shit this LIST! LMFAO!import { Akechi } from "../Confidant/Akechi";

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
   * Array to store a list of all Listeners attached to this bot.
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
   * Preparation handler for the Bot.
   *
   * Initializes clients, talents, commands and listeners.
   */
  public async build(): Promise<void> {
    // Load environment variables.
    await this.loadEnvironmentVariables()
      .catch(async () => {
        await Morgana.error(`Could not load environent variables for ${this.id}. Is the .env created for this bot?`);
      });
  }

  /**
   * Deployment handler for this Bot.
   *
   * Authenticates the clients and initializes talents.
   */
  public async deploy(): Promise<void> {
    // If the bot is already summoned, we don't want to do anything here.
    if (this.summoned) {
      await Morgana.warn("Tried to deploy {{bot}}, but the bot is already summoned!", {bot: this.id});

      return;
    }

    // If the environment variables aren't set, we can't do anything here.
    if (Sojiro.isEmpty(this.env)) {
      await Morgana.error("Tried to deploy {{bot}}, but the bot has no environment variables set!", {bot: this.id});
      await Morgana.error("Make sure a .env file exists for {{bot}}!", {bot: this.id});

      return;
    }

    // Await client initialization.
    await this.initializeClients();

    // Await clients authentication.
    await this.authenticateClients();

    // Await building of architect.
    await this.setJoker();

    // Await talent initializations for this bot.
    // We do this AFTER authenticating clients. Some talents might need client info to perform their initializations.
    await this.initializeTalentsForBot();

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
   * Get the active configuration from the database for this Bot.
   *
   * @returns
   *   Returns the configuration fetched from the database.
   */
  public async getActiveConfig(): Promise<BotConfigurations> {
    // Attempt to get the active configuration from the database.
    const activeConfig = await Core.gestalt().get(`/bots/${this.id}/config/core`);
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig as BotConfigurations;
    }

    // Sync it to the database.
    await Core.gestalt().sync(this.config, `/bots/${this.id}/config/core`);

    // Return the configuration.
    return this.config;
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
    const pathToClientConfig = `${this.directory}/${clientType}.yml`;

    // Attempt to fetch client configuration.
    if (!await Akechi.fileExists(pathToClientConfig)) {
      return undefined;
    }

    // Load configuration since it exists.
    return await Akechi.readYamlFile(pathToClientConfig) as BotClientConfig;
  }

  /**
   * Retrieve active client configuration for this bot.
   *
   * @param clientType
   *   The type of client configuration to return for the bot.
   *
   * @returns
   *   The requested client configuration straight from the database.
   */
  public async getActiveClientConfig(clientType: ClientType): Promise<BotClientConfig> {
    // Attempt to get the active configuration from the database.
    const activeConfig = await Core.gestalt().get(`/bots/${this.id}/config/${clientType}`);
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig as BotClientConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    const config = await this.getClientConfig(clientType);

    // Sync it to the database.
    await Core.gestalt().sync(config, `/bots/${this.id}/config/${clientType}`);

    // Return the configuration.
    return config;
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
    await Promise.all(
      Object.keys(this.clients)
        .map(async (clientType: ClientType) => {
          // Await authentication of the bot.
          await this.disconnectClient(clientType);
        }));
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
   * Get the command prefix, after a couple of checks.
   *
   * @param resonance
   *   The Resonance we're taking a look at.
   *
   * @returns
   *   Returns the command prefix we need to check for.
   */
  public async getCommandPrefix(resonance: Resonance): Promise<string> {
    // Get the configuration.
    const botConfig = await this.getActiveConfig();

    // Get bot's client configuration.
    const botClientConfig = await this.getClientConfig(resonance.client.type);

    // Variable to store retrieved command prefix.
    // Using the client, fetch appropriate command prefix configured in a client.
    let commandprefix = await resonance.client.getCommandPrefix(resonance) || undefined;

    // Reset it to undefined if it's empty.
    if (Sojiro.isEmpty(commandprefix)) {
      commandprefix = undefined;
    }

    // By default, return the following.
    return commandprefix || botClientConfig.commandPrefix || botConfig.commandPrefix;
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
    // @TODO - Factory Design Pattern for these.
    await Promise.all(
      Object.keys(this.clients)
        .map(async (clientKey: ClientType) => {
          const config = await this.getActiveClientConfig(ClientType.Discord);
          const client = await this.getClient(clientKey);
          this.joker[clientKey] = await client.getUser(config.joker);
        }));
  }

  /**
   * Set all necessary commands to the Bot.
   *
   * Bots inherit their commands from Talents. Here we set all commands that are already loading into talents, into
   * the bots.
   *
   * By the time this function runs, the Bot should already have all of its necessary talents granted.
   */
  private async setCommands(): Promise<void> {
    // Load any commands that may be found in the bot's folder.
    this.enabledCommands = await Core.commandManager().loadCommandsFromDirectory(`${this.directory}/commands`);

    // Await the processing of all talents loaded in the bot.
    await Promise.all(this.talents.map(async (talent) => {
      // First we attempt to see if there is intersection going on with the commands.
      // This will happen if there are multiple instances of the same commands (or aliases).
      // The bot will still work, but one command will effectively override the other. Since this information is only
      // Important for developers, we should just throw a warning if this happens.
      const commandsIntersection = this.commands.filter((command) => {
        // Check if command is found in the talent.
        if (talent.commands.includes(command)) {
          return true;
        }
        // Check if this command has aliases that are defined anywhere in this talent.
        // for (const alias of Core.commandManager().find((cmd: Command) => cmd.id === command.id).aliases) {
        //   if ()
        // }
      });

      if (!Sojiro.isEmpty(commandsIntersection)) {
        await Morgana.warn("There seems to be duplicate commands in {{bot}}'s code: {{intersect}}. This can cause unwanted overrides. Try to adjust the command keys to fix this. A workaround will be developed in the future.", {
          bot: this.id,
          intersect: JSON.stringify(commandsIntersection),
        });
      }

      // Merge the bot's commands with the Talent's commands.
      this.enabledCommands = [...this.enabledCommands, ...talent.nestedCommands];
    }));
  }

  /**
   * Set all necessary listeners to the Bot.
   *
   * Bots inherit listeners from Talents. Here we set all commands that are already loading into talents, into
   * the bots.
   *
   * By the time this function runs, the Bot should already have all of its necessary talents granted.
   */
  private async setListeners(): Promise<void> {
    // Load any listeners that may be found in the bot's folder.
    this.listeners = await ListenerCatalogue.loadListenersFromDirectory(`${this.directory}/listeners`);

    // Await the processing of all talents loaded in the bot.
    await Promise.all(this.talents.map(async (talent) => {
      // Merge the bot's listeners with the Talent's listeners.
      this.listeners = [...this.listeners, ...talent.listeners];
    }));
  }

  /**
   * Authenticate all of the clients in this bot.
   */
  private async authenticateClients(): Promise<void> {
    // Await the authentication of the clients linked to the bot.
    await Promise.all(
      Object.keys(this.clients)
        .map(async (clientType: ClientType) => {
          // Await authentication of the bot.
          const client = await this.getClient(clientType);
          await client.authenticate();

          // Run appropriate Gestalt handlers in the clients.
          await client.gestalt();
        }));
  }

  /**
   * Initialize all clients for this bot.
   *
   * Initialization uses the client configuration to properly create the clients.
   */
  private async initializeClients(): Promise<void> {
    // Await the processing and initialization of all clients in the configurations.
    await Promise.all(this.config.clients.map(async (clientTypeKey: string) => {
      // Load configuration since it exists.
      const clientConfig = await this.getActiveClientConfig(ClientType[clientTypeKey]);

      if (Sojiro.isEmpty(clientConfig)) {
        await Morgana.warn(
          "Configuration file could not be loaded for the {{client}} client in {{bot}}. This client will not be instantiated." +
          'To create a configuration file, you can copy the ones found in the "example" bot folder.',
          {
            bot: this.id,
            client: clientTypeKey,
          });

        return;
      }

      // Uses the ClientFactory to build the appropriate factory given the type.
      // The client is then set to the bot.
      this.clients[ClientType[clientTypeKey]] = await ClientFactory.build(
        ClientType[clientTypeKey],
        clientConfig,
        this,
      );
    }));
  }

  /**
   * Runs each Talent's initialize() function to run any preparations for the given bot.
   */
  private async initializeTalentsForBot(): Promise<void> {
    // Await the processing of all of this bot's talents.
    await Promise.all(this.talents.map(async (talent) => {
      // Run this talent's initialize function for this bot.
      await talent.initialize(this);
    }));
  }

}
