/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import ClientFactory from './Client/ClientFactory';
import ResonanceFactory from './Resonance/ResonanceFactory'
import TalentManager from '../Talent/TalentManager';
import CommandListener from './Command/CommandListener/CommandListener';
import PromptFactory from './Prompt/PromptFactory';

/**
 * Provides a class for Bots.
 *
 * Bots are the fruit of this application. They're the whole point of it. And this is where it all happens!
 *
 * Configuration for bots are managed in a 'config.yml' file found in their folder. From there, functions in here
 * manage the authentication to the bot's clients and what talents the bot has.
 *
 */
export default class Bot {

  /**
   * Bot constructor.
   *
   * @param {string} id
   *   id of the bot. This is the name of the folder, not a reader-friendly name.
   * @param {Object} config
   *   Configuration loaded from the bot's 'NAME.config.yml' file.
   */
  constructor(id, config) {
    this.id = id;
    this.config = config;
    this.directory = config.directory;

    // Initializations.
    this.clients = {};
    this.talents = [];
    this.commands = {};
    this.commandAliases = {};
    this.listeners = [];
    this.prompts = [];
  }

  /**
   * Deployment handler for this Bot.
   *
   * Authenticates the clients and initializes talents.
   *
   * @returns {Promise.<void>}
   */
  async deploy() {

    // Await client initialization.
    await this.initializeClients();

    // Await clients authentication.
    await this.authenticateClients();

    // Await building of architect.
    await this.materializeArchitect();

    // Await talent initializations for this bot.
    // We do this AFTER authenticating clients. Some talents might need client info to perform their initializations.
    await this.initializeTalentsForBot();

  }

  /**
   * Preparation handler for the Bot.
   *
   * Initializes clients, talents, commands and listeners.
   *
   * @returns {Promise.<void>}
   */
  async prepare() {

    // Await talent grants.
    await this.grantTalents();

    // Await command inheritance.
    await this.setCommands();

    // Await listener initialization & inheritance.
    await this.setListeners();

  }

  /**
   * For each client, we build the architect's identification and data.
   *
   * We should be able to access the architect from the bot at all times.
   *
   * @returns {Promise<void>}
   */
  async materializeArchitect() {

    // Initialize architect object.
    this.architect = {};

    // Await processing of all clients.
    await Promise.all(Object.keys(this.clients).map(async clientKey => {

      // Get the client's configuration.
      let config = await this.getActiveClientConfig(clientKey);

      // Depending on the type of client, we act accordingly.
      switch(clientKey) {

        // In Discord, we fetch the architect's user using the ID.
        case Lavenza.ClientTypes.Discord: {
          this.architect.discord = await this.getClient(clientKey).fetchUser(config.architect);
          break;
        }

        // In Twitch, we build a custom object using only the username.
        // @TODO - Build a TwitchUser object using the client.
        case Lavenza.ClientTypes.Twitch: {
          this.architect.twitch = {username: config.architect};
          break;
        }

      }

    }));
  }

  /**
   * Get the active configuration from the database for this Bot.
   *
   * @returns {Promise<Object>}
   *   Returns the configuration fetched from the database.
   */
  async getActiveConfig() {

    // Attempt to get the active configuration from the database.
    let activeConfig = await Lavenza.Gestalt.get(`/bots/${this.id}/config/core`);
    if (!Lavenza.isEmpty(activeConfig)) {
      return activeConfig;
    }

    // Sync it to the database.
    await Lavenza.Gestalt.sync(this.config, `/bots/${this.id}/config/core`);

    // Return the configuration.
    return this.config;

  }

  /**
   * Retrieve a specific client from a Bot.
   *
   * @param {string} clientType
   *   The type of client to return from the bot.
   *
   * @returns {Promise<void>}
   *   The requested client.
   */
  getClient(clientType) {
    return this.clients[clientType];
  }

