/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides an Authorizer for commands.
 *
 * This class will handle the authorization of an already determined order.
 */
export default class CommandAuthorizer {

  constructor(order, resonance) {
    this.order = order;
    this.resonance = resonance;
    this.bot = this.resonance.bot;
    this.type = resonance.client.type;
    this.masters = this.bot.config.clients[this.type].masters;
    this.operators = this.bot.config.clients[this.type].operators;
  }

  async build() {
    await this.setCommandClientConfig().catch(Lavenza.stop);
  }

  async setCommandClientConfig() {
    let commandConfig = await Lavenza.Gestalt.get(`/bots/${this.resonance.bot.name}/commands/${this.order.command.config.key}/config`).catch(Lavenza.stop);

    if (Lavenza.isEmpty(commandConfig)) {
      commandConfig = this.order.command.config;
    }

    this.commandConfig = commandConfig;
    this.commandClientConfig = this.commandConfig['clients.config'][this.type];
  }

}