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
export interface DiscordClientConfigurations extends ClientConfigurations {

  /**
   * Associative list of configurations per Discord guild, using the Guild's unique ID as keys.
   */
  guilds: AssociativeObject<DiscordClientGuildConfigurations>;

}

/**
 * Expose an interface to describe Discord Client configurations for guilds.
 */
export interface DiscordClientGuildConfigurations {

  /**
   * Name of the guild this configuration is for.
   */
  name: string;

  /**
   * Command prefix set to this guild.
   */
  commandPrefix: string;

  /**
   * User Eminence information for this guild.
   */
  userEminences: AssociativeObject<string>;
}

/**
 * Declares a schema for Bot Client Configurations specific to Discord Clients.
 */
export interface BotDiscordClientConfig extends BotClientConfig {

  /**
   * Activity to show for the Bot when it's connected to Discord.
   */
  activity: string;

  /**
   * URL used to integrate the bot into servers of anyone's choosing.
   */
  integrationUrl: string;

}

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
