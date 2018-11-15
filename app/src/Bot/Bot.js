/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */

// Confidants.
const Akechi = require("../Confidants/Akechi");

/**
 * Provides a class for Bot objects
 */
class Bot {
  constructor(name, directory) {
    this.name = name;
    this.config = Akechi.readYamlFile(directory + '/' + Keys.BOT_CONFIG_FILE_NAME);
  }

  prepare() {
    this.initializeClients();
  }

  initializeClients() {
    let clients = this.config.clients;
    clients.forEach((object, key) => {
      console.log(key);
      console.log(object);
    });
  }
}

module.exports = Bot;
