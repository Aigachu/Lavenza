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
export default class CreatureManager extends EntityManager {

  /**
   * This build function replaces the act of a constructor.
   *
   * Entity Managers will be completely static and never instantiated, so a build function is needed.
   *
   * @returns {Promise<void>}
   */
  static async build() {

    // An ID for the collection where this manager's entities will be stored should be set here.
    this.repositoryId = 'creatures';

    // Each entity will be instantiated in the code using a class. This class should be defined and referenced here.
    this.entityClass = require('./Creature')['default'];

  }

}