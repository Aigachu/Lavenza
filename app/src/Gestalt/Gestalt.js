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
 * implement the necessary methods for Lavenza to work. It will only demand function of the REST protocol: GET
 * POST, UPDATE & DELETE.
 *
 * We want to keep things simple and store JSON type data. In the future, we may explore SQL storage and the like.
 */
export default class Gestalt {

  /**
   * Gestalt is a static singleton. This function will handle the preparations.
   */
  static async prepare() {

    // Set a variable to manage collections effectively.
    // When a collection is created, a tag is associated with it. This allows easy retrieval of a collection later.
    // this.collections = {};

    // The default storage service is the Chronicler.
    /** @see ./StorageService/Chronicler/Chronicler */
      // @TODO - Dynamic selection of StorageService instead of having to save it here. Maybe .env variables? Or a configuration file at the root of the application.
    let storageService = Chronicler;

    // Await the build process of the storage service and assign it to Gestalt.
    /** @catch Stop execution. */
    await storageService.build().catch(Lavenza.stop);
    this.storageService = storageService;

  }

  /**
   * Prepare database files for a specific client depending on the type.
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
    // Depending on the client type, we create different database files.
    switch (clientType) {
      case ClientTypes.Discord:
        let guilds = await this.sync({}, `/bots/${bot.name}/clients/${clientType}/guilds`);

        let defaultGuildConfig = {
          cprefix: '',
          operators: [],
          masters: []
        };

        await Promise.all(bot.clients.discord.guilds.map(async guild => {
          if (guild.id in guilds) {
            return;
          }
          guilds[guild.id] = defaultGuildConfig;
          await this.update(`/bots/${bot.name}/clients/${clientType}/guilds`, guilds)
        })).catch(Lavenza.stop);

        break;

      case ClientTypes.Twitch:
        await this.sync({}, `/bots/${bot.name}/clients/${clientType}/channels`);
        break;

      case ClientTypes.Slack:
        await this.sync({}, `/bots/${bot.name}/clients/${clientType}/workspaces`);
        break;
    }
  }

  /**
   * Bootstrap the database.
   *
   * Functions that run here do any syncing and preparation with the database before the application runs.
   *
   * @returns {Promise<void>}
   */
  static async bootstrap() {

    // Await creation of the Bots collection.
    /** @catch Stop execution. */
    await this.createCollection('/bots', 'bots').catch(Lavenza.stop);

    // Await bootstrapping of each bot's data.
    /** @catch Stop execution. */
    await Promise.all(BotManager.bots.map(async bot => {

      // Initialize the database collection for this bot if it doesn't already exist.
      /** @catch Stop execution. */
      await this.createCollection(`/bots/${bot.name}`, `bot.${bot.name}`).catch(Lavenza.stop);

      // Await the synchronization of data between the Bot's default configuration and the database configuration.
      /** @catch Stop execution. */
      bot.config = await this.sync(bot.config, `/bots/${bot.name}/config`).catch(Lavenza.stop);

      // Create a database collection for the talents granted to a bot.
      /** @catch Stop execution. */
      await this.createCollection(`/bots/${bot.name}/talents`, `bot.${bot.name}.talents`).catch(Lavenza.stop);

      // Await the bootstrapping of each talent's data.
      /** @catch Stop execution. */
      await Promise.all(bot.talents.map(async talentKey => {

        // Load Talent from the TalentManager.
        let talent = TalentManager.talents[talentKey];

        // Create a database collection for the talents granted to a Bot.
        /** @catch Stop execution. */
        await this.createCollection(`/bots/${bot.name}/talents/${talent.id}`, `bot.${bot.name}.talents.${talent.id}`).catch(Lavenza.stop);

        // Await the synchronization of data between the Talent's default configuration and the database configuration.
        /** @catch Stop execution. */
        await this.sync(talent.config, `/bots/${bot.name}/talents/${talent.id}/config`).catch(Lavenza.stop);

      })).catch(Lavenza.stop);

      // Create a database collection for Commands belonging to a Bot.
      /** @catch Stop execution. */
      await this.createCollection(`/bots/${bot.name}/commands`, `bot.${bot.name}.commands`).catch(Lavenza.stop);

      // Await the bootstrapping of Commands data.
      /** @catch Stop execution. */
      await Promise.all(Object.keys(bot.commands).map(async commandKey => {

        // Load Command from the Bot.
        let command = bot.commands[commandKey];

        // Create a database collection for commands belonging to a Bot.
        /** @catch Stop execution. */
        await this.createCollection(`/bots/${bot.name}/commands/${command.config.key}`, `bot.${bot.name}.commands.${command.config.key}`).catch(Lavenza.stop);

        // Await the synchronization of data between the Command's default configuration and the database configuration.
        /** @catch Stop execution. */
        await this.sync(command.config, `/bots/${bot.name}/commands/${command.config.key}/config`).catch(Lavenza.stop);

      })).catch(Lavenza.stop);

      // Create a database collection for the clients belonging to a Bot.
      /** @catch Stop execution. */
      await this.createCollection(`/bots/${bot.name}/clients`).catch(Lavenza.stop);

    })).catch(Lavenza.stop);
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
    /** @catch Stop execution. */
    let dbConfig = await Lavenza.Gestalt.get(source).catch(Lavenza.stop);

    // If the configuration already exists, we'll want to sync the provided configuration with the source.
    // We merge both together. This MIGHT NOT be necessary? But it works for now.
    if (!Lavenza.isEmpty(dbConfig)) {
      return Object.assign({}, config, dbConfig);
    }

    // Await creation of database entry for the configuration, since it doesn't exist.
    /** @catch Stop execution. */
    await this.post(source, config).catch(Lavenza.stop);
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
   * @param {String} tag
   *   Each collection needs to be provided a tag. This makes them a lot easier to retrieve in the code if needed.
   *   @TODO - Deprecate this. LOL.
   * @param {Object} payload
   *   The data of the Collection to create.
   *
   * @returns {Promise<void>}
   */
  static async createCollection(endpoint, tag = '', payload = {}) {

    // Each storage service creates collections in their own way. We await this process.
    /** @catch Stop execution. */
    await this.storageService.createCollection(endpoint, payload).catch(Lavenza.stop);
    // this.collections[tag] = endpoint;

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
    /** @catch Stop execution. */
    return await this.storageService.request({
      protocol: protocol,
      endpoint: endpoint,
      payload: payload
    }).catch(Lavenza.stop);

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
    /** @catch Stop execution. */
    return await this.request({protocol: 'get', endpoint: endpoint}).catch(Lavenza.stop);

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
    /** @catch Stop execution. */
    return await this.request({protocol: 'post', endpoint: endpoint, payload: payload}).catch(Lavenza.stop);

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
    /** @catch Stop execution. */
    return await this.request({protocol: 'update', endpoint: endpoint, payload: payload}).catch(Lavenza.stop);

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
    /** @catch Stop execution. */
    return await this.request({protocol: 'delete', endpoint: endpoint}).catch(Lavenza.stop);

  }

}