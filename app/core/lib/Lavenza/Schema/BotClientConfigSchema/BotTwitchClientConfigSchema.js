/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
const BotClientConfigSchema = require('./BotClientConfigSchema');

/**
 * Declares a schema for Bot Client Configurations specific to Twitch Clients.
 */
module.exports = class BotTwitchClientConfigSchema extends BotClientConfigSchema {
  constructor() {
    super();
    this.username = '';
    this.channels = [];
  }
};