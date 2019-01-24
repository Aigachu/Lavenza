/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Chronicler from './StorageService/Chronicler/Chronicler';
import BotManager from '../Bot/BotManager';
import TalentManager from '../Talent/TalentManager';
import ClientTypes from "../Bot/Client/ClientTypes";

/**
 * Gestalt manages the storage and retrieval of JSON type data.
 *
 * The name? Well, I just like how it sounds. Haha!
 *
 * Gestalt: "An organized whole that is perceived as more than the sum of its parts."
 *
 * This class serves as the accessor for the main StorageService that Lavenza will be using. A Storage Service is
 * essentially the service that will access the database of the application, wherever it is stored. It is the job
 * of the StorageService to determine what type of data storage it will access, and the responsibility of it to
 * implement the necessary methods for Lavenza to work. It MUST adopt the structure of a REST protocol: GET
 * POST, UPDATE & DELETE.
 *
 * We want to keep things simple and store JSON type data. In the future, we may explore SQL storage and the like.
 */
export default class Gestalt {

  /**
   * Gestalt is a static singleton. This function will handle the preparations.
   */
  static async prepare() {

    // The default storage service is the Chronicler.
    /** @see ./StorageService/Chronicler/Chronicler */
      // @TODO - Dynamic selection of StorageService instead of having to save it here. Maybe .env variables? Or a configuration file at the root of the application.
    let storageService = Chronicler;

    // Await the build process of the storage service and assign it to Gestalt.
    await storageService.build();
    this.storageService = storageService;

    // Some flavor text.
    await Lavenza.success("Gestalt preparations complete!");

  }

  /**
   * Bootstrap the database.
   *
   * This creates all database entries needed for the application to function properly.
   *
   * @returns {Promise<void>}
   */
  static async bootstrap() {

    // Await creation of i18n collection.
    // All data pertaining to translations will be saved here.
    await this.createCollection('/i18n');

    // Await creation of the Bots collection.
    await this.createCollection('/bots');

    // Await bootstrapping of each bot's data.
    await Promise.all(BotManager.bots.map(async bot => {

      // Initialize the database collection for this bot if it doesn't already exist.
      await this.createCollection(`/bots/${bot.id}`);

      // Initialize i18n database collection for this bot if it doesn't already exist.
      await this.createCollection(`/i18n/${bot.id}`);

      // Initialize i18n database collection for this bot's clients configurations if it doesn't already exist.
      await this.createCollection(`/i18n/${bot.id}/clients`);

      // Await the synchronization of data between the Bot's default configuration and the database configuration.
      await this.sync(bot.config, `/bots/${bot.id}/config`);

      // Create a database collection for the talents granted to a bot.
      await this.createCollection(`/bots/${bot.id}/talents`);

      // Await the bootstrapping of each talent's data.
      await Promise.all(bot.talents.map(async talentKey => {

        // Load Talent from the TalentManager.
        let talent = TalentManager.talents[talentKey];

        // Create a database collection for the talents granted to a Bot.
        await this.createCollection(`/bots/${bot.id}/talents/${talent.id}`);

        // Await the synchronization of data between the Talent's default configuration and the database configuration.
        await this.sync(talent.config, `/bots/${bot.id}/talents/${talent.id}/config`);

      }));

      // Create a database collection for Commands belonging to a Bot.
      await this.createCollection(`/bots/${bot.id}/commands`);

      // Await the bootstrapping of Commands data.
      await Promise.all(Object.keys(bot.commands).map(async commandKey => {

        // Load Command from the Bot.
        let command = bot.commands[commandKey];

        // Create a database collection for commands belonging to a Bot.
        await this.createCollection(`/bots/${bot.id}/commands/${command.id}`);

        // Await the synchronization of data between the Command's default configuration and the database configuration.
        await this.sync(command.config, `/bots/${bot.id}/commands/${command.id}/config`);

      }));

      // Create a database collection for the clients belonging to a Bot.
      await this.createCollection(`/bots/${bot.id}/clients`);

    }));

    // Await creation of the Talents collection.
    await this.createCollection('/talents');

    // Await bootstrapping of each talent's data.
    await Promise.all(Object.keys(TalentManager.talents).map(async talentKey => {

      // Get the actual talent.
      let talent = TalentManager.talents[talentKey];

      // Initialize the database collection for this talent if it doesn't already exist.
      await this.createCollection(`/talents/${talent.id}`);

    }));

    // Some more flavor.
    await Lavenza.success("Gestalt database successfully bootstrapped!");
  }

