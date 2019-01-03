/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides an Abstract class to initialize a manager for entities in the game.
 */
export default class EntityManager {

  /**
   * This build function replaces the act of a constructor.
   *
   * Entity Managers will be completely static and never instantiated, so a build function is needed.
   *
   * @returns {Promise<void>}
   */
  static async build() {

    // An ID for the collection where this manager's entities will be stored should be set here.
    this.repositoryId = null;

    // Each entity will be instantiated in the code using a class. This class should be defined and referenced here.
    this.entityClass = require('./Entity')['default'];

    // This is an abstract method. It should never be called.
    Lavenza.throw('This is the base build function of the EntityManager class. This should not have been called.');
  }

  /**
   * Get data from the repository using a specific ID.
   *
   * @param {string} id
   *   ID of the entity to retrieve from the database.
   *
   * @returns {Promise<Object>}
   */
  static async data(id) {
    return await Lavenza.Gestalt.get(`/${this.repositoryPath}/${id}`).catch(Lavenza.stop);
  }

  /**
   * Get an entity from the manager's repository.
   *
   * @param id
   * @returns {Promise<*>}
   */
  static async get(id) {

    // If the entity is already set in the cache, retrieve it from there.
    if (!Lavenza.isEmpty(this.cache[id])) {
      return this.cache[id];
    }

    // Load save data from the database.
    let entity = await this.load(id).catch(Lavenza.stop);

    // If the character save data is empty, we simply return undefined.
    if (Lavenza.isEmpty(entity)) {
      return undefined;
    }

    // If not, we load the data and return the created Character object after setting it in the cache.
    this.cache[id] = entity;
    return entity;

  }

  /**
   * Retrieve an entity's data.
   */
  static async load(id) {

    // Load the data from the database.w
    let data = await Lavenza.Gestalt.get(`${this.repositoryPath}/${id}`).catch(Lavenza.stop);

    // If the data is null, we'll return nothing.
    if (Lavenza.isEmpty(data)) {
      return undefined;
    }

    // Create a new instance of the entity with the data and return it.
    return new this.entityClass(id, `${this.repositoryPath}/${id}`);
  }

  /**
   * Run initialize handler for this class to set static variables.
   *
   * @param {*} talent
   *   DNDiscord Talent injected through DI.
   */
  static async initialize(talent) {

    // Assign the main DNDiscord talent to the child class.
    this.talent = talent;

    // Set the manager's cache.
    this.cache = {};

  }

  /**
   * Run bootstrap handler for this class to set static variables.
   *
   * @param {*} talent
   *   DNDiscord Talent injected through DI.
   */
  static async bootstrap(talent) {

    // Set the path to this manager's repository.
    // This will lead to /databases/talents/dndiscord/REPOSITORY_ID.
    /** @catch Stop execution. */
    this.repositoryPath = talent.databases.global + '/' + this.repositoryId;

    // Create repository if it doesn't already exist.
    /** @catch Stop execution. */
    await Lavenza.Gestalt.createCollection(this.repositoryPath).catch(Lavenza.stop);

  }
}