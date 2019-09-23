/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
import Bot from "../Bot";
import ClientType from "./ClientType";
import {BotClientConfig} from "../BotConfigurations";

/**
 * Provides an interface for Clients.
 */
export default interface ClientInterface {

  /**
   * Store the Bot this client was initialized for.
   */
  bot: Bot;

  /**
   * Store the type of client for ease of access.
   */
  type: ClientType;

  /**
   * Store client configuration.
   */
  config: BotClientConfig;

  /**
   * The Gestalt function is used to setup database tables for a given object.
   *
   * In this case, these are the database setup tasks for Clients connected to Bots.
   *
   * You can see the result of these calls in the database.
   */
  gestalt();

  /**
   * Get configurations specific to the actual client.
   */
  getActiveConfigurations();

  /**
   * Authenticate to the client application.
   */
  authenticate();

  /**
   * Disconnect from the client application.
   */
  disconnect();

  /**
   * Type for a specified amount of seconds in a given channel.
   */
  typeFor(seconds: any, channel: any);

}