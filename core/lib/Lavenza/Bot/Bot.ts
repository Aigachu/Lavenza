/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as DotEnv from 'dotenv';

// Imports.
// Holy shit this LIST! LMFAO!
import TalentManager from '../Talent/TalentManager';
import Gestalt from '../Gestalt/Gestalt';
import Akechi from '../Confidant/Akechi';
import Morgana from '../Confidant/Morgana';
import Sojiro from '../Confidant/Sojiro';
import Igor from '../Confidant/Igor';
import ClientFactory from './Client/ClientFactory';
import ResonanceFactory from './Resonance/ResonanceFactory';
import CommandListener from './Command/CommandListener/CommandListener';
import ClientType from './Client/ClientType';
import Listener from "./Listener/Listener";
import Prompt from "./Prompt/Prompt";
import PromptFactory from './Prompt/PromptFactory';
import ClientInterface from "./Client/ClientInterface";
import Command from "./Command/Command";
import Resonance from "./Resonance/Resonance";
import {BotClientConfig, BotConfigurations, BotDiscordClientConfig, BotTwitchClientConfig} from "./BotConfigurations";
import {AssociativeObject} from "../Types";
import DiscordClient from "./Client/DiscordClient/DiscordClient";
import {DiscordClientConfigurations, TwitchClientConfigurations} from "./Client/ClientConfigurations";
import BotEnvironmentVariables from "./BotEnvironmentVariables";
import TwitchUser from "./Client/TwitchClient/TwitchUser";

/**
 * Provides a class for Bots.
 *
 * Bots are the fruit of this application. They're the whole point of it. And this is where it all happens!
 *
 * Configuration for bots are managed in a 'config.yml' file found in their folder. From there, functions in here
 * manage the authentication to the bot's clients and what talents the bot has.
 */
export default class Bot {

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
  public clients: AssociativeObject<ClientInterface> = {};

  /**
   * Stores a list of all talents associated with a bot, through their ID.
   */
  public talents: Array<string> = [];

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
  public listeners: Array<Listener> = [];

  /**
   * Array to store a list of all Listeners attached to this bot.
   */
  public prompts: Array<Prompt> = [];

  /**
   * Object to store data about the bot's master user.
   * @TODO - More specifications and maybe an interface to define it's properties.
   * @TODO - Normalize the properties.
   */
  public joker: any = {};

  /**
   * Boolean to determine whether the bot is set to maintenance mode or not.
   */
  public maintenance: boolean = false;

  /**
   * Boolean to determine if the bot is the Master Bot. There can only be one!
   */
  public isMaster: boolean = false;

  /**
   * Bot constructor.
   *
   * @param id
   *   id of the bot. This is the name of the folder, not a reader-friendly name.
   * @param config
   *   Configuration loaded from the bot's 'NAME.config.yml' file.
   */
  constructor(id: string, config: BotConfigurations) {
    this.id = id;
    this.config = config;
    this.directory = config.directory;
    this.maintenance = false;
    this.isMaster = false;
  }

  /**
   * Load the .env file specific to this bot, and parse its contents.
   */
  async loadEnvironmentVariables() {
    let envFileData = await Akechi.readFile(`${this.directory}/.env`);
    this.env = DotEnv.parse(envFileData) as BotEnvironmentVariables;
  }

