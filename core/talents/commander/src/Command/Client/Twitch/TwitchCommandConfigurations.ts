/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {
  BotTwitchClientConfig,
  TwitchClientConfigurations,
} from "../../../../../../lib/Lavenza/Client/Twitch/TwitchConfigurations";
import {
  CommandAuthorizerBotConfigurations,
  CommandAuthorizerCommandConfigurations, CommandAuthorizerConfigurationsCollection,
} from "../../CommandAuthorizer/CommandAuthorizerConfigurations";
import {
  CommandClientAuthorizationConfig,
  CommandClientAuthorizationListConfig,
  CommandClientConfig,
} from "../../CommandConfigurations";

/**
 * Declares a base interface schema for Twitch Client Configurations specific to Commands.
 */
export interface CommandTwitchClientConfig extends CommandClientConfig {

  /**
   * Defines a custom authorization configuration for Twitch.
   *
   * @inheritDoc
   */
  authorization: CommandTwitchClientAuthorizationConfig;

}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandTwitchClientAuthorizationConfig extends CommandClientAuthorizationConfig {

  /**
   * Defines a custom authorization list for Discord.
   *
   * Blacklists will contain lists for channels & users.
   *
   * @inheritDoc
   */
  blacklist: CommandTwitchClientAuthorizationListConfig;

  /**
   * Defines a custom authorization list for Discord.
   *
   * Whitelists will contain lists for channels & users.
   *
   * @inheritDoc
   */
  whitelist: CommandTwitchClientAuthorizationListConfig;

}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandTwitchClientAuthorizationListConfig extends CommandClientAuthorizationListConfig {

  /**
   * A list of unique identifiers for channels to in authorization configurations.
   */
  channels: string[];

}

/**
 * Provide an interface for a Twitch Command Authorizer's collection of configurations.
 */
export interface TwitchCommandAuthorizerConfigurationsCollection extends CommandAuthorizerConfigurationsCollection {

  /**
   * House bot's configurations with Twitch specificities.
   */
  bot: TwitchCommandAuthorizerBotConfigurations;

  /**
   * House command's configurations with Twitch specificities.
   */
  command: TwitchCommandAuthorizerCommandConfigurations;

  /**
   * House client's configurations with Twitch specificities.
   */
  client: TwitchClientConfigurations;

}

/**
 * Provides an interface for Command Authorizer Bot configurations.
 */
export interface TwitchCommandAuthorizerBotConfigurations extends CommandAuthorizerBotConfigurations {

  /**
   * House bot's client configurations with Twitch specificities.
   */
  client: BotTwitchClientConfig;

}

/**
 * Provides an interface for Command Authorizer Command configurations specific to Twitch.
 */
export interface TwitchCommandAuthorizerCommandConfigurations extends CommandAuthorizerCommandConfigurations {

  /**
   * House command's client configurations with Twitch specificities.
   */
  client: CommandTwitchClientConfig;

}
