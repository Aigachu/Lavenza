/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 *
 */

// Modules.
import arp from 'app-root-path';

// Imports.
import Gestalt from '../Gestalt/Gestalt';
import TalentManager from '../Talent/TalentManager';
import BotManager from '../Bot/BotManager';
import Akechi from '../Confidant/Akechi';
import Morgana from '../Confidant/Morgana';
import Makoto from '../Confidant/Makoto';
import Sojiro from '../Confidant/Sojiro';
import Igor from '../Confidant/Igor';
import CoreSettings from "./CoreSettings";

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
   * Stores Lavenza's version.
   * The version number is obtained from the 'package.json' file at the root of the project.
   */
  private static version: string = require(arp.path + '/package').version;

  /**
   * Stores the relevant paths used by the application.
   *
   * These paths are generated when the package is used and initiated with an appropriate directory.
   */
  public static paths: {
    bots: string;
    database: string;
    root: any;
    talents: {
      core: string;
      custom: string
    }
  };

  /**
   * Store Core settings of the application.
   */
  public static settings: CoreSettings;

  /**
   * This is a static class. The constructor will never be used.
   */
  private constructor() {}

  /**
   * Initialize Lavenza's configurations with the specified path.
   *
   * With the provided path, we will tell the rest of the code where to look for important files. Projects that
   * inherit Lavenza will need to create relevant files that are needed to use the framework.
   *
   * @param rootPath
   *   Path to the directory where Lavenza files are stored.
   */
  static async init(rootPath: string) {
    // Using the provided path, we set the relevant paths to the Core.
    this.paths = {
      root: rootPath,
      bots: rootPath + '/bots',
      talents: {
        core: arp.path + '/core/talents',
        custom: rootPath + '/talents'
      },
      database: rootPath + '/database'
    };
  }

  /**
   * IGNITE!
   *
   * This function starts the application. It runs all of the preparations, then runs the application afterwards.
   *
   * All tasks done in the PREPARATION phase are in the build() function.
   *
   * All tasks done in the EXECUTION phase are in the run() function.
   */
  static async ignite() {
    // Some flavor text for the console.
    await Morgana.warn("Initializing Lavenza (v{{version}})...", {version: this.version});

    // Separation.
    await Morgana.warn("-----------------------------------------------------------");

    // We'll read the settings file if it exists and load settings into our class.
    let pathToSettings = this.paths.root + '/settings.yml';
    if (!Akechi.fileExists(pathToSettings)) {
      await Igor.throw(`The settings.yml file does not seem to exist in ${pathToSettings}. Please create this file using the example file found at the same location.`);
    }

    // Set settings values to the class.
    this.settings = await Akechi.readYamlFile(pathToSettings);

    // If a master isn't set, we shouldn't continue. A master bot must set.
    if (Sojiro.isEmpty(this.settings.master)) {
      await Igor.throw(`There is no master bot set in your settings.yml file. A master bot must be set so the application knows which bot manages the rest. Refer to the settings.example.yml file for more details.`);
    }

    /*
     * Fire necessary preparations.
     * The application can end here if we hit an error in the build() function.
     */
    await this.build().catch(Igor.stop);

    /*
     * If preparations go through without problems, go for run tasks.
     * Run tasks should be done only after all prep is complete.
     */
    await this.run().catch(Igor.stop);
  }

  /**
   * Run all build tasks.
   *
   * This involves reading and parsing bot files, talent files and command files. Database preparations and instances
   * are also prepared here.
   */
  static async build() {
    // Some more flavor text.
    await Morgana.status("Commencing Lavenza's preparatory tasks!");

    /*
     * Run build handler for the Gestalt service.
     * We need to set up the database first and foremost.
     */
    await Gestalt.build();

    /**
     * Run build functions for the Talent Manager.
     * This will load all talents from the 'talents' folder and prepare them accordingly.
     */
    await TalentManager.build();

    /**
     * Run build functions for the Bot Manager.
     * This will load all bots and prepare their data before they connect to their clients.
     * Each bot may undergo tasks specific to Talents they have.
     */
    await BotManager.build();

    /*
     * Run bootstrap handler for Gestalt.
     * Creates & verifies database tables/files.
     */
    await Gestalt.bootstrap();

    /*
     * Await Makoto's Preparation.
     * Makoto is the cooldown manager. She needs to be initialized here.
     * No announcements needed for this. She can prepare quietly.
     * @TODO - Manage this elsewhere...She shouldn't have to be initiated here honestly.
     */
    await Makoto.build();

    // Some more flavor.
    await Morgana.success("Preparations complete. Moving on to execution...");

    // Separation.
    await Morgana.warn("-----------------------------------------------------------");
  }

  /**
   * Application Run phase.
   *
   * All execution tasks are ran here.
   */
  static async run() {
    // Some more flavor.
    await Morgana.status("Commencing Lavenza's execution phase!");

    // Deploy bots from the BotManager.
    // All bots set to run will be online after this executes.
    await BotManager.run();

    // Separation.
    await Morgana.warn("-----------------------------------------------------------");
  }

}