  /**
   * Prepare database files for a specific bot's client depending on the type.
   *
   * @param {Bot} bot
   *   The bot to bootstrap for. Each bot has a separate database.
   * @param {string} clientType
   *   The client type to bootstrap for.
   *
   * @TODO - Put all this in factory design.
   *
   * @returns {Promise<void>}
   */
  static async bootstrapClientDatabaseForBot(bot, clientType) {

    // Make sure database collection exists for this client for the given bot.
    await this.createCollection(`/bots/${bot.id}/clients/${clientType}`);

    // Initialize i18n database collection for this client if it doesn't already exist.
    await this.createCollection(`/i18n/${bot.id}/clients/${clientType}`);

    // Depending on the client type, we create different database files.
    switch (clientType) {

      // For Discord Clients...
      case ClientTypes.Discord: {

        // Initialize i18n contexts, creating them if they don't exist.
        // Translations are manageable through all of these contexts.
        await this.sync({}, `/i18n/${bot.id}/clients/${clientType}/guilds`);
        await this.sync({}, `/i18n/${bot.id}/clients/${clientType}/channels`);
        await this.sync({}, `/i18n/${bot.id}/clients/${clientType}/users`);

        // We start by syncing the guild configuration.
        let guilds = await this.sync({}, `/bots/${bot.id}/clients/${clientType}/guilds`);
        await Lavenza.wait(1); // @TODO - Fix this bullshit.

        // This is the default guild configuration for Discord.
        let defaultGuildConfig = {
          cprefix: '',
          operators: [],
          masters: []
        };

        // For all guilds, we initialize this default configuration.
        await Promise.all(bot.getClient(ClientTypes.Discord).guilds.map(async guild => {
          if (!(guild.id in guilds)) {
            guilds[guild.id] = defaultGuildConfig;
          }
          guilds[guild.id].name = `${guild.name}`;
          await this.update(`/bots/${bot.id}/clients/${clientType}/guilds`, guilds)
        }));
        break;

      }

      // For Twitch Clients...
      case ClientTypes.Twitch: {

        // Initialize i18n contexts, creating them if they don't exist.
        // Translations are manageable through all of these contexts.
        await this.sync({}, `/i18n/${bot.id}/clients/${clientType}/channels`);
        await this.sync({}, `/i18n/${bot.id}/clients/${clientType}/users`);

        // We start by syncing the guild configuration.
        let channels = await this.sync({}, `/bots/${bot.id}/clients/${clientType}/channels`);
        await Lavenza.wait(1); // @TODO - Fix this bullshit.

        // This is the default guild configuration for Discord.
        let defaultChannelConfig = {
          cprefix: '',
          operators: [],
          masters: []
        };

        // For all guilds, we initialize this default configuration.
        let config = await bot.getClientConfig(ClientTypes.Twitch);
        await Promise.all( config.channels.map(async channel => {
          if (!(channel in channels)) {
            channels[channel] = defaultChannelConfig;
          }
          await this.update(`/bots/${bot.id}/clients/${clientType}/channels`, channels)
        }));
        break;

      }

      // For Slack Clients...
      case ClientTypes.Slack: {

        // await this.sync({}, `/bots/${bot.id}/clients/${clientType}/workspaces`);
        break;

      }

    }

  }

