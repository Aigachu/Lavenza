/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a base abstract class for Storage Services.
 *
 * Storage Services are mediums to store useful data. Gestalt will use these storage services.
 *
 * Storage services must implement easy methods for reaching needed content.
 */
export default class StorageService {

  /**
   * Make a request to the database.
   *
   * @param {String} protocol
   *   The protocol we want to use.
   *   The are four: GET, POST, UPDATE, DELETE.
   *    - GET: Fetch and retrieve data from a path/endpoint.
   *    - POST: Create data at a path/endpoint.
   *    - UPDATE: Adjust data at a path/endpoint.
   *    - DELETE: Remove data at a path/endpoint.
   * @param {String} endpoint
   *   The string path/endpoint of where to apply the protocol.
   * @param {Object} payload
   *   The data, if needed, to apply the protocol. GET/DELETE will not need a payload.
   *
   * @returns {Promise<*>}
   *   The result of the protocol call, if applicable.
   */
  static async request({protocol = '', endpoint, payload = {}} = {}) {

    // Depending on the protocol, we run different methods.
    switch(protocol) {

      // GET Protocol.
      case 'get':
        // Await GET request of the Storage Service.
        /** @catch Stop execution. */
        return await this.get(endpoint).catch(Lavenza.stop);

      // POST Protocol.
      case 'post':
        // Await POST request of the Storage Service.
        /** @catch Stop execution. */
        return await this.post(endpoint, payload).catch(Lavenza.stop);

      // UPDATE Protocol.
      case 'update':
        // Await UPDATE request of the Storage Service.
        /** @catch Stop execution. */
        return await this.update(endpoint, payload).catch(Lavenza.stop);

      // DELETE Protocol.
      case 'delete':
        // Await DELETE request of the Storage Service.
        /** @catch Stop execution. */
        return await this.delete(endpoint).catch(Lavenza.stop);
    }
  }

  /**
   * Every storage service is a static singleton. This function will handle the preparations.
   */
  static async build() {
    Lavenza.throw(`You must implement a build() method in the ${this.constructor} class.`);
  }

  /**
   * Create a collection in the database.
   *
   * We need to keep in mind that we're using mostly JSON storage in this context.
   * This makes use of Collections & Items.
   *
   * @param {String} endpoint
   *   Location where to create the collection.
   * @param {Object} payload
   *   The data of the Collection to create.
   *
   * @returns {Promise<void>}
   */
  static async createCollection(endpoint, payload) {
    Lavenza.throw(`You must implement a getCollection() method in the ${this.constructor} class.`);
  }

  /**
   * Process a GET request.
   *
   * @param {String} endpoint
   *   Path to get data from.
   *
   * @returns {Promise<*>}
   *   Data retrieved, if it succeeded.
   */
  static async get(endpoint) {
    Lavenza.throw(`You must implement a get() method in the ${this.constructor} class.`);
  }

  /**
   * Process a POST request.
   *
   * @param {String} endpoint
   *   Path to push data to.
   * @param {Object} payload
   *   Data to push to the endpoint.
   *
   * @returns {Promise<*|void>}
   *   Data pushed, if applicable.
   */
  static async post(endpoint, payload) {
    Lavenza.throw(`You must implement a post() method in the ${this.constructor} class.`);
  }

  /**
   * Process a UPDATE request.
   *
   * @param {String} endpoint
   *   Path to push data to.
   * @param {Object} payload
   *   Data to update at the endpoint.
   *
   * @returns {Promise<*|void>}
   *   Data update, if applicable.
   */
  static async update(endpoint, payload) {
    Lavenza.throw(`You must implement a update() method in the ${this.constructor} class.`);
  }

  /**
   * Process a DELETE request.
   *
   * @param {String} endpoint
   *   Path to delete data at.
   *
   * @returns {Promise<void>}
   */
  static async delete(endpoint) {
    Lavenza.throw(`You must implement a update() method in the ${this.constructor} class.`);
  }

}