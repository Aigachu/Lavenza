/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
const BotClientConfigSchema = require('./BotClientConfigSchema');

/**
 * Declares a schema for Bot Client Configurations specific to Discord Clients.
 */
module.exports = class BotDiscordClientConfigSchema extends BotClientConfigSchema {
  constructor() {
    super();
    this.activity = '';
    this.add_url = '';
  }
};