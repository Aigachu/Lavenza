/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {
  ClientConfigurations,
  DiscordClientConfigurations,
  TwitchClientConfigurations
} from "../../Client/ClientConfigurations";
import {BotClientConfig, BotConfigurations, BotDiscordClientConfig, BotTwitchClientConfig} from "../../BotConfigurations";
import {
  CommandClientConfig,
  CommandConfigurations, CommandDiscordClientConfig,
  CommandParameterConfig,
  CommandTwitchClientConfig
} from "../CommandConfigurations";

/**
 * Provide an interface for a Command Authorizer's collection of configurations.
 *
 * Since this class needs a lot of configurations to make checks, we organize them in an easy to access Object.
 *
 * We provide an interface for better type completion.
 */
export interface CommandAuthorizerConfigurationsCollection {
  bot: CommandAuthorizerBotConfigurations;
  command: CommandAuthorizerCommandConfigurations;
  client: ClientConfigurations;
}

/**
 * Provides an interface for Command Authorizer Bot configurations.
 */
export interface CommandAuthorizerBotConfigurations {
  base: BotConfigurations;
  client: BotClientConfig;
}

/**
 * Provides an interface for Command Authorizer Command configurations.
 */
export interface CommandAuthorizerCommandConfigurations {
  base: CommandConfigurations;
  client: CommandClientConfig;
  parameters: CommandParameterConfig;
}

/**
 * === DISCORD ===
 */

/**
 * Provide an interface for a Discord Command Authorizer's collection of configurations.
 */
export interface DiscordCommandAuthorizerConfigurationsCollection extends CommandAuthorizerConfigurationsCollection {
  bot: DiscordCommandAuthorizerBotConfigurations;
  command: DiscordCommandAuthorizerCommandConfigurations;
  client: DiscordClientConfigurations;
}

/**
 * Provides an interface for Command Authorizer Bot configurations.
 */
export interface DiscordCommandAuthorizerBotConfigurations extends CommandAuthorizerBotConfigurations {
  client: BotDiscordClientConfig;
}

/**
 * Provides an interface for Command Authorizer Command configurations specific to Discord.
 */
export interface DiscordCommandAuthorizerCommandConfigurations extends CommandAuthorizerCommandConfigurations {
  client: CommandDiscordClientConfig;
}

/**
 * === TWITCH ===
 */

/**
 * Provide an interface for a Twitch Command Authorizer's collection of configurations.
 */
export interface TwitchCommandAuthorizerConfigurationsCollection extends CommandAuthorizerConfigurationsCollection {
  bot: TwitchCommandAuthorizerBotConfigurations;
  command: TwitchCommandAuthorizerCommandConfigurations;
  client: TwitchClientConfigurations;
}

/**
 * Provides an interface for Command Authorizer Bot configurations.
 */
export interface TwitchCommandAuthorizerBotConfigurations extends CommandAuthorizerBotConfigurations {
  client: BotTwitchClientConfig;
}

/**
 * Provides an interface for Command Authorizer Command configurations specific to Twitch.
 */
export interface TwitchCommandAuthorizerCommandConfigurations extends CommandAuthorizerCommandConfigurations {
  client: CommandTwitchClientConfig;
}