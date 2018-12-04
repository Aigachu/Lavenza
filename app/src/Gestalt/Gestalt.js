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
import Talent from "../Talent/Talent";

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
    this.collections = {};

    // The default storage service is the Chronicler.
    /** @see ./StorageService/Chronicler/Chronicler */
    // @TODO - Dynamic selection of StorageService instead of having to save it here. Maybe .env variables? Or a configuration file at the root of the application.
    let storageService = Chronicler;

    // We run the build functions of the storage service and assign it to Gestalt.
    await storageService.build().catch(Lavenza.stop);
    this.storageService = storageService;

  }

  /**
   * Bootstrap the database.
   *
   * Functions that run here do any syncing and preparation with the database before the application runs.
   *
   * @returns {Promise<void>}
   */
  static async bootstrap() {

    // Await creation of Bots Collection.
    /** @catch Stop execution. */
    await this.createCollection('/bots', 'bots').catch(Lavenza.stop);

    // Await bootstrapping of Bot data.
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

      // Await the bootstrapping of Talents data.
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
    })).catch(Lavenza.stop);
  }

  /**
   * Synchronize data between the active storage service and the defaults in the code.
   *
   * @param config
   * @param source
   * @returns {Promise<*>}
   */
  static async sync(config, source) {
    let dbConfig = await Lavenza.Gestalt.get(source).catch(Lavenza.stop);
    if (!Lavenza.isEmpty(dbConfig)) {
      return Object.assign({}, config, dbConfig);
    } else {
      await this.post(source, config).catch(Lavenza.stop);
      return config;
    }
  }

  static async createCollection(endpoint, tag, payload = {}) {
    let collection = await this.storageService.createCollection(endpoint, payload).catch(Lavenza.stop);
    this.collections[tag] = endpoint;
  }

  static async collection(tag) {
    return this.get(this.collections[tag]);
  }

  static async request({protocol = '', endpoint, payload = {}} = {}) {
    return await this.storageService.request({protocol: protocol, endpoint: endpoint, payload: payload}).catch(Lavenza.stop);
  }

  static async get(endpoint) {
    return await this.request({protocol: 'get', endpoint: endpoint}).catch(Lavenza.stop);
  }

  static async post(endpoint, payload) {
    return await this.request({protocol: 'post', endpoint: endpoint, payload: payload}).catch(Lavenza.stop);
  }

  static async update(endpoint, payload) {
    return await this.request({protocol: 'update', endpoint: endpoint, payload: payload}).catch(Lavenza.stop);
  }

  static async delete(endpoint, payload) {
    return await this.request({protocol: 'delete', endpoint: endpoint, payload: payload}).catch(Lavenza.stop);
  }

}