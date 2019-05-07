/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 *
 */

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
   * @TODO - I mean IDEALLY, we wouldn't have to update this each time. Honestly though, why do you even need this?
   *
   * @returns {string}
   *   Value of the version, that's literally written right under this.
   */
  static get version() {

    return "1.2.0";

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
    await Lavenza.warn("Initializing Lavenza (v{{version}})...", {version: this.version});

    // Separation.
    await Lavenza.warn("-----------------------------------------------------------");

    // We'll read the settings file if it exists and load settings into our class.
    let pathToSettings = Lavenza.Paths.BOTS + '/settings.yml';
    if (!Lavenza.Akechi.fileExists(pathToSettings)) {
      await Lavenza.throw(`The settings.yml file does not seem to exist in '/app/bots/settings.yml'. Please create this file using the example file found at the same location.`);
    }

    // Set settings values to the class.
    this.settings = await Lavenza.Akechi.readYamlFile(pathToSettings);

    // If a master isn't set, we shouldn't continue. A master bot must set.
    if (Lavenza.isEmpty(this.settings['master'])) {
      await Lavenza.throw(`There is no master bot set in your settings.yml file. A master bot must be set so the application knows which bot manages the rest. Refer to the settings.example.yml file for more details.`);
    }

    /*
     * Fire necessary preparations.
     * The application can end here if we hit an error in the prepare() function.
     */
    await this.prepare().catch(Lavenza.stop);

    /*
     * If preparations go through without problems, go for run tasks.
     * Run tasks should be done only after all prep is complete.
     */
    await this.run().catch(Lavenza.stop);

  }

  /**
   * Getter for the settings property of the class.
   *
   * @returns {Promise<*>}
   */
  static async getSettings() {
    return this.settings;
  }

  /**
   * Run all preparation tasks.
   *
   * This involves reading and parsing bot files, talent files and commands. Database preparations and instances are
   * also prepared here.
   *
   * @returns {Promise.<void>}
   */
  static async prepare() {

    // Some flavor.
    Lavenza.status("Commencing Lavenza's preparatory tasks!");

    /*
     * Run preparation handler for the Gestalt service.
     * We need to set up the database first and foremost.
     */
    await Lavenza.Gestalt.prepare();

    // Run preparation functions for the Talent Manager.
    await Lavenza.TalentManager.prepare();

    // Run preparation functions for the Bot Manager.
    await Lavenza.BotManager.prepare();

    /*
     * Run bootstrap handler for Gestalt.
     * This is the process that makes sure all database collections that should exist, do exist.
     */
    await Lavenza.Gestalt.bootstrap();

    /*
     * Await Makoto's Preparation.
     * Makoto is the cooldown manager. She needs to be initialized here.
     * No announcements needed for this. She can prepare quietly.
     * @TODO - Manage this elsewhere.
     */
    await Lavenza.Makoto.build();

    // Some more flavor.
    await Lavenza.success("Preparations complete. Moving on to execution...");

    // Separation.
    await Lavenza.warn("-----------------------------------------------------------");

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
    Lavenza.status("Commencing Lavenza's execution phase!");

    // Deploy bots from the BotManager.
    await Lavenza.BotManager.run();

    // Separation.
    await Lavenza.warn("-----------------------------------------------------------");

  }

}