  /**
   * The Gestalt function is used to setup database tables for a given object.
   *
   * In this case, these are the database setup tasks for Bots.
   *
   * You can see the result of these calls in the database.
   */
  async gestalt() {
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
    await Promise.all(this.talents.map(async talentKey => {
      // Load Talent from the TalentManager.
      let talent = await TalentManager.getTalent(talentKey);

      // Create a database collection for the talents granted to a Bot.
      await Gestalt.createCollection(`/bots/${this.id}/talents/${talent.machineName}`);

      // Await the synchronization of data between the Talent's default configuration and the database configuration.
      await Gestalt.sync(talent.config, `/bots/${this.id}/talents/${talent.machineName}/config`);
    }));

    // Create a database collection for Commands belonging to a Bot.
    await Gestalt.createCollection(`/bots/${this.id}/commands`);

    // Await the bootstrapping of Commands data.
    await Promise.all(Object.keys(this.commands).map(async commandKey => {
      // Load Command from the Bot.
      let command = await this.getCommand(commandKey);

      // Create a database collection for commands belonging to a Bot.
      await Gestalt.createCollection(`/bots/${this.id}/commands/${command.key}`);

      // Await the synchronization of data between the Command's default configuration and the database configuration.
      await Gestalt.sync(command.config, `/bots/${this.id}/commands/${command.key}/config`);
    }));

    // Create a database collection for the clients belonging to a Bot.
    await Gestalt.createCollection(`/bots/${this.id}/clients`);
  }

  /**
   * Deployment handler for this Bot.
   *
   * Authenticates the clients and initializes talents.
   */
  async deploy() {
    // Await client initialization.
    await this.initializeClients();

    // Await clients authentication.
    await this.authenticateClients();

    // Await building of architect.
    await this.setJoker();

    // Await talent initializations for this bot.
    // We do this AFTER authenticating clients. Some talents might need client info to perform their initializations.
    await this.initializeTalentsForBot();
  }

  /**
   * Shutdown the bot, disconnecting it from all clients.
   */
  async shutdown() {
    // Disconnect the bot from all clients.
    await this.disconnectClients();
  }

