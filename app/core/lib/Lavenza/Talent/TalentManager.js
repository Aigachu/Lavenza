/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
const path = require('path');
const fs = require('fs');

// Imports.
const Akechi = require('../Confidants/Akechi');
const Morgana = require('../Confidants/Morgana');
const Sojiro = require('../Confidants/Sojiro');
const Igor = require('../Confidants/Igor');
const StaticClass = require('../Model/StaticClass');

/**
 * Provides a Manager for Talents.
 *
 * This is a STATIC CLASS and will never be instantiated.
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
module.exports = class TalentManager extends StaticClass {

  /**
   * Build handler for the TalentManager.
   *
   * This function will run all necessary preparations for this manager before it can be used.
   *
   * @param {Core} core
   *   Core of the application passed through Dependency Injection.
   */
  static async build(core) {
    // Initialize variable that will store talents.
    this.core = core;
    this.talents = {};
  }

  /**
   * Get the path to a Talent's folder given a unique key.
   *
   * This function will check the core talents directory first, and then check the custom talents directory afterwards.
   *
   * @param {string} key
   *   The name of the directory of the Talent.
   *
   * @returns {Promise<string>}
   *   Returns the path leading to the talent.
   */
  static async getTalentPath(key) {
    // Talents can either be provided by the Core framework, or custom-made.
    // First we check if this talent exists in the core directory.
    // Compute the path to the talent, should it exist in the core directory.
    let pathToCoreTalent = this.core.paths.talents.core + '/' + key;

    // If this directory exists, we can return with the path to it.
    if (fs.existsSync(pathToCoreTalent)) {
      return pathToCoreTalent;
    }

    // If we reach here, this means the talent was not found in the core directory.
    // Compute the path to the talent, should it exist in the custom directory.
    let pathToCustomTalent = this.core.paths.talents.custom + '/' + key;

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
   * @param {string} key
   *   A string detailing the path to the Talent's directory.
   */
  static async loadTalent(key) {
    // Check if the talent exists and return the path if it does.
    let talentDirectoryPath = await this.getTalentPath(key);

    // If this directory doesn't exist, we end right off the bat.
    if (!talentDirectoryPath) {
      await Igor.throw("Attempted to load {{talent}} talent, but it does not exist.", {talent: key});
    }

    // Get the info file for the talent.
    let configFilePath = talentDirectoryPath + '/config.yml';
    let config = await Akechi.readYamlFile(configFilePath).catch(Igor.continue);

    // If the info is empty, we gotta stop here. They are mandatory.
    // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
    if (Sojiro.isEmpty(config)) {
      await Morgana.throw('Configuration file could not be located for the {{talent}} talent.', {talent: key});
    }

    // Set the directory to the info. It's useful information to have in the Talent itself!
    config.directory = talentDirectoryPath;

    // Require the class and instantiate the Talent.
    let talent = require(talentDirectoryPath + '/' + config.class)['default'];
    talent = new talent();

    // If the talent could not be loaded somehow, we end here.
    if (Sojiro.isEmpty(talent)) {
      await Igor.throw("An error occurred when requiring the {{talent}} talent's class. Verify the Talent's info file.", {talent: key});
    }

    // Await building of the talent.
    // Talents have build tasks too that must be done asynchronously. We'll run them here.
    await talent.build(config);

    // Register the talent to the Manager for future use.
    this.talents[key] = talent;
  }
  
};