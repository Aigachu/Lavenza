/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Creature from '../Creature/Creature';
import CreatureTypes from "../Creature/CreatureTypes";

/**
 * Provides a class for Characters.
 *
 * Prompts can be set for a bot to await input from a user. Using the received input, it can then act upon it.
 */
export default class Character extends Creature {

  /**
   * Character constructor.
   *
   * @param {string} id
   *   ID of the Discord user to get the character for.
   */
  constructor(id) {
    super(id);
  }

  static async get(id) {
    return await super.get(CreatureTypes.Character, id);
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

  }

  /**
   * Run bootstrap handler for this class to set static variables.
   *
   * @param {*} talent
   *   DNDiscord Talent injected through DI.
   */
  static async bootstrap(talent) {
    // Create creatures repository.
    /** @catch Stop execution. */
    this.repository = Creature.repository + '/' + CreatureTypes.Character + 's';
    await Lavenza.Gestalt.createCollection(this.repository);
  }
}