  /**
   * Preparation handler for the Bot.
   *
   * Initializes clients, talents, commands and listeners.
   */
  async prepare() {
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
   * For each client, we build Joker's identification and data.
   *
   * We should be able to access Joker's information from the bot at all times.
   */
  async setJoker() {
    // Await processing of all clients.
    // @TODO - Factory Design Pattern for these.
    await Promise.all(Object.keys(this.clients).map(async (clientKey: ClientType) => {
      // Depending on the type of client, we act accordingly.
      switch (clientKey) {
        // In Discord, we fetch the architect's user using the ID.
        case ClientType.Discord: {
          let config = await this.getActiveClientConfig(ClientType.Discord) as BotDiscordClientConfig;
          let client = await this.getClient(clientKey) as DiscordClient;
          this.joker.discord = await client.fetchUser(config.joker);
          break;
        }

        // In Twitch, we build a custom object using only the username.
        // @TODO - Build a TwitchUser object using the client.
        case ClientType.Twitch: {
          let config = await this.getActiveClientConfig(ClientType.Twitch) as BotTwitchClientConfig;
          this.joker.twitch = new TwitchUser(config.joker, config.joker, config.joker);
          break;
        }
      }
    }));
  }

  /**
   * Get the active configuration from the database for this Bot.
   *
   * @returns
   *   Returns the configuration fetched from the database.
   */
  async getActiveConfig(): Promise<BotConfigurations> {
    // Attempt to get the active configuration from the database.
    let activeConfig = await Gestalt.get(`/bots/${this.id}/config/core`);
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig;
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
  async getClient(clientType: ClientType): Promise<ClientInterface> {
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
  async getClientConfig(clientType: ClientType): Promise<BotClientConfig> {
    // Determine path to client configuration.
    let pathToClientConfig = `${this.directory}/${clientType}.yml`;

    // Attempt to fetch client configuration.
    if (!await Akechi.fileExists(pathToClientConfig)) {
      return undefined;
    }

    // Load configuration since it exists.
    return await Akechi.readYamlFile(pathToClientConfig);
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
  async getActiveClientConfig(clientType: ClientType): Promise<BotClientConfig> {
    // Attempt to get the active configuration from the database.
    let activeConfig = await Gestalt.get(`/bots/${this.id}/config/${clientType}`);
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    let config = await this.getClientConfig(clientType);

    // Sync it to the database.
    await Gestalt.sync(config, `/bots/${this.id}/config/${clientType}`);

    // Return the configuration.
    return config;
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
  async grantTalents() {
    // Check if there are talents set in configuration.
    if (Sojiro.isEmpty(this.config.talents)) {
      await Morgana.warn('Talents configuration missing for {{bot}}. The bot will not have any features!', {bot: this.id});
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
  async validateTalents() {
    // If this is the Master bot, we will grant the Master talent.
    if (this.isMaster && Sojiro.isEmpty(this.talents['master'])) {
      this.config.talents.push('master');
    }

    // Alternatively, we'll do a quick check to see if someone is trying to set the master talent in config.
    // This talent should not be set here, and instead is automatically assigned to the master bot.
    if (!Sojiro.isEmpty(this.config.talents['master']) && !this.isMaster) {
      this.config.talents = Sojiro.removeFromArray(this.config.talents, 'master');
    }

    // Await the processing of all talents in the bot's config object.
    await Promise.all(this.config.talents.map(async (talentMachineName) => {
      // Then, we'll check if this talent already exists in the Manager.
      // This happens if another bot already loaded it.
      // If it exists, we're good.
      let talent = await TalentManager.getTalent(talentMachineName);
      if (talent) {
        // Validate the dependencies for this talent.
        await this.validateTalentDependencies(talentMachineName);
        return;
      }

      // Await the loading of the talent.
      // If it the load fails, we'll remove the talent from the bot's configuration.
      await TalentManager.loadTalent(talentMachineName).then(async () => {
        // Validate the dependencies for this talent.
        await this.validateTalentDependencies(talentMachineName);
      }).catch(async error => {
        // Disable this talent for this bot.
        this.config.talents = Sojiro.removeFromArray(this.config.talents, talentMachineName);

        // Send a warning message to the console.
        await Morgana.warn('Error occurred while loading the {{talent}} talent...', {talent: talentMachineName});
        await Morgana.warn(error.message);
      });
    }));
  }

  /**
   * Validate that the bot has dependencies this talent requires.
   *
   * @param talentMachineName
   *   Machine name of the talent to check dependencies for.
   */
  async validateTalentDependencies(talentMachineName: string) {
    // Check talent's configuration to see if dependencies are loaded into this bot.
    await Promise.all(TalentManager.talents[talentMachineName].config.dependencies.map(async (dependency) => {
      // If the dependency isn't found in this bot's config, we shouldn't load this talent.
      if (!this.config.talents.includes(dependency)) {
        // Send a warning to the console.
        await Morgana.warn(`The '{{talent}}' talent requires the '{{parent}}' talent to exist and to be enabled, but this is not the case. It will not be activated for {{bot}}.`, {
          talent: talentMachineName,
          parent: dependency,
          bot: this.id
        });

        // Remove this talent from the bot.
        this.config.talents = Sojiro.removeFromArray(this.config.talents, talentMachineName);
      }
    }));
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
  async getCommand(commandKey: string): Promise<Command> {
    if (!Sojiro.isEmpty(this.commandAliases[commandKey])) {
      return this.commands[this.commandAliases[commandKey]];
    }
    return this.commands[commandKey];
  }

  /**
   * Set all necessary commands to the Bot.
   *
   * Bots inherit their commands from Talents. Here we set all commands that are already loading into talents, into
   * the bots.
   *
   * By the time this function runs, the Bot should already have all of its necessary talents granted.
   */
  async setCommands() {
    // Await the processing of all talents loaded in the bot.
    await Promise.all(this.talents.map(async talentMachineName => {
      // We'll fetch the talent.
      let talent = await TalentManager.getTalent(talentMachineName);
      // First we attempt to see if there is intersection going on with the commands.
      // This will happen if there are multiple instances of the same commands (or aliases).
      // The bot will still work, but one command will effectively override the other. Since this information is only
      // important for developers, we should just throw a warning if this happens.
      let commandsIntersection = Object.keys(this.commands).filter({}.hasOwnProperty.bind(talent.commands));
      let aliasesIntersection = Object.keys(this.commandAliases).filter({}.hasOwnProperty.bind(talent.commandAliases));
      if (!Sojiro.isEmpty(commandsIntersection)) {
        await Morgana.warn(`There seems to be duplicate commands in {{bot}}'s code: {{intersect}}. This can cause unwanted overrides. Try to adjust the command keys to fix this. A workaround will be developed in the future.`, {
          bot: this.id,
          intersect: JSON.stringify(commandsIntersection)
        });
      }

      if (!Sojiro.isEmpty(aliasesIntersection)) {
        await Morgana.warn(`There seems to be duplicate command aliases in {{bot}}'s code: {{intersect}}. This can cause unwanted overrides. Try to adjust the command keys to fix this. A workaround will be developed in the future.`, {
          bot: this.id,
          intersect: JSON.stringify(commandsIntersection)
        });
      }

      // Merge the bot's commands with the Talent's commands.
      this.commands = Object.assign({}, this.commands, talent.commands);
      this.commandAliases = Object.assign({}, this.commandAliases, talent.commandAliases);
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
  async setListeners() {
    // Set the core CommandListener.
    this.listeners.push(new CommandListener());

    // Await the processing of all talents loaded in the bot.
    await Promise.all(this.talents.map(async talentKey => {
      // Merge the bot's listeners with the Talent's listeners.
      this.listeners = [...this.listeners, ...TalentManager.talents[talentKey].listeners]
    }));
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
   * @see ./Listener/Listener
   * @see ./Resonance/Resonance
   *
   * @param message
   *   Message object heard from a client.
   * @param client
   *   Client where the Message Object was heard from.
   */
  async listen(message: any, client: ClientInterface) {
    // First we decipher the message we just obtained.
    let content = await Bot.decipher(message, client);

    // Construct a 'Resonance'.
    let resonance = await ResonanceFactory.build(content, message, this, client);

    // Fire all of the bot's prompts, if any.
    await Promise.all(this.prompts.map(async prompt => {
      // Fire the listen function.
      await prompt.listen(resonance);
    }));

    // Fire all of the bot's listeners.
    await Promise.all(this.listeners.map(async listener => {
      // Fire the listen function.
      await listener.listen(resonance);
    }));
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
   */
  async prompt(user: any, line: any, resonance: Resonance, lifespan: number, onResponse: Function, onError: Function = (e) => { console.log(e) }) {
    // Create the new prompt using the factory.
    let prompt: Prompt = await PromptFactory.build(user, line, resonance, lifespan, onResponse, onError, this);

    // Set the prompt to the bot.
    this.prompts.push(prompt);

    // Await resolution of the prompt.
    await prompt.await().catch(Igor.pocket);
  }

  /**
   * Remove a prompt from the current bot.
   *
   * @param prompt
   *   The prompt to remove from this bot.
   */
  async removePrompt(prompt: Prompt) {
    this.prompts = Sojiro.removeFromArray(this.prompts, prompt);
  }

  /**
   * Decipher a message and obtain the raw content.
   *
   * Each client will send a message differently. i.e. Discord.JS sends a specific Message Object, whereas Twitch might
   * send back a string. This function interprets these respectively and sends back the raw content.
   *
   * @param message
   *   Message object sent by the client.
   * @param client
   *   The client that sent the message.
   *
   * @returns
   *   Given the client type, return the raw content of the message heard.
   */
  static async decipher(message: any, client: ClientInterface): Promise<string> {
    // Depending on the Client Type, decipher the message accordingly.
    switch (client.type) {
      // In the case of Discord, we get the 'content' property of the message object.
      case ClientType.Discord: {
        return message.content;
      }

      // In the case of Discord, we get the 'content' property of the message object.
      // For Twitch, the Message object is custom built.
      case ClientType.Twitch: {
        return message.content;
      }

      // case ClientTypes.Slack:
      //   return message;
    }
  }

  /**
   * Authenticate all of the clients in this bot.
   */
  async authenticateClients() {
    // Await the authentication of the clients linked to the bot.
    await Promise.all(Object.keys(this.clients).map(async (clientType: ClientType) => {
      // Await authentication of the bot.
      let client = await this.getClient(clientType);
      await client.authenticate();

      // Run appropriate Gestalt handlers in the clients.
      await client.gestalt();
    }));
  }

  /**
   * Disconnect all of the clients in this bot.
   */
  async disconnectClients() {
    // Await the authentication of the clients linked to the bot.
    await Promise.all(Object.keys(this.clients).map(async (clientType: ClientType) => {
      // Await authentication of the bot.
      await this.disconnectClient(clientType);
    }));
  }

  /**
   * Initialize all clients for this bot.
   *
   * Initialization uses the client configuration to properly create the clients.
   */
  async initializeClients() {
    // Await the processing and initialization of all clients in the configurations.
    await Promise.all(this.config.clients.map(async (clientTypeKey: string) => {
      // Load configuration since it exists.
      let clientConfig = await this.getActiveClientConfig(ClientType[clientTypeKey]);

      if (Sojiro.isEmpty(clientConfig)) {
        await Morgana.warn('Configuration file could not be loaded for the {{client}} client in {{bot}}. This client will not be instantiated.' +
          'To create a configuration file, you can copy the ones found in the "example" bot folder.', {
          client: clientTypeKey,
          bot: this.id
        });
        return;
      }

      // Uses the ClientFactory to build the appropriate factory given the type.
      // The client is then set to the bot.
      this.clients[ClientType[clientTypeKey]] = await ClientFactory.build(ClientType[clientTypeKey], clientConfig, this);
    }));
  }

  /**
   * Disconnect from a determined client on this bot.
   *
   * @param clientType
   *   The client ID to disconnect from.
   */
  async disconnectClient(clientType: ClientType) {
    // Simply call the client's disconnect function.
    let client: ClientInterface = await this.getClient(clientType);
    await client.disconnect();
  }

  /**
   * Runs each Talent's initialize() function to run any preparations for the given bot.
   */
  async initializeTalentsForBot() {
    // Await the processing of all of this bot's talents.
    await Promise.all(this.talents.map(async talentKey => {
      // Run this talent's initialize function for this bot.
      let talent = await TalentManager.getTalent(talentKey);
      await talent.initialize(this);
    }));
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
  async getCommandPrefix(resonance: Resonance): Promise<string> {
    // Get the configuration.
    let botConfig = await this.getActiveConfig();

    // Get bot's client configuration.
    let botClientConfig = await this.getClientConfig(resonance.client.type);

    // Variable to store retrieved command prefix.
    let commandprefix = undefined;

    // Depending on the client type, we'll be checking different types of configurations.
    switch (resonance.client.type) {
      // In the case of a Discord client, we check to see if there's a custom prefix set for the resonance's guild.
      case ClientType.Discord: {
        // Get client specific configurations.
        let clientConfig = await resonance.client.getActiveConfigurations() as DiscordClientConfigurations;
        if (resonance.message.guild) {
          commandprefix = clientConfig.guilds[resonance.message.guild.id].commandPrefix || undefined;
        }
        break;
      }

      // In the case of a Twitch client, we check to see if there's a custom prefix set for the resonance's guild.
      case ClientType.Twitch: {
        // Get client specific configurations.
        let clientConfig = await resonance.client.getActiveConfigurations() as TwitchClientConfigurations;
        if (resonance.message.channel) {
          commandprefix = clientConfig.channels[resonance.message.channel.id].commandPrefix || undefined;
        }
        break;
      }
    }

    // Reset it to undefined if it's empty.
    if (Sojiro.isEmpty(commandprefix)) {
      commandprefix = undefined;
    }

    // By default, return the following.
    return commandprefix || botClientConfig.commandPrefix || botConfig.commandPrefix;
  }

}
