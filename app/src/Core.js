/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 *
 */

// Managers.
import BotManager from './Bot/BotManager';
import TalentManager from './Talent/TalentManager';

/**
 * Provides class for the Core of the Lavenza application.
 *
 * Most of the Core business  and bootstrapping happens here, though specified features will be
 * properly divided into respective classes. We're going for full-blown OOP here.
 * Let's try to make, and KEEP, this clean now!
 *
 * Lavenza hates dirty code. ;)
 */
export default class Core {

  /**
   * Return Lavenza's version.
   *
   * Remember to update this you nut!
   *
   * @returns {string}
   *   Value of the version, that's literally written right under this.
   */
  static get version() {
    return '0.2.2';
  }

  /**
   * IGNITE!
   *
   * This function starts the application. It runs all of the preparations, then runs the application after all
   * preparations are done.
   *
   * All tasks done in the PREPARATION phase are in the prepare() function.
   *
   * All tasks done in the EXECUTION phase are in the run() function.
   *
   * @returns {Promise.<void>}
   */
  static async ignite() {

    // Some flavor text for the console.
    Lavenza.status('INITIALIZING', [this.version]);

    // Fire necessary preparations.
    // The application can end here if we hit an error in the prep function.
    /** @catch Stop execution. */
    await this.prepare().catch(Lavenza.stop);

    // If preparations go through without problems, go for run tasks.
    // Run tasks should be done only after all prep is complete.
    /** @catch Stop execution. */
    await this.run().catch(Lavenza.stop);

  }

  /**
   * Application Run phase.
   *
   * All execution tasks are ran here.
   *
   * @returns {Promise.<void>}
   */
  static async run() {

    // Some more flavor.
    Lavenza.status('BOT_MANAGER_DEPLOY');

    // Deploy bots from the BotBunker.
    /** @catch Stop execution. */
    await BotManager.deploy().catch(Lavenza.stop);

    // Some more flavor.
    Lavenza.success('BOT_MANAGER_DEPLOYED');

  }

  /**
   * Application preparation phase.
   *
   * Make all necessary preparations before the application can run properly.
   *
   * This function should return a promise to make for some proper synchronous
   * execution. We don't want Lavenza doing run() before/while this executes.
   *
   * @returns {Promise.<void>}
   */
  static async prepare() {

    // Some more flavor.
    Lavenza.status('PREPARATION_PHASE');

    // Some more flavor.
    Lavenza.status('TALENT_MANAGER_PREP');

    // Run preparation functions for the Talent Manager.
    /** @catch Stop execution. */
    await TalentManager.prepare().catch(Lavenza.stop);

    // Some more flavor.
    Lavenza.success('TALENT_MANAGER_READY');

    // Some more flavor.
    Lavenza.status('BOT_MANAGER_PREP');

    // Run preparation functions for the Bot Manager.
    /** @catch Stop execution. */
    await BotManager.prepare().catch(Lavenza.stop);

    // Some more flavor.
    Lavenza.success('BOT_MANAGER_READY');

  }

}
