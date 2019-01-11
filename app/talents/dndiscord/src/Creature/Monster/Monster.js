/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Creature from '../Creature';
import CreatureTypes from '../CreatureTypes';

/**
 * Provides a class for Characters.
 *
 * Prompts can be set for a bot to await input from a user. Using the received input, it can then act upon it.
 */
export default class Monster extends Creature {

  /**
   * Monster constructor.
   *
   * @param {string} id
   *   ID of the Discord user to get the character for.
   */
  constructor(id) {
    super(id);
  }

  static async get(id) {
    return await super.get(CreatureTypes.Monster, id);
  }

  /**
   * Run initialize handler for this class to set static variables.
   *
   * @param {*} talent
   *   DNDiscord Talent injected through DI.
   */
  static async initialize(talent) {

    // Run Creature class initialize function.
    await super.initialize(talent);

    // Overwrite the repository for this class to set it to the proper one.
    this.repository = this.repository + '/' + CreatureTypes.Monster + 's';
  }
}