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
 * Another name for this could be TalentManager.
 */
export default class TalentManager {

  /**
   * Preparation handler for the TalentManager.
   * @returns {Promise<void>}
   */
  static async prepare() {
    await this.loadCoreTalents().catch(Lavenza.continue);
  }

  static async loadCoreTalents() {
    this.talents = {};
    this.talents.core = {};
    this.talents.custom = {};
    this.talents.all = {};

    Lavenza.status('START_TALENT_LOAD');
    let coreTalentDirectories = await Lavenza.Akechi.getDirectoriesFrom(Lavenza.Paths.TALENTS.CORE).catch(Lavenza.continue);

    await Promise.all(coreTalentDirectories.map(async directory => {
      // Get the talent name. This is in fact the name of the directory.
      let name = path.basename(directory);
      await this.loadTalent(directory, 'core').catch(Lavenza.stop);
      Lavenza.success('CORE_TALENT_LOADED', [name]);
    })).catch(Lavenza.stop);

    this.coreTalentList = Object.keys(this.talents.core);

  }

  static async loadTalent(directory, type = 'custom') {

    // Get the persona name. This is in fact the name of the directory.
    let name = path.basename(directory);

    // Check if this directory exists.
    if (!fs.existsSync(directory)) {
      Lavenza.warn('TALENT_DOES_NOT_EXIST', [name]);
      return false;
    }

    // @todo The persona name should be checked for a specific format. Only
    // snake_case should be accepted.

    // Get the config file for the talent.
    let infoFilePath = directory + '/' + name + '.info.yml';
    let info = await Lavenza.Akechi.readYamlFile(infoFilePath).catch(Lavenza.continue);

    // If the configuration is not empty, let's successfully register the bot.
    if (Lavenza.isEmpty(info)) {
      Lavenza.warn('TALENT_INFO_FILE_NOT_FOUND', [name]);
      return false;
    }

    info.directory = directory;
    let talent = require(directory + '/' + info.class);

    // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.

    // Instantiate and set the bot to the collection.
    await talent.build(info).catch(Lavenza.stop);
    this.talents[type] = this.talents[type] || {};
    this.talents[type][name] = talent;
    this.talents.all[name] = talent;
    return talent;
  }
}