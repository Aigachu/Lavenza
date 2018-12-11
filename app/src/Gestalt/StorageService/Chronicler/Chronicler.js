/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import lodash from 'lodash';

// Imports.
import StorageService from '../StorageService';
import Collection from './Collection/Collection';
import Item from './Item/Item';

/**
 * Chronicler is the default Storage Service used by Gestalt & Lavenza.
 *
 * Chronicler will quite simply read/write to/from a 'database' folder located at the root of the application. Objects
 * will be stored in .yml files and read from them as well.
 *
 */
export default class Chronicler extends StorageService {

  /**
   * @inheritDoc
   */
  static async build() {
    this.root = Lavenza.Paths.ROOT + '/database'
  }

  /**
   * Chronicler alters the endpoints when requests are made.
   *
   * We need to make sure that the root of the database, /database in this app, is prepended to all path requests.
   *
   * @inheritDoc
   */
  static async request({protocol = '', endpoint, payload = {}} = {}) {

    // If the endpoint doesn't start with the database root, prepend it to the path.
    if (!endpoint.startsWith(this.root)) {
      endpoint = this.root + endpoint;
    }

    // Await the execution of the regular request process.
    /** @catch Stop execution. */
    return await super.request({
      protocol: protocol,
      endpoint: endpoint,
      payload: payload,
    }).catch(Lavenza.stop);
  }

  /**
   * Create collection using the Chronicler.
   *
   * @TODO - Handle Objects as well to created nested collections.
   *
   * @inheritDoc
   */
  static async createCollection(endpoint, payload = {}) {

    // Prepend database path to the requested endpoint.
    // We have to do it here since this function doesn't pass through the main request() function.
    let directoryPath = this.root + endpoint;

    // Await creation of a directory at the path.
    /** @catch Stop execution. */
    await Lavenza.Akechi.createDirectory(directoryPath).catch(Lavenza.stop);

  }

  /**
   * Get data from a path at the endpoint.
   *
   * @inheritDoc
   */
  static async get(endpoint) {

    // First we check if the requested path is a file. If it is, we await the returning of its values.
    /** @catch Stop execution. */
    if (Lavenza.Akechi.fileExists(endpoint + '.yml')) {
      let item = new Item(endpoint + '.yml');
      return await item.values().catch(Lavenza.stop);
    }

    // If it's not a file, then we'll check if it's a directory. If so, await return of its values.
    /** @catch Stop execution. */
    if (Lavenza.Akechi.isDirectory(endpoint)) {
      let collection = new Collection(endpoint);
      return await collection.values().catch(Lavenza.stop);
    }

    // If nothing was found, return an empty object.
    Lavenza.warn('<Chronicler>: GET request returned an empty object: ' + endpoint);
    return {};
  }

  /**
   * Create a file at the path.
   *
   * @TODO - Handle Collections and Objects as well to create folders and files.
   *
   * @inheritDoc
   */
  static async post(endpoint, payload) {

    // We simply create a YAML file. We await this process.
    /** @catch Stop execution. */
    await Lavenza.Akechi.writeYamlFile(endpoint, payload).catch(Lavenza.stop);

  }

  /**
   * Update the file at the path.
   *
   * @TODO - Handle Collections as well, as in Folders.
   *
   * @inheritDoc
   */
  static async update(endpoint, payload) {

    // First, we use Chronicler's get method to get the data.
    /** @catch Stop execution. */
    let data = await this.get(endpoint).catch(Lavenza.stop);

    // If no data was found, make sure the data is an empty object.
    if (Lavenza.isEmpty(data)) {
      data = {};
    }

    // We use lodash to merge the payload containing the updates, with the original data.
    let updatedData = lodash.merge(data, payload);

    // Finally, we post the new merged data back to the same endpoint.
    /** @catch Stop execution. */
    await this.post(endpoint, updatedData).catch(Lavenza.stop);

    // We return the newly merged data.
    // We do another request here. The idea is we want to make sure the data in the file is right.
    // Might change this in the future since the update request actually does 3 requests...But eh.
    /** @catch Stop execution. */
    return await this.get(endpoint).catch(Lavenza.stop);
  }
}