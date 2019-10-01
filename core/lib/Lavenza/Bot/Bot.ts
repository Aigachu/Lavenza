/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as DotEnv from "dotenv";

// Imports.
import { Akechi } from "../Confidant/Akechi";
import { Igor } from "../Confidant/Igor";
import { Morgana } from "../Confidant/Morgana";
import { Sojiro } from "../Confidant/Sojiro";
import { Gestalt } from "../Gestalt/Gestalt";
import { TalentManager } from "../Talent/TalentManager";
import { AbstractObject, AssociativeObject, Joker } from "../Types";

// Imports.
// Holy shit this LIST! LMFAO!
import {
  BotConfigurations,
} from "./BotConfigurations";
import { BotEnvironmentVariables } from "./BotEnvironmentVariables";
import { Client } from "./Client/Client";
import { BotClientConfig } from "./Client/ClientConfigurations";
import { ClientFactory } from "./Client/ClientFactory";
import { ClientType } from "./Client/ClientType";
import { Command } from "./Command/Command";
import { CommandListener } from "./Command/CommandListener/CommandListener";
import { Listener } from "./Listener/Listener";
import { Prompt } from "./Prompt/Prompt";
import { Resonance } from "./Resonance/Resonance";

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
   * Stores a list of all talents associated with a bot, through their ID.
   */
  public talents: string[] = [];

  /**
   * Object to store the list of commands available in the bot.
   */
  public commands: AssociativeObject<Command> = {};

  /**
   * Object to store the list of all command aliases available in this bot.
   */
  public commandAliases: AssociativeObject<string> = {};

  /**
   * Array to store a list of all Listeners attached to this bot.
   */
  public listeners: Listener[] = [];

  /**
   * Array to store a list of all Listeners attached to this bot.
   */
  public prompts: Prompt[] = [];

  /**
   * Object to store data about the bot's master user.
   * @TODO - More specifications and maybe an interface to define it's properties.
   * @TODO - Normalize the properties.
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
   *   id of the bot. This is the name of the folder, not a reader-friendly name.
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
   * The Gestalt function is used to setup database tables for a given object.
   *
   * In this case, these are the database setup tasks for Bots.
   *
   * You can see the result of these calls in the database.
   */
  public async gestalt(): Promise<void> {
    // Initialize the database collection for this bot if it doesn't already exist.
    await Gestalt.createCollection(`/bots/${this.id}`);

    // Initialize the database collection for this bot's configurations if it doesn't already exist.
    await Gestalt.createCollection(`/bots/${this.id}/config`);

    // Sync core bot config to the database.
    await Gestalt.sync(this.config, `/bots/${this.id}/config/core`);

    // Initialize i18n database collection for this bot if it doesn't already exist.
    await Gestalt.createCollection(`/i18n/${this.id}`);

    // Initialize i18n database collection for this bot's clients configurations if it doesn't already exist.
    await Gestalt.createCollection(`/i18n/${this.id}/clients`);

    // Create a database collection for the talents granted to a bot.
    await Gestalt.createCollection(`/bots/${this.id}/talents`);

    // Await the bootstrapping of each talent's data.
    await Promise.all(this.talents.map(async (talentKey) => {
      // Load Talent from the TalentManager.
      const talent = await TalentManager.getTalent(talentKey);

      // Create a database collection for the talents granted to a Bot.
      await Gestalt.createCollection(`/bots/${this.id}/talents/${talent.machineName}`);

      // Await the synchronization of data between the Talent's default configuration and the database configuration.
      await Gestalt.sync(talent.config, `/bots/${this.id}/talents/${talent.machineName}/config`);
    }));

    // Create a database collection for Commands belonging to a Bot.
    await Gestalt.createCollection(`/bots/${this.id}/commands`);

    // Await the bootstrapping of Commands data.
    await Promise.all(
      Object.keys(this.commands)
        .map(async (commandKey) => {
          // Load Command from the Bot.
          const command = await this.getCommand(commandKey);

          // Create a database collection for commands belonging to a Bot.
          await Gestalt.createCollection(`/bots/${this.id}/commands/${command.id}`);

          // Synchronization of data between the Command's default configuration and the database configuration.
          await Gestalt.sync(command.config, `/bots/${this.id}/commands/${command.id}/config`);
        }));

    // Create a database collection for the clients belonging to a Bot.
    await Gestalt.createCollection(`/bots/${this.id}/clients`);
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
   * Preparation handler for the Bot.
   *
   * Initializes clients, talents, commands and listeners.
   */
  public async prepare(): Promise<void> {
    // Load environment variables.
    await this.loadEnvironmentVariables();

    // Talent grants.
    await this.grantTalents();

    // Command inheritance.
    await this.setCommands();

    // Listener initialization & inheritance.
    await this.setListeners();
  }

  /**
   * Get the active configuration from the database for this Bot.
   *
   * @returns
   *   Returns the configuration fetched from the database.
   */
  public async getActiveConfig(): Promise<BotConfigurations> {
    // Attempt to get the active configuration from the database.
    const activeConfig = await Gestalt.get(`/bots/${this.id}/config/core`);
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig as BotConfigurations;
    }

    // Sync it to the database.
    await Gestalt.sync(this.config, `/bots/${this.id}/config/core`);

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
    const activeConfig = await Gestalt.get(`/bots/${this.id}/config/${clientType}`);
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig as BotClientConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    const config = await this.getClientConfig(clientType);

    // Sync it to the database.
    await Gestalt.sync(config, `/bots/${this.id}/config/${clientType}`);

    // Return the configuration.
    return config;
  }

  /**
   * Attempt to get a command from the list of commands in this Bot.
   *
   * @param commandKey
   *   The key of the command to search for.
   *
   * @returns
   *   The command object given the key provided.
   */
  public async getCommand(commandKey: string): Promise<Command> {
    if (!Sojiro.isEmpty(this.commandAliases[commandKey])) {
      return this.commands[this.commandAliases[commandKey]];
    }

    return this.commands[commandKey];
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
    this.env = DotEnv.parse(envFileData) as BotEnvironmentVariables;
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
    // Await the processing of all talents loaded in the bot.
    await Promise.all(this.talents.map(async (talentMachineName) => {
      // We'll fetch the talent.
      const talent = await TalentManager.getTalent(talentMachineName);
      // First we attempt to see if there is intersection going on with the commands.
      // This will happen if there are multiple instances of the same commands (or aliases).
      // The bot will still work, but one command will effectively override the other. Since this information is only
      // Important for developers, we should just throw a warning if this happens.
      const commandsIntersection = Object.keys(this.commands)
        .filter({}.hasOwnProperty.bind(talent.commands));
      const aliasesIntersection = Object.keys(this.commandAliases)
        .filter({}.hasOwnProperty.bind(talent.commandAliases));
      if (!Sojiro.isEmpty(commandsIntersection)) {
        await Morgana.warn("There seems to be duplicate commands in {{bot}}'s code: {{intersect}}. This can cause unwanted overrides. Try to adjust the command keys to fix this. A workaround will be developed in the future.", {
          bot: this.id,
          intersect: JSON.stringify(commandsIntersection),
        });
      }

      if (!Sojiro.isEmpty(aliasesIntersection)) {
        await Morgana.warn("There seems to be duplicate command aliases in {{bot}}'s code: {{intersect}}. This can cause unwanted overrides. Try to adjust the command keys to fix this. A workaround will be developed in the future.", {
          bot: this.id,
          intersect: JSON.stringify(commandsIntersection),
        });
      }

      // Merge the bot's commands with the Talent's commands.
      this.commands = {...this.commands, ...talent.commands};
      this.commandAliases = {...this.commandAliases, ...talent.commandAliases};
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
    // Set the core CommandListener.
    this.listeners.push(new CommandListener());

    // Await the processing of all talents loaded in the bot.
    await Promise.all(this.talents.map(async (talentKey) => {
      // Merge the bot's listeners with the Talent's listeners.
      this.listeners = [...this.listeners, ...TalentManager.talents[talentKey].listeners];
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
    await Promise.all(this.talents.map(async (talentKey) => {
      // Run this talent's initialize function for this bot.
      const talent = await TalentManager.getTalent(talentKey);
      await talent.initialize(this);
    }));
  }

  /**
   * Grants talents to the Bot.
   *
   * There is a collection of Core talents that all bots will have.
   *
   * Custom Talents are configured in the Bot's configuration file. You must enter the ID (directory name) of
   * the talent in the bot's config so that it can be loaded here.
   *
   * It's important to note that Talent Classes are never stored in the bot. Only the IDs are stored.
   *
   * Talents will always be accessed through the TalentManager itself.
   */
  private async grantTalents(): Promise<void> {
    // Check if there are talents set in configuration.
    if (Sojiro.isEmpty(this.config.talents)) {
      await Morgana.warn(
        "Talents configuration missing for {{bot}}. The bot will not have any cool features!",
        {bot: this.id},
        );

      return;
    }

    // Await validation of custom talents configured.
    // This basically checks if the talents entered are valid. Invalid ones are removed from the array.
    await this.validateTalents();

    // After validations are complete, we merge the core talents defined for the bot, with the custom ones.
    // This completes the list of talents assigned to the bot.
    this.talents = this.config.talents;
  }

  /**
   * Validates the list of custom talents configured in the bot's config file.
   *
   * If a talent is in the list, but does not exist, it will be removed from the configuration list.
   */
  private async validateTalents(): Promise<void> {
    // If this is the Master bot, we will grant the Master talent.
    if (this.isMaster && !this.talents.includes("master")) {
      this.config.talents.push("master");
    }

    // Alternatively, we'll do a quick check to see if someone is trying to set the master talent in config.
    // This talent should not be set here, and instead is automatically assigned to the master bot.
    if (this.config.talents.includes("master") && !this.isMaster) {
      this.config.talents = Sojiro.removeFromArray(this.config.talents, "master") as string[];
    }

    // Await the processing of all talents in the bot's config object.
    await Promise.all(this.config.talents.map(async (talentMachineName) => {
      // Then, we'll check if this talent already exists in the Manager.
      // This happens if another bot already loaded it.
      // If it exists, we're good.
      const talent = await TalentManager.getTalent(talentMachineName);
      if (talent) {
        // Validate the dependencies for this talent.
        await this.validateTalentDependencies(talentMachineName);

        return;
      }

      // Await the loading of the talent.
      // If it the load fails, we'll remove the talent from the bot's configuration.
      await TalentManager.loadTalent(talentMachineName)
        .then(async () => {
          // Validate the dependencies for this talent.
          await this.validateTalentDependencies(talentMachineName);
        })
        .catch(async (error) => {
          // Disable this talent for this bot.
          this.config.talents = Sojiro.removeFromArray(this.config.talents, talentMachineName) as string[];

          // Send a warning message to the console.
          await Morgana.warn("Error occurred while loading the {{talent}} talent...", {talent: talentMachineName});
          await Igor.throw(error);
        });
    }));
  }

  /**
   * Validate that the bot has dependencies this talent requires.
   *
   * @param talentMachineName
   *   Machine name of the talent to check dependencies for.
   */
  private async validateTalentDependencies(talentMachineName: string): Promise<void> {
    // Check talent's configuration to see if dependencies are loaded into this bot.
    await Promise.all(TalentManager.talents[talentMachineName].config.dependencies.map(async (dependency) => {
      // If the dependency isn't found in this bot's config, we shouldn't load this talent.
      if (!this.config.talents.includes(dependency)) {
        // Send a warning to the console.
        await Morgana.warn(
          "The '{{talent}}' talent requires the '{{parent}}' talent to exist and to be enabled, but this is not the case. It will not be activated for {{bot}}.",
          {
            bot: this.id,
            parent: dependency,
            talent: talentMachineName,
          });

        // Remove this talent from the bot.
        this.config.talents = Sojiro.removeFromArray(this.config.talents, talentMachineName) as string[];
      }
    }));
  }

}
