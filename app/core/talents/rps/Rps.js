/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Rps Talent.
 *
 * Manages data and use of the Rock Paper Scissors commands.
 */
export default class Rps extends Lavenza.Talent {

  /**
   * @inheritDoc
   */
  static async build(config) {

    // Run default builders.
    await super.build(config);

  }

  /**
   * @inheritDoc
   */
  static async initialize(bot) {

    // Run default initializer to create database collections.
    await super.initialize(bot);

  }
}