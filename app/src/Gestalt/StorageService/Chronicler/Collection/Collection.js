/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import path from 'path';

// Imports.
import Item from '../Item/Item';

/**
 * Provides a model to manage directories for the Chronicler.
 */
export default class Collection {

  /**
   * Collection constructor.
   *
   * @param {String} path
   *   Path to the directory to wrap this collection around.
   */
  constructor(path) {
    this.path = path;
  }

  /**
   * Return the values of the directory, formatted in an object.
   *
   * @returns {Promise<Object>}
   *   The formatted data.
   */
  async values() {

    // Initialize the object that will store all of the data.
    let data = {};

    // Get all files & directories from directory.
    /** @catch Stop execution. */
    let directories = await Lavenza.Akechi.getDirectoriesFrom(this.path).catch(Lavenza.stop);
    let files = await Lavenza.Akechi.getFilesFrom(this.path).catch(Lavenza.stop);

    // Await the processing of all the directories found.
    /** @catch Stop execution. */
    await Promise.all(directories.map(async directory => {

      // We basically create a collection with the directory and parse it's data, calling this function recursively.
      /** @catch Stop execution. */
      let name = path.basename(directory);
      let collection = new this.constructor(directory);
      data[name] = await collection.values().catch(Lavenza.stop);

    })).catch(Lavenza.stop);

    // Await the processing of the all the files found.
    await Promise.all(files.map(async file => {

      // We basically create an item with the directory and parse it's data, calling this function recursively.
      /** @catch Stop execution. */
      let name = path.basename(file);
      let item = new Item(file);
      data[name] = await item.values().catch(Lavenza.stop);

    })).catch(Lavenza.stop);

    // Return all of the formatted data.
    return data;

  }
}