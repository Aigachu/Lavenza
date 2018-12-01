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
    let directories = Lavenza.Akechi.getDirectoriesFrom(this.path);
    let files = Lavenza.Akechi.getFilesFrom(this.path);

    await Promise.all(directories.map(async directory => {
      let name = path.basename(directory);
      data[name] = new this.constructor(directory).values();
    })).catch(Lavenza.stop);

    await Promise.all(files.map(async file => {
      let name = path.basename(file);
      data[name] = new Item(file).values();
    })).catch(Lavenza.stop);

    return data;
  }
}