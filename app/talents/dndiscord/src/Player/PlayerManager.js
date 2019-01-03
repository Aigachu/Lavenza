/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import EntityManager from '../EntityManager';

/**
 * Provides an Abstract class to initialize a manager for entities in the game.
 */
export default class PlayerManager extends EntityManager {

  /**
   * This build function replaces the act of a constructor.
   *
   * Entity Managers will be completely static and never instantiated, so a build function is needed.
   *
   * @returns {Promise<void>}
   */
  static async build() {

    // An ID for the collection where this manager's entities will be stored should be set here.
    this.repositoryId = 'players';

    // Each entity will be instantiated in the code using a class. This class should be defined and referenced here.
    this.entityClass = require('./Player')['default'];

  }

  /**
   * Register a player into the database.
   *
   * This creates the player's file and base configurations.
   *
   * @returns {Promise<void>}
   */
  static async register(data) {
    Lavenza.Gestalt.createCollection(this.repositoryPath + '/' + data.id).catch(Lavenza.stop);
    Lavenza.Gestalt.post(this.repositoryPath + '/' + data.id + '/profile', data).catch(Lavenza.stop);
    Lavenza.Gestalt.createCollection(this.repositoryPath + '/' + data.id + '/characters').catch(Lavenza.stop);
  }

}