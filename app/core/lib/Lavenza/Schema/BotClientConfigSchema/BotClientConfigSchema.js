/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Declares a schema for Bot Client Configurations.
 */
module.exports = class BotClientConfigSchema {
  constructor() {
    this.architect = '';
    this.deities = [];
    this.masters = [];
    this.operators = [];
  }
};