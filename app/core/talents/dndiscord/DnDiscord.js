/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import PlayerManager from './src/Player/PlayerManager';
import CreatureManager from './src/Creature/CreatureManager';

/**
 * DNDiscord - The ultimate imaginary Discord adventure!
 *
 * This class is the core part of the game and where all preparation and other
 * things take place!
 *
 */
export default class DnDiscord extends Lavenza.Talent {

  /**
   * @inheritDoc
   */
  static async build(config) {

    // Run default builders.
    /** @catch Stop execution. */
    await super.build(config);

    // Run builders for our Managers.
    await PlayerManager.build();
    await CreatureManager.build();

  }

  /**
   * @inheritDoc
   */
  static async initialize(bot) {

    // Run default initializer to create database collections.
    /** @catch Stop execution. */
    await super.initialize(bot);

    // Run database bootstraps.
    /** @catch Stop execution. */
    await this.bootstrap();

    // Run initialization handlers for child classes.
    await PlayerManager.initialize(this);
    await CreatureManager.initialize(this);

  }

  /**
   *
   * @param id
   * @returns {Promise<*>}
   */
  static async getPlayerData(id) {
    return await PlayerManager.get(id);
  }

  /**
   *
   * @param data
   * @returns {Promise<void>}
   */
  static async registerPlayer(data) {
    await PlayerManager.register(data);
  }

  /**
   * Bootstrap database for DNDiscord. We have a lot to do here!
   *
   * @returns {Promise<void>}
   */
  static async bootstrap() {

    // Run initialization handlers for child classes.
    await PlayerManager.bootstrap(this);
    await CreatureManager.bootstrap(this);

  }
}