/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 *
 */

// Modules.
import * as arp from 'app-root-path';
import * as prompt from 'prompt-async';

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
import Yoshida from "../Confidant/Yoshida";

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
  static async initialize(rootPath: string) {
    // Some flavor text for the console.
    await Morgana.warn(`Initializing (v${Core.version})...`);

    // So first, we want to check if the provided path exists.
    // We're already going to start making use of our Confidants here! Woo!
    if (! await Akechi.isDirectory(rootPath)) {
      await Morgana.warn(`The Desk path provided in the initialize() function (${rootPath}) doesn't lead to a valid directory.`);

      // Start a prompt to see if user would like to generate a basic Desk.
      await Morgana.warn(`Would you like to generate a basic Desk at this path?`);
      await prompt.start();
      const {confirmation} = await prompt.get({
        properties: {
          confirmation: {
            description: 'Yes or no (Y/N)',
            type: 'string',
            default: 'y',
          }
        }
      });

      // If they agree, copy the basic desk to their desired location.
      if (confirmation.startsWith('y')) {
        await Akechi.copyFiles(arp.path, rootPath);
        await Morgana.success(`A Desk structure has been generated at the provided path. You may configure it and try running Lavenza again!`);
      }

      await Morgana.error('Until a Desk is properly configured, Lavenza will not run. Please refer to the guides in the README to configure the Desk.');
      process.exit(1);
    }

    // Using the provided path, we set the relevant paths to the Core.
    await Core.setPaths(rootPath);

    // Initialize Yoshida's translation options since we'll be using them throughout the application.
    await Yoshida.initializeI18N();

    // We'll read the settings file if it exists and load settings into our class.
    let pathToSettings = Core.paths.root + '/settings.yml';
    if (!Akechi.fileExists(pathToSettings)) {
      await Morgana.error(`The settings.yml file does not seem to exist in ${pathToSettings}. Please create this file using the example file found at the same location.`);
      process.exit(1);
    }

    // Set settings values to the class.
    Core.settings = await Akechi.readYamlFile(pathToSettings);

    // If a master isn't set, we shouldn't continue. A master bot must set.
    if (Sojiro.isEmpty(Core.settings.master)) {
      await Morgana.error(`There is no master bot set in your settings.yml file. A master bot must be set so the application knows which bot manages everythingx. Refer to the settings.example.yml file for more details.`);
      process.exit(1);
    }

    // Return the core so we can chain functions.
    return Core;
  }

  /**
   * Setup paths and assign them to the Core.
   *
   * @param rootPath
   *   The provided root path to base ourselves on.
   */
  static async setPaths(rootPath: string) {
    Core.paths = {
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
   * PERSONA!
   *
   * This function starts the application. It runs all of the preparations, then runs the application afterwards.
   *
   * All tasks done in the PREPARATION phase are in the build() function.
   *
   * All tasks done in the EXECUTION phase are in the run() function.
   */
  static async summon() {
    // If settings aren't set, it means that initialization was bypassed. We can't allow that.
    if (Sojiro.isEmpty(Core.settings)) {
      return;
    }

    /*
     * Fire necessary preparations.
     * The application can end here if we hit an error in the build() function.
     */
    await Core.build().catch(Igor.stop);

    /*
     * If preparations go through without problems, go for run tasks.
     * Run tasks should be done only after all prep is complete.
     */
    await Core.run().catch(Igor.stop);
  }

  /**
   * Run all build tasks.
   *
   * This involves reading and parsing bot files, talent files and command files. Database preparations and instances
   * are also prepared here.
   */
  static async build() {
    // Some more flavor text.
    await Morgana.status("Commencing preparatory tasks!");

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
    await Morgana.success("Preparations complete.");
  }

  /**
   * Application Run phase.
   *
   * All execution tasks are ran here.
   */
  static async run() {
    // Some more flavor.
    await Morgana.status("Commencing execution phase!");

    // Deploy bots from the BotManager.
    // All bots set to run will be online after this executes.
    await BotManager.run();
  }

}
