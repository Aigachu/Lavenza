/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a model to manage YAML files in the Chronicler.
 */
export default class Item {

  /**
   * Item constructor.
   *
   * @param {String} path
   *   Path to the file to wrap this item around.
   */
  constructor(path) {
    this.path = path;
  }

  /**
   * Return the values of the YAML file.
   *
   * @returns {Promise<Object>}
   *   Returns the data parsed
   */
  async values() {

    // We expect a yml. We just reach the path.
    /** @catch Stop execution. */
    return await Lavenza.Akechi.readYamlFile(this.path).catch(Lavenza.stop);

  }
}