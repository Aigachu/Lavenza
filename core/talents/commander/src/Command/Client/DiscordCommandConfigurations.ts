/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {
  BotDiscordClientConfig,
  DiscordClientConfigurations,
} from "../../../../../lib/Lavenza/Client/Discord/DiscordConfigurations";
import {
  CommandAuthorizerBotConfigurations, CommandAuthorizerCommandConfigurations,
  CommandAuthorizerConfigurationsCollection,
} from "../CommandAuthorizer/CommandAuthorizerConfigurations";
import {
  CommandClientAuthorizationConfig,
  CommandClientAuthorizationListConfig,
  CommandClientConfig,
} from "../CommandConfigurations";

/**
 * Declares a base interface schema for Discord Client Configurations specific to Commands.
 */
export interface CommandDiscordClientConfig extends CommandClientConfig {

  /**
   * Defines a custom authorization configuration for Discord.
   *
   * @inheritDoc
   */
  authorization: CommandDiscordClientAuthorizationConfig;

}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandDiscordClientAuthorizationConfig extends CommandClientAuthorizationConfig {

  /**
   * Defines a custom authorization list for Discord.
   *
   * Blacklists will contain lists for guilds, channels & users.
   *
   * @inheritDoc
   */
  blacklist: CommandDiscordClientAuthorizationListConfig;

  /**
   * Defines a custom authorization list for Discord.
   *
   * Whitelists will contain lists for guilds, channels & users.
   *
   * @inheritDoc
   */
  whitelist: CommandDiscordClientAuthorizationListConfig;

}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandDiscordClientAuthorizationListConfig extends CommandClientAuthorizationListConfig {

  /**
   * A list of unique identifiers for guilds to in authorization configurations.
   */
  guilds: string[];

  /**
   * A list of unique identifiers for channels to in authorization configurations.
   */
  channels: string[];

}

/**
 * Provide an interface for a Discord Command Authorizer's collection of configurations.
 */
export interface DiscordCommandAuthorizerConfigurationsCollection extends CommandAuthorizerConfigurationsCollection {

  /**
   * House bot's configurations with Discord specificities.
   */
  bot: DiscordCommandAuthorizerBotConfigurations;

  /**
   * House command's configurations with Discord specificities.
   */
  command: DiscordCommandAuthorizerCommandConfigurations;

  /**
   * House client's configurations with Discord specificities.
   */
  client: DiscordClientConfigurations;

}

/**
 * Provides an interface for Command Authorizer Bot configurations.
 */
export interface DiscordCommandAuthorizerBotConfigurations extends CommandAuthorizerBotConfigurations {

  /**
   * House bot's client configurations with Discord specificities.
   */
  client: BotDiscordClientConfig;

}

/**
 * Provides an interface for Command Authorizer Command configurations specific to Discord.
 */
export interface DiscordCommandAuthorizerCommandConfigurations extends CommandAuthorizerCommandConfigurations {

  /**
   * House command's client configurations with Discord specificities.
   */
  client: CommandDiscordClientConfig;

}
