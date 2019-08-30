/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Declares a schema for Talent Configurations.
 *
 * @type {{clients: string|Array, name: string, description: string, version: string, class: string, dependencies: Array<string>}}
 */
module.exports = class TalentConfigSchema {
  constructor() {
    this.name = '';
    this.description = '';
    this.version = '';
    this.class = '';
    this.dependencies = [];
    this.clients = '';
  }
};