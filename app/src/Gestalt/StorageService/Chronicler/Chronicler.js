/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import StorageService from '../StorageService';
import Collection from './Collection/Collection';
import Item from './Item/Item';

/**
 * Chronicler is the default Storage Service used by Gestalt.
 *
 * Chronicler will quite simply read/write to/from a 'database' folder located at the root of the application. Objects
 * will be stored in .yml files and read from them as well.
 *
 */
export default class Chronicler extends StorageService {

  static async build() {
    this.root = Lavenza.Paths.ROOT + '/database'
  }

  static async request({protocol = '', endpoint, payload = {}} = {}) {
    endpoint = this.root + endpoint;
    return await super.request({
      protocol: protocol,
      endpoint: endpoint,
      payload: payload,
    }).catch(Lavenza.stop);
  }

  static async createCollection(endpoint, payload = {}) {
    let directoryPath = this.root + endpoint;
    await Lavenza.Akechi.createDirectory(directoryPath).catch(Lavenza.stop);
  }

  static async get(endpoint) {
    if (Lavenza.Akechi.fileExists(endpoint + '.yml')) {
      let item = new Item(endpoint + '.yml');
      return await item.values().catch(Lavenza.stop);
    }

    if (Lavenza.Akechi.isDirectory(endpoint)) {
      let collection = new Collection(endpoint);
      return await collection.values().catch(Lavenza.stop);
    }

    return {};
  }

  static async post(endpoint, payload) {
    await Lavenza.Akechi.writeYamlFile(endpoint, payload).catch(Lavenza.stop);
  }

  static async update(endpoint, payload) {
    console.log('UPDATE: ' + endpoint);
  }
}