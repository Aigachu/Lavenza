/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import ClientFactory from './Client/ClientFactory';
import TalentManager from '../Talent/TalentManager';
import CommandListener from './Command/CommandListener';
import ClientTypes from "./Client/ClientTypes";

/**
 * Provides a class for Bots.
 *
 * Bots are the fruit of this application. They're the whole point of it. And this is where it all begins.
 *
 * Configuration for bots are managed in a 'config.yml' file found in their folder. From there, functions in here
 * manage the authentication to the bot's clients and what talents the bot has.
 *
 */
export default class Bot {

  /**
   * Bot constructor.
   *
   * @param {string} name
   *   Name of the bot. This is the name of the folder, not a reader-friendly name.
   * @param {Object} config
   *   Configuration loaded from the bot's 'NAME.config.yml' file.
   */
  constructor(name, config) {
    this.name = name;
    this.config = config;
    this.directory = config.directory;

    // Initializations.
    this.clients = {};
    this.talents = {};
    this.commands = {};
    this.listeners = [];
  }

  /**
   * Grants talents to the Bot.
   *
   * There is a collection of Core talents that all bots will have.
   *
   * Custom Talents are configured in the Bot's configuration file. You must enter the ID (directory name) of
   * the talent in the bot's config so that it can be loaded here.
   *
   * It's important to note that references to the Talents are never stored in the bot. Only the IDs are stored.
   *
   * Talents will always be accessed through the Manager itself.
   *
   * @returns {Promise.<void>}
   */
  async grantTalents() {

    // Start by setting the core talent list to the bot.
    this.talents = TalentManager.coreTalentList;

    // Check if there are custom talents defined.
    if (Lavenza.isEmpty(this.config.talents)) {
      Lavenza.warn('NO_TALENT_CONFIG_FOUND_FOR_BOT', [this.name]);
      return;
    }

    // Await validation of custom talents configured.
    // This basically checks if the talents entered are valid. Invalid ones are removed from the array.
    /** @catch Stop execution. */
    await this.validateCustomTalents().catch(Lavenza.stop);

    // After validations are complete, we merge the core talents defined for the bot, with the custom ones.
    // This completes the list of talents assigned to the bot.
    this.talents = [...this.talents, ...this.config.talents];

    // Shoot a success message.
    Lavenza.success('TALENTS_LOADED_FOR_BOT', [this.name]);

  }

  /**
   * Attempt to get a command from the list of commands in this Bot.
   *
   * @param {string} commandKey
   *   The key of the command to search for.
   *
   * @returns {Command}
   */
  getCommand(commandKey) {
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
    /** @catch Stop execution. */
    await Promise.all(this.talents.map(async talent => {

      // Merge the bot's commands with the Talent's commands.
      this.commands = Object.assign({}, this.commands, TalentManager.talents[talent].commands);

    })).catch(Lavenza.stop);

    // Send a success message.
    Lavenza.success('COMMANDS_SET_FOR_BOT', [this.name]);
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
    /** @catch Stop execution. */
    await Promise.all(this.talents.map(async talentKey => {

      // Merge the bot's listeners with the Talent's listeners.
      this.listeners = [...this.listeners, ...TalentManager.talents[talentKey].listeners]

    })).catch(Lavenza.stop);

    // Send a success message.
    Lavenza.success('LISTENERS_SET_FOR_BOT', [this.name]);
  }

  /**
   * Validates the list of custom talents configured in the bot's config file.
   *
   * If a talent is in the list, but does not exist, it will be removed from the configuration list.
   *
   * @returns {Promise.<void>}
   */
  async validateCustomTalents() {

    // Await the processing of all talents in the bot's config object.
    /** @catch Stop execution. */
    await Promise.all(this.config.talents.map(async (talentKey) => {

      // First, we'll check if this talent already exists in the Manager.
      // This happens if another bot already loaded it.
      // If it exists, we're good.
      if (!Lavenza.isEmpty(TalentManager.talents[talentKey])) {
        return;
      }

      // Compute the path to the talent, should it exist.
      let pathToTalent = Lavenza.Paths.TALENTS.CUSTOM + '/' + talentKey;

      // Await the loading of the talent.
      // If it the load fails, we'll remove the talent from the bot's configuration.
      /** @catch Remove the talent from the configuration list. */
      await TalentManager.loadTalent(pathToTalent).catch(error => {
        this.config.talents = Lavenza.removeFromArray(this.config.talents, talentKey);

        // Send a warning message to the console.
        Lavenza.warn('ERROR_LOADING_TALENT', [talentKey]);
      });
    })).catch(Lavenza.stop);
  }

