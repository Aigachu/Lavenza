/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { AssociativeObject } from "../../../Types";
import {
  CommandAuthorizerBotConfigurations, CommandAuthorizerCommandConfigurations,
  CommandAuthorizerConfigurationsCollection,
} from "../../Command/CommandAuthorizer/CommandAuthorizerConfigurations";
import {
  CommandClientAuthorizationConfig,
  CommandClientAuthorizationListConfig,
} from "../../Command/CommandConfigurations";
import { BotClientConfig, ClientConfigurations, CommandClientConfig } from "../ClientConfigurations";

/**
 * Expose an interface to describe Discord Client configurations.
 */
export interface TwitchClientConfigurations extends ClientConfigurations {

  /**
   * Associative list of configurations per Twitch channel, using the Guild's unique ID as keys.
   */
  channels: AssociativeObject<TwitchClientChannelConfigurations>;

}

/**
 * Expose an interface to describe Twitch Client configurations for channels.
 */
export interface TwitchClientChannelConfigurations {

  /**
   * Name of the channel this configuration is for.
   */
  name: string;

  /**
   * Command prefix set to this channel.
   */
  commandPrefix: string;

  /**
   * User Eminence information for this channel.
   */
  userEminences: AssociativeObject<string>;
}

/**
 * Declares a schema for Bot Client Configurations specific to Twitch Clients.
 */
export interface BotTwitchClientConfig extends BotClientConfig {

  /**
   * Username of the Twitch account the Bot will be using.
   */
  username: string;

  /**
   * Twitch channels this bot will interact in and connect to.
   */
  channels: string[];

}

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
