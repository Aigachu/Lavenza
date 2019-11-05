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
 * Provides an abstract class for Directory Loaders.
 *
 * Directory Loaders crawl a path and perform specific tasks on each Directory found in a path.
 */
export abstract class DirectoryLoader<T> extends Loader<T> {

  /**
   * Crawl the provided root path and process directories found in it.
   *
   * @inheritDoc
   */
  public async load(root: string): Promise<T[]> {
    // If this directory doesn't exist, we simply return.
    if (! await Akechi.directoryExists(root)) {
      return [];
    }

    const directories: string[] = await Akechi.getDirectoriesFrom(root);

    // We'll throw an error for this function if the 'Commands' directory doesn't exist or is empty.
    if (Sojiro.isEmpty(directories)) {
      return [];
    }

    // Initialize a variable to store all items we find.
    const items = [];

    // We'll now act on each directory found.
    await Promise.all(directories.map(async (directory) => {
      const item = await this.process(directory);
      if (item) {
        items.push(item);
      }
    }));

    return items;
  }

}
