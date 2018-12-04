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

  static async request({protocol = '', endpoint, payload = {}} = {}) {
    switch(protocol) {
      case 'get':
        return await this.get(endpoint).catch(Lavenza.stop);

      case 'post':
        return await this.post(endpoint, payload).catch(Lavenza.stop);

      case 'update':
        return await this.update(endpoint, payload).catch(Lavenza.stop);

      case 'delete':
        return await this.delete(endpoint).catch(Lavenza.stop);
    }
  }

  static async build() {
    Lavenza.throw(`You must implement a build() method in the ${this.constructor} class.`);
  }

  static async createCollection(endpoint, items) {
    Lavenza.throw(`You must implement a getCollection() method in the ${this.constructor} class.`);
  }

  static async get(endpoint) {
    Lavenza.throw(`You must implement a get() method in the ${this.constructor} class.`);
  }

  static async post(endpoint, payload) {
    Lavenza.throw(`You must implement a post() method in the ${this.constructor} class.`);
  }

  static async update(endpoint, payload) {
    Lavenza.throw(`You must implement a update() method in the ${this.constructor} class.`);
  }

  static async delete(endpoint, payload) {
    Lavenza.throw(`You must implement a update() method in the ${this.constructor} class.`);
  }

}