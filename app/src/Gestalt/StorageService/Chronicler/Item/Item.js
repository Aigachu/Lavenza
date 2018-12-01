/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

export default class Item {
  constructor(path) {
    this.path = path;
  }

  async values() {
    // We expect a yml. We just reach the path.
    return Lavenza.Akechi.readYamlFile(this.path);
  }
}