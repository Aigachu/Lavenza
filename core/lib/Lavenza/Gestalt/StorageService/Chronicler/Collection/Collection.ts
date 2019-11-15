/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from "path";

// Imports.
import { Akechi } from "../../../../../../lib/Lavenza/Confidant/Akechi";
import { Item } from "../Item/Item";

/**
 * Provides a model to manage directories for the Chronicler.
 */
export class Collection {

  /**
   * Path to the files this collection represents.
   */
  private readonly path: string;

  /**
   * Collection constructor.
   *
   * @param directoryPath
   *   Path to the directory to wrap this collection around.
   */
  public constructor(directoryPath: string) {
    this.path = directoryPath;
  }

  /**
   * Return the values of the directory, formatted in an object.
   *
   * @returns
   *   The formatted data.
   */
  public async values(): Promise<{}> {
    // Initialize the object that will store all of the data.
    const data: {} = {};

    // Get all files & directories from directory.
    const directories: string[] = await Akechi.getDirectoriesFrom(this.path);
    const files: string[] = await Akechi.getFilesFrom(this.path);

    // Await the processing of all the directories found.
    await Promise.all(directories.map(async (directory: string) => {
      // We basically create a collection with the directory and parse it's data, calling this function recursively.
      const name: string = path.basename(directory);
      const collection: Collection = new Collection(directory);
      data[name] = await collection.values();
    })) ;

    // Await the processing of the all the files found.
    await Promise.all(files.map(async (file: string) => {
      // We basically create an item with the file and parse it's data, calling this function recursively.
      const name: string = path.basename(file)
        .replace(".yml", "");
      const item: Item = new Item(file);
      data[name] = await item.values();
    }));

    // Return all of the formatted data.
    return data;
  }

}
