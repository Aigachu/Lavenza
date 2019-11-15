/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../Bot/Bot";

import { BotClientConfig } from "./ClientConfigurations";
import { ClientType } from "./ClientType";
import { ClientUser } from "./ClientUser";

/**
 * Provides a base class for Clients.
 */
export abstract class Client {

  /**
   * Store the Bot this client was initialized for.
   */
  public bot: Bot;

  /**
   * Store the type of client for ease of access.
   */
  public type: ClientType;

  /**
   * Store client configuration.
   */
  public config: BotClientConfig;

  /**
   * Store the adapter that will be use to connect to the application this client is for.
   */
  public abstract connector: unknown;

  /**
   * Client constructor.
   *
   * @param bot
   *   The Bot this client is for.
   * @param config
   *   The configurations for this Client.
   */
  protected constructor(bot: Bot, config: BotClientConfig) {
    this.bot = bot;
    this.config = config;
  }

  /**
   * Set up a bridge to the connector.
   *
   * This is needed to define and set the connector property for the client to work.
   *
   * Without this, nothing will work.
   */
  public abstract async bridge(): Promise<void>;

  /**
   * Perform build tasks for a client.
   *
   * This will include setting up the connector and other preparatory tasks.
   */
  public abstract async build(): Promise<void>;

  /**
   * Authenticate to the client application.
   */
  public abstract async authenticate(): Promise<void>;

  /**
   * Disconnect from the client application.
   */
  public abstract async disconnect(): Promise<void>;

  /**
   * The Gestalt function is used to setup database tables for a given object.
   *
   * In this case, these are the database setup tasks for Clients connected to Bots.
   */
  public abstract async gestalt(): Promise<void>;

  /**
   * Get a user object from the client's database.
   *
   * @param identifier
   *   The unique identifier of the user to obtain.
   */
  public abstract async getUser(identifier: string): Promise<ClientUser>;

  /**
   * Type for a specified amount of seconds in a given channel.
   *
   * @param seconds
   *   Number of seconds to type for.
   * @param channel
   *   Channel to type in.
   */
  public abstract async typeFor(seconds: number, channel: unknown): Promise<void>;

}