  /**
   * Synchronize data between the active storage service and the defaults in the code.
   *
   * @param {Object} config
   *   Configuration to sync to the selected source.
   * @param {String} source
   *   The source that needs to be synced.
   *
   * @returns {Promise<Object>}
   *   Returns the synced configuration.
   */
  static async sync(config, source) {

    // Await initial fetch of data that may already exist.
    let dbConfig = await Lavenza.Gestalt.get(source);

    // If the configuration already exists, we'll want to sync the provided configuration with the source.
    // We merge both together. This MIGHT NOT be necessary? But it works for now.
    if (!Lavenza.isEmpty(dbConfig)) {
      return Object.assign({}, config, dbConfig);
    }

    // Await creation of database entry for the configuration, since it doesn't exist.
    await this.post(source, config);
    return config;

  }

  /**
   * Create a collection in the storage service.
   *
   * We need to keep in mind that we're using mostly JSON storage in this context.
   * This makes use of Collections & Items.
   *
   * @param {String} endpoint
   *   Location where to create the collection.
   * @param {Object} payload
   *   The data of the Collection to create.
   *
   * @returns {Promise<void>}
   */
  static async createCollection(endpoint, payload = {}) {

    // Each storage service creates collections in their own way. We await this process.
    await this.storageService.createCollection(endpoint, payload);

  }

  /**
   * Make a request using the storage service.
   *
   * The linked storage service implements it's own methods of storing and accessing data. Gestalt simply calls those.
   *
   * @param {String} protocol
   *   The protocol we want to use.
   *   The are four: GET, POST, UPDATE, DELETE.
   *    - GET: Fetch and retrieve data from a path/endpoint.
   *    - POST: Create data at a path/endpoint.
   *    - UPDATE: Adjust data at a path/endpoint.
   *    - DELETE: Remove data at a path/endpoint.
   * @param {String} endpoint
   *   The string path/endpoint of where to apply the protocol.
   * @param {Object} payload
   *   The data, if needed, to apply the protocol. GET/DELETE will not need a payload.
   *
   * @returns {Promise<*>}
   *   The result of the protocol call, if applicable.
   */
  static async request({protocol = '', endpoint, payload = {}} = {}) {

    // Await the request function call of the storage service.
    return await this.storageService.request({
      protocol: protocol,
      endpoint: endpoint,
      payload: payload
    });

  }

  /**
   * Process a GET request using the storage service.
   *
   * @param {String} endpoint
   *   Path to get data from.
   *
   * @returns {Promise<*>}
   *   Data retrieved, if it succeeded.
   */
  static async get(endpoint) {

    // Await GET request of the Storage Service.
    return await this.request({protocol: 'get', endpoint: endpoint});

  }

  /**
   * Process a POST request using the storage service.
   *
   * @param {String} endpoint
   *   Path to push data to.
   * @param {Object} payload
   *   Data to push to the endpoint.
   *
   * @returns {Promise<*|void>}
   *   Data pushed, if applicable.
   */
  static async post(endpoint, payload) {

    // Await POST request of the Storage Service.
    return await this.request({protocol: 'post', endpoint: endpoint, payload: payload});

  }

  /**
   * Process a UPDATE request using the storage service.
   *
   * @param {String} endpoint
   *   Path to push data to.
   * @param {Object} payload
   *   Data to update at the endpoint.
   *
   * @returns {Promise<*|void>}
   *   Data update, if applicable.
   */
  static async update(endpoint, payload) {

    // Await UPDATE request of the Storage Service.
    return await this.request({protocol: 'update', endpoint: endpoint, payload: payload});

  }

  /**
   * Process a DELETE request using the storage service.
   *
   * @param {String} endpoint
   *   Path to delete data at.
   *
   * @returns {Promise<void>}
   */
  static async delete(endpoint) {

    // Await DELETE request of the Storage Service.
    return await this.request({protocol: 'delete', endpoint: endpoint});

  }

}