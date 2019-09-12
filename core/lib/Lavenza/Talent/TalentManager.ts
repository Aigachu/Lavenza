/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as fs from 'fs';

// Imports.
import Core from "../Core/Core";
import Akechi from '../Confidant/Akechi';
import Sojiro from '../Confidant/Sojiro';
import Igor from '../Confidant/Igor';
import Morgana from "../Confidant/Morgana";
import Gestalt from "../Gestalt/Gestalt";
import Talent from "./Talent";
import {TalentConfigurations} from "./TalentConfigurations";
import {AssociativeObject} from "../Types";

/**
 * Provides a Manager for Talents.
 *
 * This is a STATIC CLASS and will never be instantiated.
 *
 * 'Talents', in the context of this application, are bundles of functionality that can be granted to any bot.
 *
 * Think of talents as..."Plugins" from Wordpress, or "Modules" from Drupal, or "Packages" from Laravel.
 *
 * The idea here is that bot features are coded in their own folders. The power here comes from the flexibility we have
 * since talents can be granted to multiple bots, and talents can be tracked in separate repositories if needed. Also,
 * they can easily be toggled on and off.
 *
 * Decoupling the features from the bots seemed like a good move.
 *
 * This Manager will load necessary talents, and make them available in the bots.
 */
export default class TalentManager {

  /**
   * Object to store the list of talents in the application.
   */
  public static talents: AssociativeObject<Talent> = {};

  /**
   * This is a static class. The constructor will never be used.
   */
  private constructor() {}

  /**
   * Build handler for the TalentManager.
   *
   * This function will run all necessary preparations for this manager before it can be used.
   */
  static async build() {
    // Do nothing...For now!
  }

  /**
   * Perform bootstrapping tasks for Database for all talents.
   */
  static async gestalt() {
    // Some flavor.
    await Morgana.status("Running Gestalt bootstrap process for the Talent Manager...");

    // Creation of the Talents collection.
    await Gestalt.createCollection('/talents');

    // Run Gestalt handlers for each Talent.
    await Promise.all(Object.keys(TalentManager.talents).map(async machineName => {
      let talent: Talent = await TalentManager.getTalent(machineName);
      await talent.gestalt();
    }));

    // Some flavor.
    await Morgana.status("Gestalt bootstrap process complete for the Talent Manager!");
  }

  /**
   * Retrieve a Talent from the manager.
   *
   * @param machineName
   *   Machine name of the Talent we want to retrieve.
   */
  static async getTalent(machineName: string): Promise<Talent> {
    return TalentManager.talents[machineName];
  }

  /**
   * Get the path to a Talent's folder given a unique key.
   *
   * This function will check the core talents directory first, and then check the custom talents directory afterwards.
   *
   * @param name
   *   The name of the talent. This name is the unique identifier of the Talent, and all in lowercase.
   *   As per standards, it will also be the name of the directory of this Talent.
   *
   * @returns
   *   The path to the talent if found, undefined otherwise.
   */
  static async getTalentPath(name: string): Promise<string|undefined> {
    // Talents can either be provided by the Core framework, or custom-made.
    // First we check if this talent exists in the core directory.
    // Compute the path to the talent, should it exist in the core directory.
    let pathToCoreTalent = Core.paths.talents.core + '/' + name;

    // If this directory exists, we can return with the path to it.
    if (fs.existsSync(pathToCoreTalent)) {
      return pathToCoreTalent;
    }

    // If we reach here, this means the talent was not found in the core directory.
    // Compute the path to the talent, should it exist in the custom directory.
    let pathToCustomTalent = Core.paths.talents.custom + '/' + name;

    // If this directory exists, we can return with the path to it.
    if (fs.existsSync(pathToCustomTalent)) {
      return pathToCustomTalent;
    }

    // If the talent was not found, we return undefined.
    return undefined;
  }

  /**
   * Load a single talent into the TalentManager.
   *
   * With the given directory path, we parse the 'config.yml' file and load the Talent class.
   *
   * @param name
   *   The identifier of the talent that we want to load. As per standards, it shares the name of the directory of the
   *   Talent that will be loaded.
   */
  static async loadTalent(name: string) {
    // Check if the talent exists and return the path if it does.
    let talentDirectoryPath = await TalentManager.getTalentPath(name);

    // If this directory doesn't exist, we end right off the bat.
    if (!talentDirectoryPath) {
      await Igor.throw("Attempted to load {{talent}} talent, but it does not exist.", {talent: name});
    }

    // Get the info file for the talent.
    let configFilePath = talentDirectoryPath + '/config.yml';
    let config: TalentConfigurations = await Akechi.readYamlFile(configFilePath).catch(Igor.continue);

    // If the info is empty, we gotta stop here. They are mandatory.
    if (Sojiro.isEmpty(config)) {
      await Igor.throw('Configuration file could not be located for the {{talent}} talent.', {talent: name});
    }

    // Set the directory to the info. It's useful information to have in the Talent itself!
    config.directory = talentDirectoryPath;

    // Require the class and instantiate the Talent.
    let talent = require(talentDirectoryPath + '/' + config.class)['default'];
    talent = new talent();

    // If the talent could not be loaded somehow, we end here.
    if (!talent) {
      await Igor.throw("An error occurred when requiring the {{talent}} talent's class. Verify the Talent's info file.", {talent: name});
    }

    // Await building of the talent.
    // Talents have build tasks too that must be done asynchronously. We'll run them here.
    await talent.build(config);

    // Register the talent to the Manager for future use.
    TalentManager.talents[name] = talent;
  }
  
}