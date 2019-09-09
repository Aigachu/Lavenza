/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import lodash from 'lodash';

// Imports.
import Akechi from '../../../Confidant/Akechi';
import Sojiro from '../../../Confidant/Sojiro';
import StorageService from '../StorageService';
import Collection from './Collection/Collection';
import Item from './Item/Item';
import Core from "../../../Core/Core";

/**
 * Chronicler is the default Storage Service used by Gestalt & Lavenza.
 *
 * Chronicler will quite simply read/write to/from a 'database' folder located at the root of the application. Objects
 * will be stored in .yml files and read from them as well.
 *
 */
export default class Chronicler extends StorageService {

  /**
   * Stores the path to the root of the database.
   */
  private root: string;

  /**
   * @inheritDoc
   */
  async build() {
    this.root = Core.paths.root + '/database'
  }

  /**
   * Chronicler alters the endpoints when requests are made.
   *
   * We need to make sure that the root of the database, /database in this app, is prepended to all path requests.
   *
   * @inheritDoc
   */
  async request({protocol = '', endpoint = '', payload = {}} = {}) {
    // If the endpoint doesn't start with the database root, prepend it to the path.
    if (!endpoint.startsWith(this.root)) {
      endpoint = this.root + endpoint;
    }

    // Await the execution of the regular request process.
    return await super.request({
      protocol: protocol,
      endpoint: endpoint,
      payload: payload,
    });
  }

  /**
   * Create collection using the Chronicler.
   *
   * @TODO - Handle creation of a payload with existing data. Handle Objects as well to created nested collections.
   *
   * @inheritDoc
   */
  async createCollection(endpoint, payload = {}) {
    // Prepend database path to the requested endpoint.
    // We have to do it here since this function doesn't pass through the main request() function.
    let directoryPath = this.root + endpoint;

    // Await creation of a directory at the path.
    await Akechi.createDirectory(directoryPath);
  }

  /**
   * Get data from a path at the endpoint.
   *
   * @inheritDoc
   */
  async get(endpoint): Promise<any> {
    // First we check if the requested path is a file. If it is, we await the returning of its values.
    if (Akechi.fileExists(endpoint + '.yml')) {
      let item = new Item(endpoint + '.yml');
      return await item.values();
    }

    // If it's not a file, then we'll check if it's a directory. If so, await return of its values.
    if (Akechi.isDirectory(endpoint)) {
      let collection = new Collection(endpoint);
      return await collection.values();
    }

    // If nothing was found, return an empty object.
    return {};
  }

  /**
   * Create a file at the path.
   *
   * @TODO - Handle Collections and Objects as well to create folders and files.
   *
   * @inheritDoc
   */
  async post(endpoint, payload): Promise<any|null> {
    // We simply create a YAML file. We await this process.
    await Akechi.writeYamlFile(endpoint, payload);
  }

  /**
   * Update the file at the path.
   *
   * @TODO - Handle Collections as well.
   *
   * @inheritDoc
   */
  async update(endpoint, payload): Promise<any|null> {
    // First, we use Chronicler's get method to get the data.
    let data = await this.get(endpoint);

    // If no data was found, make sure the data is an empty object.
    if (Sojiro.isEmpty(data)) {
      data = {};
    }

    // We use lodash to merge the payload containing the updates, with the original data.
    let updatedData = lodash.merge(data, payload);

    // Finally, we post the new merged data back to the same endpoint.
    await this.post(endpoint, updatedData);

    // We return the newly merged data.
    // We do another request here. The idea is we want to make sure the data in the file is right.
    // Might change this in the future since the update request actually does 3 requests...But eh.
    return await this.get(endpoint);
  }

  /**
   * Delete file at the path.
   *
   * @TODO - Finish this.
   *
   * @inheritDoc
   */
  async delete(endpoint: string): Promise<any> {
    return undefined;
  }

}