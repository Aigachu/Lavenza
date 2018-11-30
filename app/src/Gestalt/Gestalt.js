/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Chronicler from './StorageService/Chronicler';

/**
 * Gestalt is the Lavenza defined Storage System for saving, reading and writing data.
 */
export default class Gestalt {

  /**
   * Gestalt is a static singleton. This function will handle the preparations.
   *
   * @param storageService
   */
  static async prepare(storageService = undefined) {
    storageService = storageService || Chronicler;
    await storageService.build().catch(Lavenza.stop);
    this.storageService = storageService;
  }

  static async getItem(path) {
    await this.storageService.getItem(path).catch(Lavenza.stop);
  }

  static async createItem(path) {
    await this.storageService.createItem(path).catch(Lavenza.stop);
  }

  static async getCollection(path) {
    await this.storageService.getCollection(path).catch(Lavenza.stop);
  }

  static async createCollection(path) {
    await this.storageService.createCollection(path).catch(Lavenza.stop);
  }

  // /**
  //  * Get functionality.
  //  *
  //  * Gestalt is essentially a wrapper, and calls whatever get function its StorageService has.
  //  *
  //  * @param {string} ref
  //  *   Reference of the data being requested.
  //  *
  //  * @returns {*}
  //  *   The data obtained from the call. May return undefined on error.
  //  */
  // static get(ref) {
  //   return this.storageService.get(ref);
  // }
  //
  // /**
  //  * Post functionality.
  //  *
  //  * Gestalt is essentially a wrapper, and calls whatever post function its StorageService has.
  //  *
  //  * @param {string} ref
  //  *   Reference of the data being requested.
  //  *
  //  * @returns {*}
  //  *   The data obtained from the call. May return undefined on error.
  //  */
  // static post(ref) {
  //   return this.storageService.post(ref);
  // }
  //
  // /**
  //  * Update functionality.
  //  *
  //  * Gestalt is essentially a wrapper, and calls whatever update function its StorageService has.
  //  *
  //  * @param {string} ref
  //  *   Reference of the data being requested.
  //  *
  //  * @returns {*}
  //  *   The data obtained from the call. May return undefined on error.
  //  */
  // static update(ref) {
  //   return this.storageService.update(ref);
  // }

}