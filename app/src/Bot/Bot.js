/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */

// Confidants.
const Akechi = require("../Confidants/Akechi");

// Includes.
const ClientFactory = require("./Client/ClientFactory");

/**
 * Provides a class for Bot objects
 */
class Bot {
  constructor(name, directory, config) {
    this.name = name;
    this.directory = directory;
    this.config = config;
  }

  deploy() {
    this.authenticateClients();
  }

  prepare() {
    this.initializeClients();
  }

  authenticateClients() {
    this.clients.every(client => {
      client.authenticate();
      return true;
    });
  }

  initializeClients() {
    this.clients = [];
    let clientConfigs = this.config.clients;
    clientConfigs.forEach((config, key) => {
      this.clients.push(ClientFactory.build(key, config, this));
    });
  }
}

module.exports = Bot;
