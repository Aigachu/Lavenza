/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import ClientCommandAuthorizerFactory from './ClientCommandAuthorizer/ClientCommandAuthorizerFactory';

/**
 * Provides an Authorizer for commands.
 *
 * This class will handle the authorization of an already determined order.
 */
export default class CommandAuthorizer {

  /**
   *
   * @param order
   * @param resonance
   */
  static authorize(order, resonance) {

    // Let's get the necessary configurations we need.
    this.getCommandClientConfig(order, resonance.bot).then(config => {

      // We'll do MANY checks to see if it should be unauthorized.
      // First, we must know our context. Depending on the client, we call a different authorizer.
      let clientAuthorizer = ClientCommandAuthorizerFactory.build(order, resonance);

      // If the client authorizer fails, we gotta go.
      if (!clientAuthorizer.authorize(order, resonance, config)) {
        return false;
      }

      return true;
    });

  }

  /**
   *
   * @param order
   * @param {Bot} bot
   */
  static async getCommandClientConfig(order, bot) {
    let baseCommandConfig = order.command.config;
    let databaseCommandConfig = await Lavenza.Gestalt.get(`/bots/${bot.name}/commands/${order.command.config.key}/config`).catch(Lavenza.stop);

    if (!Lavenza.isEmpty(databaseCommandConfig)) {
      return databaseCommandConfig;
    }

    return baseCommandConfig;
  }

}