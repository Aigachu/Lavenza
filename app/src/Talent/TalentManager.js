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

    // Await the loading of core talents.
    /** @catch Stop execution. */
    await this.loadCoreTalents().catch(Lavenza.stop);

    // Some flavor text.
    Lavenza.status("Talent Manager preparations complete!");

  }

  /**
   * Auto-Load all talents found in the Core folder of the application.
   *
   * 'Core' talents are available to all bots and as such are loaded by default during the application's Preparation
   * phase. 'Custom' talents that can be developed outside of Lavenza are loaded on demand.
   *
   * @returns {Promise<void>}
   */
  static async loadCoreTalents() {

    // Initialize the property. We'll store all talents here.
    this.talents = {};

    // We fetch the list of all core talents here.
    /** @catch Stop execution. */
    let coreTalentDirectories = await Lavenza.Akechi.getDirectoriesFrom(Lavenza.Paths.TALENTS.CORE).catch(Lavenza.stop);

    // Await the loading of all talents found.
    /** @catch Stop execution. */
    await Promise.all(coreTalentDirectories.map(async directory => {

      // Await the loading of the talent into the TalentManager.
      /** @catch Stop execution. */
      await this.loadTalent(directory).catch(Lavenza.stop);

    })).catch(Lavenza.stop);

    // Set the list of core talents. This is simply the list of keys. Bots use this later.
    // Since we never actually store the reference to the Talents themselves in the bots, we need these keys.
    // We also need a way to easily get the list of all core talents, separate from the custom ones.
    this.coreTalentList = Object.keys(this.talents);

  }

  /**
   * Load a single talent into the TalentManager.
   *
   * With the given directory path, we parse the 'TALENT_NAME.info.yml' file and load the Talent class.
   *
   * @param {string} directory
   *   A string detailing the path to the Talent's directory.
   */
  static async loadTalent(directory) {

    // If this directory doesn't exist, we end right off the bat.
    if (!fs.existsSync(directory)) {
      let name = path.basename(directory);
      Lavenza.throw("Attempted to load {{talent}} talent, but it does not exist. Please verify talent configurations and make sure the name in configuration matches the name of the talent's folder.", {talent: name});
    }

    // Get the talent name. This is in fact the name of the directory.
    let name = path.basename(directory);

    // @TODO - The persona name should be checked for a specific format. Only snake_case should be accepted.

    // Get the info file for the talent.
    /** @catch Pocket error. */
    let configFilePath = directory + '/' + name + '.config.yml';
    let config = await Lavenza.Akechi.readYamlFile(configFilePath).catch(Lavenza.continue);

    // If the info is empty, we gotta stop here. They are mandatory.
    // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
    if (Lavenza.isEmpty(config)) {
      Lavenza.throw('Info file could not be located for the {{talent}} talent.', {talent: name});
    }

    // Set the directory to the info. It's useful information to have in the Talent itself!
    config.directory = directory;

    // Require the class.
    let talent = require(directory + '/' + config.class)['default'];

    // If the talent could not be loaded somehow, we end here.
    if (Lavenza.isEmpty(talent)) {
      Lavenza.throw("An error occurred when requiring the {{talent}} talent's class. Verify the Talent's info file.", {talent: name});
    }

    // Await building of the talent.
    // Talents have build tasks too and are also singletons. We'll run them here.
    /** @catch Stop execution. */
    await talent.build(config).catch(Lavenza.stop);

    // Register the talent to the Manager.
    this.talents[name] = talent;

  }
}