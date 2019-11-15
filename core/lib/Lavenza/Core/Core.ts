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
import { BotManager } from "../Bot/BotManager";
import { Akechi } from "../Confidant/Akechi";
import { Morgana } from "../Confidant/Morgana";
import { Sojiro } from "../Confidant/Sojiro";
import { Yoshida } from "../Confidant/Yoshida";
import { Gestalt } from "../Gestalt/Gestalt";
import { EventSubscriber } from "../Service/EventSubscriber/EventSubscriber";
import { PluginSeeker } from "../Service/PluginSeeker/PluginSeeker";
import { RuntimeProcessId } from "../Service/RuntimeProcessId";
import { Service } from "../Service/Service";
import { ServiceContainer } from "../Service/ServiceContainer";
import { ServiceType } from "../Service/ServiceType";
import { TalentManager } from "../Talent/TalentManager";

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
   * Store the current status of the application.
   */
  public static status: CoreStatus = CoreStatus.sleep;

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
    await ServiceContainer.load(path.resolve(__dirname, "../core.services.yml"));

    // Return the core so we can chain functions.
    return Core;
  }

  /**
   * PERSONA!
   *
   * This function goes through the 4 main phases of execution in the application:
   *  - Genesis: The creation of base core functionalities and classes. Very primordial setup steps are in this phase.
   *  - Synthesis: Linking of various parts of the application.
   *  - Statis: Stabilization and database connections and initializations.
   *  - Symbiosis: The final stage where everything runs in harmony!
   *
   * Services are used to manage all of these steps and isolate functionality intotheir own environments.
   *
   * Refer to "core.services.yml" for a list of services declared in Lavenza, as well as their runtime order.
   */
  public static async summon(): Promise<void> {
    // If settings aren't set, it means that initialization was bypassed. We can't allow that.
    if (Sojiro.isEmpty(Core.settings)) {
      return;
    }

    // Set the core status to "GENESIS" & perform genesis tasks for all services.
    Core.status = CoreStatus.genesis;
    await ServiceContainer.tasks(RuntimeProcessId.genesis);

    // Set the core status to "SYNTHESIS" & perform synthesis tasks for all services
    Core.status = CoreStatus.synthesis;
    await ServiceContainer.tasks(RuntimeProcessId.synthesis);

    // Set the core status to "STATIS" & perform statis tasks for all services.
    Core.status = CoreStatus.statis;
    await ServiceContainer.tasks(RuntimeProcessId.statis);

    // Set the core status to "SYMBIOSYS" & perform symbiosis tasks for all services.
    Core.status = CoreStatus.symbiosis;
    await ServiceContainer.tasks(RuntimeProcessId.symbiosis);

    // Set the core status to "RUNNING".
    Core.status = CoreStatus.running;

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
   * Obtain Gestalt service.
   *
   * @return
   *   The Gestalt databse service.
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
