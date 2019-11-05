/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Akechi } from "../../Confidant/Akechi";
import { Sojiro } from "../../Confidant/Sojiro";

import { Loader } from "./Loader";

/**
 * Provides an abstract class for File Loaders.
 *
 * File Loaders crawl a path and perform specific tasks on each File found in a path.
 */
export abstract class FileLoader<T> extends Loader<T> {

  /**
   * Store the type of file you wish to load.
   *
   * We use this to make sure we don't load all files. Each FileLoader should specify a type of file to load.
   */
  protected abstract fileType: string;

  /**
   * Crawl the provided root path and process files found in it.
   *
   * @inheritDoc
   */
  public async load(root: string): Promise<T[]> {
    // If the provided directory doesn't exist, we simply return.
    if (! await Akechi.directoryExists(root)) {
      return [];
    }

    // Get the list of files at the path.
    let files: string[] = await Akechi.getFilesFrom(root);

    // Filter the obtained list to exclude files that are not of the type specified.
    files = files.filter((listenerPath) => !listenerPath.endsWith(this.fileType));

    // We'll throw an error for this function if the 'Listeners' directory doesn't exist or is empty.
    // This error should be caught and handled above.
    if (Sojiro.isEmpty(files)) {
      return [];
    }

    // Initialize a variable to store all items we find.
    const items = [];

    // We'll now act on each file found.
    await Promise.all(files.map(async (filePath) => {
      const item = await this.process(filePath);
      if (item) {
        items.push(item);
      }
    }));

    return items;
  }

}
