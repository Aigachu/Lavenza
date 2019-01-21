/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a class for Players.
 */
export default class Entity {

  /**
   * Entity constructor.
   *
   * @param {string} id
   *   ID of the Discord user to get the character for.
   * @param {string} dataPath
   *   Path to the data in the repository.
   */
  constructor(id, dataPath) {
    this.id = id;
    this.dataPath = dataPath;
  }

  /**
   * Get character data from the database.
   *
   * @returns {Promise<Object>}
   */
  async data() {
    return await Lavenza.Gestalt.get(`${this.dataPath}`);
  }

  /**
   * Set entity data to the database.
   *
   * @param {Object} data
   *   Data to set to the database.
   *
   * @returns {Promise<void>}
   */
  async update(data) {
    await Lavenza.Gestalt.post(`${this.dataPath}`, data);
  }
}
