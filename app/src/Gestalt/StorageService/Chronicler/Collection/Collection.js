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

export default class Collection {
  constructor(path) {
    this.path = path;
  }

  async values() {
    // Get all files & directories from directory.
    let data = {};
    let directories = await Lavenza.Akechi.getDirectoriesFrom(this.path).catch(Lavenza.stop);
    let files = await Lavenza.Akechi.getFilesFrom(this.path).catch(Lavenza.stop);

    await Promise.all(directories.map(async directory => {
      let name = path.basename(directory);
      let collection = new this.constructor(directory);
      data[name] = await collection.values().catch(Lavenza.stop);
    })).catch(Lavenza.stop);

    await Promise.all(files.map(async file => {
      let name = path.basename(file);
      let item = new Item(file);
      data[name] = await item.values().catch(Lavenza.stop);
    })).catch(Lavenza.stop);

    return data;
  }
}