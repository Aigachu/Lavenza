/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a base class for Storage Services.
 *
 * Storage Services are mediums to store useful data. Gestalt will use these storage services.
 *
 * Storage services must implement easy methods for reaching needed content.
 */
export default class StorageService {

  static async build() {
    Lavenza.throw(`You must implement a build() method in the ${this.constructor} class.`);
  }

  static async getItem(path) {
    Lavenza.throw(`You must implement a getItem() method in the ${this.constructor} class.`);
  }

  static async createItem(path) {
    Lavenza.throw(`You must implement a createItem() method in the ${this.constructor} class.`);
  }

  static async getCollection(path) {
    Lavenza.throw(`You must implement a getCollection() method in the ${this.constructor} class.`);
  }

  static async createCollection(path) {
    Lavenza.throw(`You must implement a createCollection() method in the ${this.constructor} class.`);
  }

  // /**
  //  * Get method for this Storage Service.
  //  *
  //  * Each storage service should accept an API format such as '/bots/servers/{id}/config' in the parameter,
  //  * and perform fetching operations accordingly.
  //  *
  //  * If this default one is called, we must throw an error.
  //  *
  //  * @param {string} ref
  //  *   Reference to the requested data.
  //  *
  //  */
  // static async get(ref) {
  //   Lavenza.throw(`You must implement a get() method in the ${this.constructor} class.`);
  // }
  //
  // /**
  //  * Get method for this Storage Service.
  //  *
  //  * Each storage service should accept an API format such as '/bots/servers/{id}/config' in the parameter,
  //  * and perform creation operations accordingly.
  //  *
  //  * If this default one is called, we must throw an error.
  //  *
  //  * @param {string} ref
  //  *   Reference to the requested data.
  //  *
  //  */
  // static async post(ref) {
  //   Lavenza.throw(`You must implement a post() method in the ${this.constructor} class.`);
  // }
  //
  // /**
  //  * Post method for this Storage Service.
  //  *
  //  * Each storage service should accept an API format such as '/bots/servers/{id}/config' in the parameter,
  //  * and perform update operations accordingly.
  //  *
  //  * If this default one is called, we must throw an error.
  //  *
  //  * @param {string} ref
  //  *   Reference to the requested data.
  //  *
  //  */
  // static async update(ref) {
  //   Lavenza.throw(`You must implement a update() method in the ${this.constructor} class.`);
  // }

}