  /**
   * Retrieve configuration for a specific client in a bot.
   *
   * @param {string} clientType
   *   The type of client configuration to return for the bot.
   *
   * @returns {Promise<void>}
   *   The requested client.
   */
  async getClientConfig(clientType) {

    // Determine path to client configuration.
    let pathToClientConfig = `${this.directory}/${clientType}.yml`;

    // Attempt to fetch client configuration.
    if (!await Lavenza.Akechi.fileExists(pathToClientConfig)){
      return undefined;
    }

    // Load configuration since it exists.
    return await Lavenza.Akechi.readYamlFile(pathToClientConfig);

  }

  /**
   * Retrieve active client configuration for this bot.
   *
   * @param {string} clientType
   *   The type of client configuration to return for the bot.
   *
   * @returns {Promise<void>}
   *   The requested client.
   */
   async getActiveClientConfig(clientType) {

    // Attempt to get the active configuration from the database.
    let activeConfig = await Lavenza.Gestalt.get(`/bots/${this.id}/config/${clientType}`);
    if (!Lavenza.isEmpty(activeConfig)) {
      return activeConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    let config = await this.getClientConfig(clientType);

    // Sync it to the database.
    await Lavenza.Gestalt.sync(config, `/bots/${this.id}/config/${clientType}`);

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
   *
   * @returns {Promise.<void>}
   */
  async grantTalents() {

    // Check if there are talents set in configuration.
    if (Lavenza.isEmpty(this.config.talents)) {
      await Lavenza.warn('Talents configuration missing for {{bot}}. The bot will not have any features!', {bot: this.id});
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
   * Attempt to get a command from the list of commands in this Bot.
   *
   * @param {string} commandKey
   *   The key of the command to search for.
   *
   * @returns {Promise.<Lavenza.Command>}
   */
  async getCommand(commandKey) {
    if (!Lavenza.isEmpty(this.commandAliases[commandKey])) {
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
   *
   * @returns {Promise.<void>}
   */
  async setCommands() {

    // Await the processing of all talents loaded in the bot.
    await Promise.all(this.talents.map(async talent => {

      // Merge the bot's commands with the Talent's commands.
      this.commands = Object.assign({}, this.commands, TalentManager.talents[talent].commands);
      this.commandAliases = Object.assign({}, this.commandAliases, TalentManager.talents[talent].commandAliases);

    }));

  }

  /**
   * Set all necessary listeners to the Bot.
   *
   * Bots inherit listeners from Talents. Here we set all commands that are already loading into talents, into
   * the bots.
   *
   * By the time this function runs, the Bot should already have all of its necessary talents granted.
   *
   * @returns {Promise.<void>}
   */
  async setListeners() {

    // Set the core CommandListener.
    this.listeners.push(CommandListener);

    // Await the processing of all talents loaded in the bot.
    await Promise.all(this.talents.map(async talentKey => {

      // Merge the bot's listeners with the Talent's listeners.
      this.listeners = [...this.listeners, ...TalentManager.talents[talentKey].listeners]

    }));

  }

  /**
   * Validates the list of custom talents configured in the bot's config file.
   *
   * If a talent is in the list, but does not exist, it will be removed from the configuration list.
   *
   * @returns {Promise.<void>}
   */
  async validateTalents() {

    // Await the processing of all talents in the bot's config object.
    await Promise.all(this.config.talents.map(async (talentKey) => {

      // First, we'll check if this talent already exists in the Manager.
      // This happens if another bot already loaded it.
      // If it exists, we're good.
      if (!Lavenza.isEmpty(TalentManager.talents[talentKey])) {
        return;
      }

      // Await the loading of the talent.
      // If it the load fails, we'll remove the talent from the bot's configuration.
      /** @catch Remove the talent from the configuration list. */
      await TalentManager.loadTalent(talentKey).catch(async error => {

        this.config.talents = Lavenza.removeFromArray(this.config.talents, talentKey);

        // Send a warning message to the console.
        await Lavenza.warn('Error occurred while loading the {{talent}} talent...', {talent: talentKey});
        await Lavenza.warn(error.message);

      });

      // Check talent's configuration to see if dependencies are loaded into this bot.
      await Promise.all(TalentManager.talents[talentKey].config.dependencies.map(async (dependency) => {

        // If the dependency isn't found in th`is bot's config, we shouldn't load this talent.
        if (!this.config.talents.includes(dependency)) {

          // Send a warning to the console.
          await Lavenza.warn(`The '{{talent}}' talent requires the '{{parent}}' talent to exist and to be enabled, but this is not the case. It will not be activated for {{bot}}.`, {
            talent: talentKey,
            parent: dependency,
            bot: this.id
          });

          // Remove this talent from the bot.
          this.config.talents = Lavenza.removeFromArray(this.config.talents, talentKey);

        }

      }));

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
   * When this function is ran, we fetch the raw content of the message sent, and we build a Resonance object. This is
   * a fancy name for an object that stores information about a received communication. Then, we send off the Resonance
   * to the listeners that are on the bot.
   *
   * Listeners will receive the Resonance, and then they react to them. Perfect example is the CommandListener, that
   * will receive a Resonance and determine whether a command was issued. Custom Talent Listeners can do whatever they
   * want!
   *
   * @see ./Listener/Listener
   * @see ./Resonance/Resonance
   *
   * @param {*} message
   *   Message object heard from a client.
   * @param {*} client
   *   Client where the Message Object was heard from.
   */
  async listen(message, client) {

    // First we decipher the message we just obtained.
    let content = await this.constructor.decipher(message, client);

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
   * @param {String} request
   *   Message that will be sent describing the requested information.
   * @param {*} line
   *   The communication line for this prompt. Basically, where we want the interaction to happen.
   * @param {Lavenza.Resonance|Resonance} resonance
   *   The Resonance tied to this prompt.
   * @param {int} lifespan
   *   The lifespan of this Prompt.
   *   If the bot doesn't receive an answer in time, we cancel the prompt.
   *   10 seconds is the average time a white boy waits for a reply from a girl he's flirting with after sending her a
   *   message. You want to triple that normally. You're aiming for a slightly more patient white boy. LMAO!
   * @param {*} onResponse
   *   The callback function that runs once a response has been heard.
   *
   * @returns {Promise<void>}
   */
  async prompt(request, line, resonance, lifespan, onResponse) {

    // Create the new prompt using the factory.
    let prompt = await PromptFactory.build(request, line, resonance, onResponse, this);

    // Set the prompt to the bot.
    this.prompts.push(prompt);

    // Await resolution of the prompt.
    // If we go past the lifespan, the prompt will throw an error. This error must be caught and handled accordingly.
    // Basically, when implementing this method elsewhere, catch the error and do whatever you want with it.
    /** @catch Throw the error for specific case handling. */
    await prompt.await(lifespan).catch(await Lavenza.throw);

  }

  /**
   * Remove a prompt from the current bot.
   *
   * @param {Prompt} prompt
   *   The prompt to remove from this bot.
   *
   * @returns {Promise<void>}
   */
  async removePrompt(prompt) {
    this.prompts = Lavenza.removeFromArray(this.prompts, prompt);
  }

  /**
   * Decipher a message and obtain the raw content.
   *
   * Each client will send a message differently. i.e. Discord.JS sends a specific Message Object, whereas Twitch might
   * send back a string. This function interprets these respectively and sends back the raw content.
   *
   * @param {*} message
   *    Message object sent by the client.
   * @param {*} client
   *    The client that sent the message.
   *
   * @returns {string|StringResolvable}
   */
  static async decipher(message, client) {

    // Depending on the Client Type, decipher the message accordingly.
    switch (client.type) {

      // In the case of Discord, we get the 'content' property of the message object.
      case Lavenza.ClientTypes.Discord: {
        return message.content;
      }

      // In the case of Discord, we get the 'content' property of the message object.
      // For Twitch, the Message object is custom built.
      case Lavenza.ClientTypes.Twitch: {
        return message.content;
      }

      // case Lavenza.ClientTypes.Slack:
      //   return message;
    }
  }

  /**
   * Authenticate all of the clients in this bot.
   *
   * @returns {Promise.<void>}
   */
  async authenticateClients() {

    // Get all keys from the client configuration, that should match the names defined in ClientTypes.
    let clientKeys = Object.keys(this.clients);

    // Await the authentication of the clients linked to the bot.
    /** @catch Continue execution. */
    await Promise.all(clientKeys.map(async key => {

      // Await authentication of the bot.
      /** @catch Continue execution. */
      await this.clients[key].authenticate();

      // Run appropriate bootstrapping depending on the client.
      await Lavenza.Gestalt.bootstrapClientDatabaseForBot(this, key);

    }));

  }

  /**
   * Initialize all clients for this bot.
   *
   * Initialization uses the client configuration to properly create the clients.
   *
   * @returns {Promise.<void>}
   */
  async initializeClients() {

    // Get the keys of the clients, that should match the names defined in ClientTypes.
    let clientIds = this.config.clients;

    // Await the processing and initialization of all clients in the configurations.
    await Promise.all(clientIds.map(async id => {

      // Load configuration since it exists.
      let clientConfig = await this.getActiveClientConfig(id);

      if (Lavenza.isEmpty(clientConfig)) {
        await Lavenza.warn('Configuration file could not be loaded for the {{client}} client in {{bot}}. This client will not be instantiated.' +
          'To create a configuration file, you can copy the ones found in the "example" bot folder.', {client: id, bot: this.id});
        return;
      }

      // Uses the ClientFactory to build the appropriate factory given the type.
      // The client is then set to the bot.
      this.clients[id] = await ClientFactory.build(id, clientConfig, this);

    }));

  }

  /**
   * Runs each Talent's initialize() function to run any preparations for the given bot.
   *
   * @returns {Promise<void>}
   */
  async initializeTalentsForBot() {

    // Await the processing of all of this bot's talents.
    await Promise.all(this.talents.map(async talentKey => {

      // Run this talent's initialize function for this bot.
      await TalentManager.talents[talentKey].initialize(this);

    }));

  }

  /**
   * Get the command prefix, after a couple of checks.
   *
   * @param {Resonance} resonance
   *   The Resonance we're taking a look at.
   *
   * @returns {Promise<*>}
   *   Returns the command prefix we need to check for.
   */
  async getCommandPrefix(resonance) {

    // Get the configuration.
    let botConfig = await this.getActiveConfig();

    // Get client configuration.
    let clientConfig = await this.getClientConfig(resonance.client.type);

    // Variable to store retrieved cprefix.
    let cprefix = undefined;

    // Depending on the client type, we'll be checking different types of configurations.
    switch (resonance.client.type) {

      // In the case of a Discord client, we check to see if there's a custom prefix set for the resonance's guild.
      case Lavenza.ClientTypes.Discord: {

        let guildConfig = await Lavenza.Gestalt.get(`/bots/${this.id}/clients/discord/guilds`);
        if (resonance.message.guild) {
          cprefix = guildConfig[resonance.message.guild.id].cprefix || undefined;
        }
        break;

      }

      // In the case of a Twitch client, we check to see if there's a custom prefix set for the resonance's guild.
      case Lavenza.ClientTypes.Twitch: {

        let channelConfig = await Lavenza.Gestalt.get(`/bots/${this.id}/clients/twitch/channels`);
        if (resonance.message.channel) {
          cprefix = channelConfig[resonance.message.channel.id].cprefix || undefined;
        }
        break;

      }

      // In the case of a Slack client, we check to see if there's a custom
      // prefix set for the resonance's workspace.
      case Lavenza.ClientTypes.Slack: {

        let workspaceConfig = await Lavenza.Gestalt.get(`/bots/${this.id}/clients/slack/workspaces`);
        if (resonance.message.workspace) {
          cprefix = workspaceConfig[resonance.message.workspace.id].cprefix || undefined;
        }

      }

    }

    // Reset it to undefined if it's empty.
    if (Lavenza.isEmpty(cprefix)) {
      cprefix = undefined;
    }

    // By default, return the following.
    return cprefix || clientConfig['command_prefix'] || botConfig['command_prefix'];

  }

}
