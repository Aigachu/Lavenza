/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 *
 */

// Modules.
import * as path from "path";
import * as prompts from "prompts";

// Imports.
import * as PackageInfo from "../../../../package.json";
import { BotManager } from "../Bot/Service/BotManager";
import { Akechi } from "../Confidant/Akechi";
import { Igor } from "../Confidant/Igor";
import { Morgana } from "../Confidant/Morgana";
import { Sojiro } from "../Confidant/Sojiro";
import { Yoshida } from "../Confidant/Yoshida";
import { Gestalt } from "../Service/Gestalt/Gestalt";
import { Service } from "../Service/Service";
import { ServiceContainer } from "../Service/ServiceContainer";
import { ServiceType } from "../Service/ServiceType";
import { TalentCatalogue } from "../Talent/Service/TalentCatalogue";
import { TalentManager } from "../Talent/Service/TalentManager";

import { CoreSettings } from "./CoreSettings";

/**
 * Provides class for the Core of the Lavenza application.
 *
 * Most of the Core business and bootstrapping happens here, though specified features will be
 * properly divided into respective classes. We're going for full-blown OOP here.
 * Let's try to make, and KEEP, this clean now!
 *
 * Lavenza hates dirty code. ;)
 */
export class Core {

  /**
   * Stores the relevant paths used by the application.
   *
   * These paths are generated when the package is used and initiated with an appropriate directory.
   */
  public static paths: {

    /**
     * Path to the bots folder that Lavenza will load.
     */
    bots: string;

    /**
     * Path to the file database storage root.
     */
    database: string;

    /**
     * Path to the root of the application.
     *
     * This path will lead to the application root and not necessarily this package's root.
     */
    root: string;

    /**
     * Paths to Talent directories.
     */
    talents: {

      /**
       * Path to the Core Talents directory.
       */
      core: string;

      /**
       * Path to the Custom Talents directory.
       */
      custom: string;

    };
  };

  /**
   * Store Core settings of the application.
   */
  public static settings: CoreSettings;

  /**
   * Stores Lavenza's version.
   * The version number is obtained from the 'package.json' file at the root of the project.
   */
  private static version: string = PackageInfo.version;

