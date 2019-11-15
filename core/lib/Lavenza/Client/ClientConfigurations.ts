/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { AssociativeObject } from "../Types";

/**
 * Expose an interface to describe Discord Client configurations.
 */
// tslint:disable-next-line:no-empty-interface
export interface ClientConfigurations {

}

/**
 * Declares a schema for Bot Client Configurations.
 */
export interface BotClientConfig {

  /**
   * Unique Identifier of the Joker user in the specified client.
   *
   * This unique identifier is always a string, but differs per client.
   */
  joker: string;

  /**
   * Command prefix for this Bot, specific to a client.
   *
   * There can be multiple command prefixes per client.
   */
  commandPrefix: string;

  /**
   * User Eminence information for a specific client.
   *
   * Organized in an object of unique identifiers assigned to a given Eminence.
   *
   * Each client needs a list of defined users that have assigned roles.
   */
  userEminences: AssociativeObject<string>;

}
