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

    // We'll do MANY checks to see if it should be unauthorized.
    // First, we must know our context. Depending on the client, we call a different authorizer.
    let clientAuthorizer = ClientCommandAuthorizerFactory.build(order, resonance);

    // If the client authorizer fails, we gotta go.
    if (!clientAuthorizer.authorize(order, resonance)) {
      return false;
    }

    return true;
  }
}