  /**
   * Initialize Lavenza's configurations with the specified path.
   *
   * With the provided path, we will tell the rest of the code where to look for important files. Projects that
   * inherit Lavenza will need to create relevant files that are needed to use the framework.
   *
   * By default, we get the path to the entrypoint script of the module that called Lavenza.
   */
  public static async initialize(root: string = path.dirname(require.main.filename)): Promise<Core> {
    // Some flavor text for the console.
    await Morgana.success(`Initializing (v${Core.version})...`);

    // Path to the Lavenzafile.
    const pathToLavenzafile = `${root}/.lavenza.yml`;

    // Variable to store the path to the framework installation in the module that is calling Lavenza.
    let pathToLavenzaInstallation;

    // Check if the .lavenza.yml file exists at this path.
    if (await Akechi.fileExists(`${root}/.lavenza.yml`)) {
      // Set settings values to the class.
      Core.settings = await Akechi.readYamlFile(pathToLavenzafile) as CoreSettings;
      pathToLavenzaInstallation = `${root}/${Core.settings.root}`;
    } else {
      await Morgana.warn(`A Lavenzafile could not be located at "${root}". Use the "lavenza init" command to initialize the base config file and set this up.`);
      process.exit(1);
    }

    // So first, we want to check if the provided path exists.
    // We're already going to start making use of our Confidants here! Woo!
    if (!Akechi.isDirectory(pathToLavenzaInstallation)) {
      await Morgana.warn(`The path configured (${pathToLavenzaInstallation}) doesn't lead to a valid Lavenza installation directory.`);

      // Start a prompt to see if user would like to generate a basic Desk.
      await Morgana.warn("Would you like to generate an installation at this path?");
      const {confirmation} = await prompts(
        {
          initial: true,
          message: "Yes or no (Y/N) ?",
          name: "confirmation",
          type: "confirm",
        });

      // If they agree, copy the basic desk to their desired location.
      if (confirmation) {
        await Akechi.copyFiles(path.resolve(__dirname, "../../../templates/installation"), pathToLavenzaInstallation);
        await Morgana.success("An installation has been generated at the provided path. You may configure it and try running Lavenza again!");
      }

      await Morgana.error("Until an installation is properly configured, Lavenza will not run properly. Please refer to the guides in the README to configure Lavenza.");
      process.exit(1);
    }

    // Using the provided path, we set the relevant paths to the Core.
    await Core.setPaths(pathToLavenzaInstallation);

    // Initialize Yoshida's translation options since we'll be using them throughout the application.
    await Yoshida.initializeI18N();

    // If a master isn't set, we shouldn't continue. A master bot must set.
    if (Sojiro.isEmpty(Core.settings.config.bots.master)) {
      await Morgana.error("There is no master bot set in your Lavenzafile. A master bot must be set so the application knows which bot manages everything!");
      process.exit(1);
    }

    // If a master bot is set but doesn't exist, we shouldn't continue either.
    if (!await Akechi.directoryExists(`${Core.paths.bots}/${Core.settings.config.bots.master}`)) {
      await Morgana.error(`The configured master bot, "${Core.settings.config.bots.master}", does not exist. Run "lavenza provision" or "lavenza generate bot ${Core.settings.config.bots.master}" to fix this.`);
      await Morgana.error("It is highly recommended to run \"lavenza provision\" to make sure that everything is configured correctly!");
      process.exit(1);
    }

    // Now we'll perform core service loading.
    await ServiceContainer.load(path.resolve(__dirname, "../lavenza.services.yml"));

    // Return the core so we can chain functions.
    return Core;
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
  public static async summon(): Promise<void> {
    // If settings aren't set, it means that initialization was bypassed. We can't allow that.
    if (Sojiro.isEmpty(Core.settings)) {
      return;
    }

    /*
     * Fire genesis tasks.
     *
     * This is the primordial phase of Lavenza's execution.
     */
    await Core.genesis().catch(Igor.stop);

    /*
     * Fire build tasks.
     *
     * This is the first phase of Lavenza's execution.
     */
    await Core.build().catch(Igor.stop);

    /*
    * Fire arrangements.
    *
    * This is the second phase of Lavenza's execution.
    */
    await Core.arrange().catch(Igor.stop);

    /*
     * Start running.
     *
     * This is the final phase, concluding the execution of Lavenza.
     */
    await Core.run().catch(Igor.stop);

    // Some more flavor text.
    await Morgana.success("Lavenza should now be running! Scroll up in the logs to see if any errors occurred and handle them as needed. :)");
  }

  /**
   * Fetch a service from the Service Container.
   */
  public static service<S extends Service>(id: ServiceType<S> | string): S {
    // Find the service through the Service Container.
    return ServiceContainer.get(id);
  }

  /**
   * Obtain Gestalt.
   *
   * @return
   *   The Gestalt service.
   */
  public static gestalt(): Gestalt {
    return Core.service(Gestalt);
  }

  /**
   * Obtain BotManager from Services.
   *
   * @return
   *   The Bot Catalogue.
   */
  public static botManager(): BotManager {
    return Core.service(BotManager);
  }

  /**
   * Obtain BotManager from Services.
   *
   * @return
   *   The Bot Catalogue.
   */
  public static talentManager(): TalentManager {
    return Core.service(TalentManager);
  }

  /**
   * Run all genesis tasks.
   *
   * This involves:
   *  - Loading all defined PRIMORDIAL services.
   *  - Loading talents and their defined services.
   *  - Running all genesis tasks for these services.
   *
   *  The order in which Services run their build() functions is determined by the 'priority' key for each Service,
   *  defined in the definition file.
   */
  private static async genesis(): Promise<void> {
    // Some more flavor text.
    await Morgana.status("BEGIN PHASE 0 - GENESIS");

    // Now we'll perform genesis tasks for all primordial services after sorting them appropriately.
    await ServiceContainer.services.sort(Service.prioritySortGenesis);
    for (const service of ServiceContainer.services) {
      if (service.primordial === true) {
        await service.genesis();
      }
    }

    // Some more flavor.
    await Morgana.success("GENESIS COMPLETED SUCCESSFULLY");
  }

  /**
   * Run all build tasks.
   *
   * This involves:
   *  - Loading all defined services for the Core.
   *  - Running build() function tasks for all loaded Services.
   *
   *  The order in which Services run their build() functions is determined by the 'priority' key for each Service,
   *  defined in the definition file.
   */
  private static async build(): Promise<void> {
    // Some more flavor text.
    await Morgana.status("BEGIN PHASE 1 - BUILD");

    // Now we'll perform build tasks for all services after sorting them appropriately.
    await ServiceContainer.services.sort(Service.prioritySortGenesis);
    for (const service of ServiceContainer.services) {
      await service.build();
    }

    // Some more flavor.
    await Morgana.success("BUILD COMPLETED SUCCESSFULLY");
  }

  /**
   * Run all arrangement tasks.
   *
   * This involves:
   *  - Loading all defined services for the Core.
   *  - Running arrange() function tasks for all loaded Services.
   *
   * The order in which Services run their arrange() functions is determined by the 'priority' key for each Service,
   * defined in the definition file.
   */
  private static async arrange(): Promise<void> {
    // Some more flavor text.
    await Morgana.status("BEGIN PHASE 2 - ARRANGEMENTS");

    // Now we'll perform arrangement tasks for all services after sorting them appropriately.
    await ServiceContainer.services.sort(Service.prioritySortGenesis);
    for (const service of ServiceContainer.services) {
      await console.log(`Running arrangement tasks for Service: ${service.id}.`);
      await service.arrange();
    }

    process.exit(1);

    // Some more flavor.
    await Morgana.success("ARRANGEMENTS COMPLETED SUCCESSFULLY");
  }

  /**
   * Run all execution tasks.
   *
   * This involves:
   *  - Authenticating all bots.
   *
   * The order in which Services run their run() functions is determined by the 'priority' key for each Service,
   * defined in the definition file.
   */
  private static async run(): Promise<void> {
    // Some more flavor text.
    await Morgana.status("BEGIN FINAL PHASE - EXECUTION");

    // Now we'll perform execution tasks for all services after sorting them appropriately.
    await ServiceContainer.services.sort(Service.prioritySortGenesis);
    for (const service of ServiceContainer.services) {
      await console.log(`Running execution tasks for Service: ${service.id}.`);
      await service.run();
    }

    process.exit(1);
  }

  /**
   * Setup paths and assign them to the Core.
   *
   * @param rootPath
   *   The provided root path to base ourselves on.
   */
  private static async setPaths(rootPath: string): Promise<void> {
    Core.paths = {
      bots: `${rootPath}/bots`,
      database: `${rootPath}/database`,
      root: rootPath,
      talents: {
        core: path.resolve(__dirname, "../../../talents"),
        custom: `${rootPath}/talents`,
      },
    };
  }

}
