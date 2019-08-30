/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Declares a schema for Base Bot Configurations.
 */
module.exports = class BotConfigSchema {
  constructor() {
    this.name = '';
    this.command_prefix = '';
    this.locale = '';
    this.talents = [];
    this.clients = [];
  }
};