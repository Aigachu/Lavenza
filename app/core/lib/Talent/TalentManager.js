/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import path from 'path';
import fs from 'fs';

/**
 * Provides a Manager for Talents.
 *
 * 'Talents', in the context of this application, are bundles of functionality that can be granted to any given bot.
 *
 * Think of talents as..."Plugins" from Wordpress, or "Modules" from Drupal, or "Packages" from Laravel.
 *
 * The idea here is that bot features are coded in their own folders. The power here comes from the flexibility we have
 * since talents can be granted to multiple bots, and talents can be tracked in separate repositories if needed. Also,
 * they can easily be toggled on and off. Decoupling the features from the bots seemed like a good move.
 *
 * This Manager will load necessary talents, and make them available in the bots.
 */
export default class TalentManager {

  /**
   * Preparation handler for the TalentManager.
   *
   * This function will run all necessary preparations for this manager before it can be used.
   * @returns {Promise<void>}
   */
  static async prepare() {

    // Initialize variable that will store talents.
    this.talents = {};

  }

  /**
   * Checks whether a talent exists or not.
   *
   * This function will check the core directory first, and then check the custom directory.
   *
   * @param {string} key
   *   The name of the directory of the Talent.
   *
   * @returns {Promise<string>}
   *   Returns the path leading to the talent.
   */
  static async talentExists(key) {

    // Talents can either be provided by the Core framework, or custom-made.
    // First we check if this talent exists in the core directory.
    // Compute the path to the talent, should it exist in the core directory.
    let pathToCoreTalent = Lavenza.Paths.TALENTS.CORE + '/' + key;

    // If this directory exists, we can return with the path to it.
    if (fs.existsSync(pathToCoreTalent)) {
      return pathToCoreTalent;
    }

    // If we reach here, this means the talent was not found in the core directory.
    // Compute the path to the talent, should it exist in the custom directory.
    let pathToCustomTalent = Lavenza.Paths.TALENTS.CUSTOM + '/' + key;

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
   * With the given directory path, we parse the 'TALENT_NAME.info.yml' file and load the Talent class.
   *
   * @param {string} key
   *   A string detailing the path to the Talent's directory.
   */
  static async loadTalent(key) {

    // Check if the talent exists and return the path if it does.
    let talentDirectoryPath = await this.talentExists(key);

    // If this directory doesn't exist, we end right off the bat.
    if (!talentDirectoryPath) {
      await Lavenza.throw("Attempted to load {{talent}} talent, but it does not exist. Please verify talent configurations and make sure the name in configuration matches the name of the talent's folder.", {talent: key});
    }

    // Get the info file for the talent.
    /** @catch Pocket error. */
    let configFilePath = talentDirectoryPath + '/' + key + '.config.yml';
    let config = await Lavenza.Akechi.readYamlFile(configFilePath).catch(Lavenza.continue);

    // If the info is empty, we gotta stop here. They are mandatory.
    // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
    if (Lavenza.isEmpty(config)) {
      await Lavenza.throw('Info file could not be located for the {{talent}} talent.', {talent: key});
    }

    // Set the directory to the info. It's useful information to have in the Talent itself!
    config.directory = talentDirectoryPath;

    // Require the class.
    let talent = require(talentDirectoryPath + '/' + config.class)['default'];

    // If the talent could not be loaded somehow, we end here.
    if (Lavenza.isEmpty(talent)) {
      await Lavenza.throw("An error occurred when requiring the {{talent}} talent's class. Verify the Talent's info file.", {talent: key});
    }

    // Await building of the talent.
    // Talents have build tasks too and are also singletons. We'll run them here.
    await talent.build(config);

    // Register the talent to the Manager.
    this.talents[key] = talent;

  }
  
}