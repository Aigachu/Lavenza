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
    let storageService = Chronicler; // @TODO - Dynamic selection of StorageService instead of having to save it here.
    await storageService.build().catch(Lavenza.stop);
    this.storageService = storageService;

  }

  static async bootstrap() {
    // await this.bootstrapTalentDatabase().catch(Lavenza.stop);
    await this.bootstrapBotDatabase().catch(Lavenza.stop);
  }

  static async bootstrapBotDatabase() {
    // Await creation of Bots Collection.
    /** @catch Stop execution. */
    await this.createCollection('/bots', 'bots').catch(Lavenza.stop);

    await Promise.all(BotManager.bots.map(async bot => {
      // Initialize the database collection for this bot if it doesn't already exist.
      /** @catch Stop execution. */
      this.createCollection(`/bots/${bot.name}`, `bot.${bot.name}`).catch(Lavenza.stop);
      bot.config = await this.sync(bot.config, `/bots/${bot.name}/config`).catch(Lavenza.stop);

      // Create a database collection for the commands inside of a bot.
      /** @catch Stop execution. */
      await this.createCollection(`/bots/${bot.name}/commands`, `bot.${bot.name}.commands`).catch(Lavenza.stop);

      await Promise.all(Object.keys(bot.commands).map(async commandKey => {
        let command = bot.commands[commandKey];
        // Create a database collection for the commands inside of the client of a bot.
        /** @catch Stop execution. */
        await this.createCollection(`/bots/${bot.name}/commands/${command.config.key}`, `bot.${bot.name}.commands.${command.config.key}`).catch(Lavenza.stop);
        await this.sync(command.config, `/bots/${bot.name}/commands/${command.config.key}/config`).catch(Lavenza.stop);
      })).catch(Lavenza.stop);

      // Create a database collection for the talents inside of a bot.
      /** @catch Stop execution. */
      await this.createCollection(`/bots/${bot.name}/talents`, `bot.${bot.name}.talents`).catch(Lavenza.stop);

      await Promise.all(bot.talents.map(async talentKey => {
        let talent = TalentManager.talents[talentKey];
        // Create a database collection for the talents inside of the client of a bot.
        /** @catch Stop execution. */
        await this.createCollection(`/bots/${bot.name}/talents/${talent.id}`, `bot.${bot.name}.talents.${talent.id}`).catch(Lavenza.stop);
        await this.sync(talent.config, `/bots/${bot.name}/talents/${talent.id}/config`).catch(Lavenza.stop);
      })).catch(Lavenza.stop);

    })).catch(Lavenza.stop);
  }

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