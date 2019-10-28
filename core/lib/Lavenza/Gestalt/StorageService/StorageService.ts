/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { AbstractObject } from "../../Types";

/**
 * Provides a base abstract class for Storage Services.
 *
 * Storage Services are mediums to store application data. Gestalt will use these storage services.
 *
 * Storage services must implement REST methods for manipulation of data.
 */
export abstract class StorageService {

  /**
   * This function will handle build preparations..
   */
  public abstract async build(): Promise<void>;

  /**
   * Create a collection in the database.
   *
   * This is an abstract function.
   *
   * @param endpoint
   *   Location where to create the collection.
   * @param payload
   *   The data of the Collection to create.
   */
  public abstract async createCollection(endpoint: string, payload: {}): Promise<void>;

  /**
   * Process a DELETE request.
   *
   * This is an abstract function.
   *
   * @param endpoint
   *   Path to delete data at.
   */
  public abstract async delete(endpoint: string): Promise<void>;

  /**
   * Process a GET request.
   *
   * @param endpoint
   *   Path to get data from.
   *
   * @returns
   *   Data retrieved, if it succeeded.
   */
  public abstract async get(endpoint: string): Promise<{}>;

  /**
   * Process a POST request.
   *
   * @param endpoint
   *   Path to push data to.
   * @param payload
   *   Data to push to the endpoint.
   *
   * @returns
   *   Data pushed, if applicable.
   */
  public abstract async post(endpoint: string, payload: {}): Promise<{} | undefined>;

  /**
   * Make a request to the database.
   *
   * @param protocol
   *   The protocol we want to use.
   *   The are four: GET, POST, UPDATE, DELETE.
   *    - GET: Fetch and retrieve data from a path/endpoint.
   *    - POST: Create data at a path/endpoint.
   *    - UPDATE: Adjust data at a path/endpoint.
   *    - DELETE: Remove data at a path/endpoint.
   * @param endpoint
   *   The string path/endpoint of where to apply the protocol.
   * @param payload
   *   The data, if needed, to apply the protocol. GET/DELETE will not need a payload.
   *
   * @returns
   *   The result of the protocol call, if applicable.
   */
  public async request({protocol = "", endpoint = "", payload = {}}: AbstractObject = {})
    : Promise<{} | undefined> {
    // Depending on the protocol, we run different methods.
    switch (protocol) {
      // GET Protocol.
      case "get": {
        // Await GET request of the Storage Service.
        return this.get(endpoint);
      }

      // POST Protocol.
      case "post": {
        // Await POST request of the Storage Service.
        return this.post(endpoint, payload);
      }

      // UPDATE Protocol.
      case "update": {
        // Await UPDATE request of the Storage Service.
        return this.update(endpoint, payload);
      }

      // DELETE Protocol.
      case "delete": {
        // Await DELETE request of the Storage Service.
        await this.delete(endpoint);
      }
    }
  }

  /**
   * Process a UPDATE request.
   *
   * @param endpoint
   *   Path to push data to.
   * @param payload
   *   Data to update at the endpoint.
   *
   * @returns
   *   Data updated, if applicable.
   */
  public abstract async update(endpoint: string, payload: {}): Promise<{} | undefined>;

}