  /**
   * Listen to a message heard in a client.
   *
   * Now, explanations.
   *
   * This function will be used in clients to send a 'Message' back to the bot. This happens whenever a message
   * is 'heard', meaning that the bot is in a chat room and a message was sent by someone (or another bot).
   *
   * When this function is run, we fetch the raw content of the message sent, and we build a Resonance object. This is
   * a fancy name for an object that stores information about a Message received. Then, we send off the Resonance to
   * the listeners that are on the bot.
   *
   * Listeners will receive the Resonance, and then they react to them. Perfect example if the CommandListener, that
   * will receive a Resonance and determine whether a command was ordered. Custom Talent Listeners can do whatever they
   * want!
   *
   * @see ./Listener/Listener
   * @see ../Model/Resonance
   *
   * @param {*} message
   *   Message object heard from a client.
   * @param {*} client
   *   Client where the Message Object was heard from.
   *
   * @returns {Promise.<void>}
   */
  listen(message, client) {

    // First we decipher the message we just obtained.
    let content = this.constructor.decipher(message, client);

    // Construct a 'Resonance'.
    let resonance = new Lavenza.Resonance(content, message, this, client);

    // Fire all of the bot's listeners.
    this.listeners.every(listener => {
      listener.listen(resonance);
      return true;
    });

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
  static decipher(message, client) {

    // Depending on the Client Type, decipher the message accordingly.
    switch (client.type) {

      case ClientTypes.Discord:
        return message.content;

      // case ClientTypes.Twitch:
      //   return message;

      // case ClientTypes.Slack:
      //   return message;
    }
  }

  /**
   * Deployment handler for this Bot.
   *
   * Authenticates the clients.
   *
   * @returns {Promise.<void>}
   */
  async deploy() {

    // Await clients authentication.
    /** @catch Stop execution. */
    await this.authenticateClients().catch(Lavenza.stop);
  }

  /**
   * Preparation handler for the Bot.
   *
   * Initializes clients, talents, commands and listeners.
   *
   * @returns {Promise.<void>}
   */
  async prepare() {

    // Await client initialization.
    /** @catch Stop execution. */
    await this.initializeClients().catch(Lavenza.stop);

    // Await talent grants.
    /** @catch Stop execution. */
    await this.grantTalents().catch(Lavenza.stop);

    // Await command inheritance.
    /** @catch Stop execution. */
    await this.setCommands().catch(Lavenza.stop);

    // Await listener initialization & inheritance.
    /** @catch Stop execution. */
    await this.setListeners().catch(Lavenza.stop);

  }

  /**
   * Authenticate all of the clients in this bot.
   *
   * @returns {Promise.<void>}
   */
  async authenticateClients() {
    let clientKeys = Object.keys(this.clients);

    // Await the authentication of the clients linked to the bot.
    /** @catch Continue execution. */
    await Promise.all(clientKeys.map(async key => {

      // Await authentication of the bot.
      /** @catch Continue execution. */
      await this.clients[key].authenticate().catch(Lavenza.continue);

    })).catch(Lavenza.continue);

    // Send a success message.
    Lavenza.success('CLIENTS_AUTHENTICATED_FOR_BOT', [this.name]);
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
    let clientKeys = Object.keys(this.config.clients);

    // Await the processing and initialization of all clients in the configurations.
    /** @catch Stop execution. */
    await Promise.all(clientKeys.map(key => {

      // Uses the ClientFactory to build the appropriate factory given the type.
      // The client is then set to the bot.
      this.clients[key] = ClientFactory.build(key, this.config.clients[key], this);

    })).catch(Lavenza.stop);

    // Send a success message.
    Lavenza.success('CLIENTS_INITIALIZED_FOR_BOT', [this.name]);
  }
}
