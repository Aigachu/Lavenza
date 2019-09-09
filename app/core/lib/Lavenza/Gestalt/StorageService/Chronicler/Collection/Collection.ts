/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from 'path';

// Imports.
import Item from '../Item/Item';
import Akechi from '../../../../Confidant/Akechi';

/**
 * Provides a model to manage directories for the Chronicler.
 */
export default class Collection {

  /**
   * Path to the files this collection represents.
   */
  private readonly path: string;

  /**
   * Collection constructor.
   *
   * @param path
   *   Path to the directory to wrap this collection around.
   */
  constructor(path: string) {
    this.path = path;
  }

  /**
   * Return the values of the directory, formatted in an object.
   *
   * @returns
   *   The formatted data.
   */
  async values(): Promise<any> {
    // Initialize the object that will store all of the data.
    let data = {};

    // Get all files & directories from directory.
    let directories = await Akechi.getDirectoriesFrom(this.path);
    let files = await Akechi.getFilesFrom(this.path);

    // Await the processing of all the directories found.
    await Promise.all(directories.map(async directory => {
      // We basically create a collection with the directory and parse it's data, calling this function recursively.
      let name = path.basename(directory);
      let collection = new Collection(directory);
      data[name] = await collection.values();
    })) ;

    // Await the processing of the all the files found.
    await Promise.all(files.map(async file => {
      // We basically create an item with the file and parse it's data, calling this function recursively.
      let name = path.basename(file).replace('.yml', '');
      let item = new Item(file);
      data[name] = await item.values();
    }));

    // Return all of the formatted data.
    return data;
  }

}