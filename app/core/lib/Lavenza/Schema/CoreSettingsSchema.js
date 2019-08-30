/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Declares a schema for Core Lavenza settings.
 *
 * @type {{master: string, autoboot: Array<string>}}
 */
module.exports = class CoreSettingsSchema {
  constructor() {
    this.master = '';
    this.autoboot = [];
  }
};