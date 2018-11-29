/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
export default class Command {
  static async build(config, talent) {
    this.talent = talent;
    this.key = config.key; // @todo - Add validation to check if the key is all in lowercase.
    this.aliases = config.aliases;
    this.aliases.push(this.key);
    this.activators = this.aliases;
    this.clients = config.clients || {};
  }

  static execute(content, message, bot, client) {
    // Default execute function. Does nothing.
    Lavenza.warn('You should probably add an execute function to this command!');
  }

  static allowedInClient(clientType) {
    return !(this.clients !== {} && this.clients !== '*' && !this.clients[clientType]);
  }
}
