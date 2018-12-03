/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import ClientCommandAuthorizer from './ClientCommandAuthorizer';

/**
 * Provides an Authorizer for commands.
 *
 * This class will handle the authorization of an already determined order.
 */
export default class DiscordClientCommandAuthorizer extends ClientCommandAuthorizer {

  /**
   *
   * @param order
   * @param resonance
   * @param config
   */
  static authorize(order, resonance, config) {



    // If the configuration is empty, we have no checks to make.
    if (Lavenza.isEmpty(config)) {
      return true;
    }

    // Let's get all the data we need to make checks.
    let botDiscordUser = resonance.client.user;
    let messageAuthorUser = resonance.message.author;


    // Check if user is allowed to use this command.
    if (!Lavenza.config.authorization)

    return true;
  }

  static userIsAllowed(user, config) {

  }
}