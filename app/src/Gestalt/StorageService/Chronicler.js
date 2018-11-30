/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import StorageService from './StorageService';

/**
 * Chronicler is the default Storage Service used by Gestalt.
 *
 * Chronicler will quite simply read/write to/from a 'database' folder located at the root of the application. Objects
 * will be stored in .yml files and read from them as well.
 *
 */
export default class Chronicler extends StorageService {

  static async build() {
    this.root = Lavenza.Paths.ROOT + '/database/'
  }

  static async createCollection(path) {
    return await Lavenza.Akechi.createDirectory(path).catch(Lavenza.stop);
  }

  static async getCollection(path) {
     if (Lavenza.Akechi.directoryExists(path)) {
       return this.buildCollection(path);
     }

     return undefined;
  }

  static buildCollection(path) {

  }
}