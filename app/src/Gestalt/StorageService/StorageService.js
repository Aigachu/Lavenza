/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a base abstract class for Storage Services.
 *
 * Storage Services are mediums to store application data. Gestalt will use these storage services.
 *
 * Storage services must implement REST methods for manipulation of data.
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
      case 'get': {

        // Await GET request of the Storage Service.
        return await this.get(endpoint).catch(Lavenza.stop);

      }

      // POST Protocol.
      case 'post': {

        // Await POST request of the Storage Service.
        return await this.post(endpoint, payload).catch(Lavenza.stop);

      }

      // UPDATE Protocol.
      case 'update': {

        // Await UPDATE request of the Storage Service.
        return await this.update(endpoint, payload).catch(Lavenza.stop);

      }


      // DELETE Protocol.
      case 'delete': {

        // Await DELETE request of the Storage Service.
        return await this.delete(endpoint).catch(Lavenza.stop);

      }
    }
  }

  /**
   * Every storage service is a static singleton. This function will handle the preparations.
   */
  static async build() {
    Lavenza.throw(`Tried to run abstract method build(). You must implement a build() method in the {{class}} class.`, {class: this.constructor});
  }

  /**
   * Create a collection in the database.
   *
   * This is an abstract method.
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
    console.log(endpoint);
    console.log(payload);
    Lavenza.throw(`Tried to run abstract method createCollection(). You must implement a createCollection() method in the {{class}} class.`, {class: this.constructor});
  }

  /**
   * Process a GET request.
   *
   * This is an abstract method.
   *
   * @param {String} endpoint
   *   Path to get data from.
   *
   * @returns {Promise<Object>}
   *   Data retrieved, if it succeeded.
   */
  static async get(endpoint) {
    console.log(endpoint);
    Lavenza.throw(`Tried to run abstract method get(). You must implement a get() method in the {{class}} class.`, {class: this.constructor});
  }

  /**
   * Process a POST request.
   *
   * This is an abstract method.
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
    console.log(endpoint);
    console.log(payload);
    Lavenza.throw(`Tried to run abstract method post(). You must implement a post() method in the {{class}} class.`, {class: this.constructor});
  }

  /**
   * Process a UPDATE request.
   *
   * This is an abstract method.
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
    console.log(endpoint);
    console.log(payload);
    Lavenza.throw(`Tried to run abstract method update(). You must implement a update() method in the {{class}} class.`, {class: this.constructor});
  }

  /**
   * Process a DELETE request.
   *
   * This is an abstract method.
   *
   * @param {String} endpoint
   *   Path to delete data at.
   *
   * @returns {Promise<void>}
   */
  static async delete(endpoint) {
    console.log(endpoint);
    Lavenza.throw(`Tried to run abstract method delete(). You must implement a delete() method in the {{class}} class.`, {class: this.constructor});
  }

}