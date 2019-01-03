/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 *
 */

// Managers.
import BotManager from "./Bot/BotManager";
import TalentManager from "./Talent/TalentManager";
import Gestalt from "./Gestalt/Gestalt";

/**
 * Provides class for the Core of the Lavenza application.
 *
 * Most of the Core business and bootstrapping happens here, though specified features will be
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

    return "0.6.0";

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
   * @param {Array<string>} bots
   *   Array of ids of bots we want to load.
   *
   * @returns {Promise.<void>}
   */
  static async ignite(bots = undefined) {

    // If bots were provided, we set them here.
    // If a single bot name was given through a string, we set it in an array.
    this.bots = typeof bots === "string" ? [bots] : bots;

    // Some flavor text for the console.
    Lavenza.status("INITIALIZING", [this.version]);

    /*
     * Fire necessary preparations.
     * The application can end here if we hit an error in the prep function.
     */
    /** @catch Stop execution. */
    await this.prepare().catch(Lavenza.stop);

    /*
     * If preparations go through without problems, go for run tasks.
     * Run tasks should be done only after all prep is complete.
     */
    /** @catch Stop execution. */
    await this.run().catch(Lavenza.stop);

  }

  /**
   * Application preparation phase.
   *
   * Make all necessary preparations before the application can run properly.
   *
   * @returns {Promise.<void>}
   */
  static async prepare() {

    // Some flavor.
    Lavenza.status("PREPARATION_PHASE");

    // Some more flavor.
    Lavenza.status("GESTALT_PREP");

    /*
     * Run preparation handler for the Gestalt service.
     * We need to set all database management before we generate bots.
     */
    /** @catch Stop execution. */
    await Gestalt.prepare().catch(Lavenza.stop);

    // Some more flavor.
    Lavenza.status("GESTALT_READY");

    // Some more flavor.
    Lavenza.status("TALENT_MANAGER_PREP");

    // Run preparation functions for the Talent Manager.
    /** @catch Stop execution. */
    await TalentManager.prepare().catch(Lavenza.stop);

    // Some more flavor.
    Lavenza.status("TALENT_MANAGER_READY");

    // Some more flavor.
    Lavenza.status("BOT_MANAGER_PREP");

    // Run preparation functions for the Bot Manager.
    /** @catch Stop execution. */
    await BotManager.prepare().catch(Lavenza.stop);

    // Some more flavor.
    Lavenza.status("BOT_MANAGER_READY");

    // Some more flavor.
    Lavenza.status("GESTALT_BOOTSTRAP");

    /*
     * Run bootstrap handler for Gestalt.
     * This is the process that creates and syncs the database.
     */
    /** @catch Stop execution. */
    await Gestalt.bootstrap().catch(Lavenza.stop);

    // Some more flavor.
    Lavenza.status("GESTALT_READY");

    /*
     * Await Makoto's Preparation.
     * Makoto is the cooldown manager. She needs to be initialized here.
     * No announcements needed for this. She can prepare quietly.
     * @TODO - Manage this elsewhere.
     */
    /** @catch Stop execution. */
    Lavenza.Makoto.build().catch(Lavenza.stop);

    // Some more flavor.
    Lavenza.status("PREPARATION_PHASE_COMPLETE");

  }

  /**
   * Application Run phase.
   *
   * All execution tasks are ran here.
   *
   * @returns {Promise.<void>}
   *   Returns a promise when the function is successfully completed.
   */
  static async run() {

    // Some more flavor.
    Lavenza.status("EXECUTION_PHASE");

    // Some more flavor.
    Lavenza.status("BOT_MANAGER_DEPLOY");

    // Deploy bots from the BotBunker.
    /** @catch Stop execution. */
    await BotManager.deploy().catch(Lavenza.stop);

    // Some more flavor.
    Lavenza.status("BOT_MANAGER_DEPLOYED");

    // Some more flavor.
    Lavenza.status("EXECUTION_PHASE_COMPLETED");

  }

}
