/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Declares an interface schema for Base Command Configurations.
 */
export interface CommandConfigurations {
  name: string;
  active: boolean;
  description: string;
  class: string;
  key: string;
  aliases: Array<string>;
  authorization: CommandAuthorizationConfig;
  cooldown: CommandCooldownConfig;
  clients: Array<string>|string;
  directory: string;
}

/**
 * Declares an interface schema for Parameter configurations in Commands.
 */
export interface CommandParameterConfig {
  input: any;
  options: any;
  flags: any;
}

/**
 * Declares a base interface schema for Client Configurations specific to Commands.
 */
export interface CommandClientConfig {
  cooldown: CommandCooldownConfig;
  authorization: CommandClientAuthorizationConfig;
}

/**
 * Declares an interface schema for Command Cooldown configurations.
 */
export interface CommandCooldownConfig{
  user: number;
  global: number;
}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandAuthorizationConfig {
  enabledInDirectMessages: boolean;
  accessEminence: number;
}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandClientAuthorizationConfig extends CommandAuthorizationConfig {
  blacklist: CommandClientAuthorizationListConfig;
  whitelist: CommandClientAuthorizationListConfig;
}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandClientAuthorizationListConfig {
  users: Array<string>;
}

/**
 * === DISCORD ===
 */

/**
 * Declares a base interface schema for Discord Client Configurations specific to Commands.
 */
export interface CommandDiscordClientConfig extends CommandClientConfig {
  authorization: CommandDiscordClientAuthorizationConfig;
}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandDiscordClientAuthorizationConfig extends CommandClientAuthorizationConfig {
  blacklist: CommandDiscordClientAuthorizationListConfig;
  whitelist: CommandDiscordClientAuthorizationListConfig;
}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandDiscordClientAuthorizationListConfig extends CommandClientAuthorizationListConfig {
  guilds: Array<string>;
  channels: Array<string>;
}

/**
 * === TWITCH ===
 */

/**
 * Declares a base interface schema for Twitch Client Configurations specific to Commands.
 */
export interface CommandTwitchClientConfig extends CommandClientConfig {
  authorization: CommandTwitchClientAuthorizationConfig;
}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandTwitchClientAuthorizationConfig extends CommandClientAuthorizationConfig {
  blacklist: CommandTwitchClientAuthorizationListConfig;
  whitelist: CommandTwitchClientAuthorizationListConfig;
}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandTwitchClientAuthorizationListConfig extends CommandClientAuthorizationListConfig {
  channels: Array<string>;
}
