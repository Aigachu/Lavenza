/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 *
 */

// Managers.
import BotManager from '../Bot/BotManager';
import TalentManager from '../Talent/TalentManager';

/**
 * Provides class for the Core of the Lavenza application.
 *
 * Most of the Core business happens here, though specified features will be
 * properly divided into respective classes. We're going for full-blown OOP
 * here. Let's try to make, and KEEP, this clean now!
 *
 * Lavenza hates dirty code. ;)
 */
export default class Core {

  // Lavenza's Version.
  // Remember to increment this you bean!
  static get version() {
    return '0.0.1';
  }

  /**
   * Function that starts it all!
   *
   * That's why it's called ignite...
   *
   * This function simply handles all preparation and launching.
   *
   */
  static async ignite() {

    // Some flavor text for the console.
    Lavenza.status('INITIALIZING', [this.version]);

    // Fire necessary preparations.
    // The application can end here if we hit an error in the prep function.
    await this.prepare().catch(Lavenza.stop);

    // If preparations go through without problems, go for run tasks.
    // Run tasks should be done only after all prep is complete.
    await this.run().catch(Lavenza.stop);

    // If everything runs smoothly, return true.
    return true;

  }

  /**
   * Run all necessary software.
   */
  static async run() {
    // Deploy bots from the BotBunker.
    await BotManager.deploy().catch(Lavenza.stop);
  }

  /**
   * Make all necessary preparations before the application can run properly.
   *
   * This function should return a promise to make for some proper synchronous
   * execution. We don't want Lavenza doing run() before/while this executes.
   */
  static async prepare() {

    // Some more flavor.
    Lavenza.log('BEGINNING_PREP');

    // Run preparation functions for the Talent Manager.
    await TalentManager.prepare().catch(Lavenza.stop);

    // Some more flavor.
    Lavenza.log('Talent Manager Ready.');

    // Run preparation functions for the Bot Manager.
    await BotManager.prepare().catch(Lavenza.stop);

    // Some more flavor.
    Lavenza.log('Bot Manager Ready.');

  }

}
