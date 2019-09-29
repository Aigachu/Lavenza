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

  /**
   * Reader-friendly name of the Command.
   */
  name: string;

  /**
   * Flag to activate or deactivate the Command globally.
   */
  active: boolean;

  /**
   * Description of the Command.
   */
  description: string;

  /**
   * Name of the main class of the Command. Mandatory.
   */
  class: string;

  /**
   * The command's key.
   *
   * The key is the short string used to invoke the command. i.e. "ping" or "pong".
   */
  key: string;

  /**
   * List of aliases, short strings that can be used instead of the main command key.
   */
  aliases: string[];

  /**
   * Authorization configuration, determining where the command is authorized to be used.
   */
  authorization: CommandAuthorizationConfig;

  /**
   * Command's Cooldown configurations.
   */
  cooldown: CommandCooldownConfig;

  /**
   * Clients where this command is allowed to be used.
   */
  clients: string | string[];

  /**
   * Path to the directory where this command's files are located.
   */
  directory: string;

}

/**
 * Declares an interface schema for Parameter configurations in Commands.
 * @TODO - Specialized interface for parameter configurations and refactoring.
 */
export interface CommandParameterConfig {

  /**
   * Configurations detailing the desired input expected for the command.
   *
   * Not mandatory, and only needed if command expects in input.
   *
   * i.e. "!ping 5".
   */
  // tslint:disable-next-line
  input: any;

  /**
   * Configurations detailing options that can be used in the command.
   *
   * i.e. "!ping --private".
   */
  // tslint:disable-next-line
  options: any;

  /**
   * Configurations detailing flags that can be used in the command.
   *
   * i.e. "!ping -d".
   */
  // tslint:disable-next-line
  flags: any;

}

/**
 * Declares an interface schema for Command Cooldown configurations.
 */
export interface CommandCooldownConfig {

  /**
   * Cooldown per user usage.
   */
  user: number;

  /**
   * Cooldown for global usage.
   */
  global: number;

}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandAuthorizationConfig {

  /**
   * Determines whether or not the command is usable in direct messages.
   */
  enabledInDirectMessages: boolean;

  /**
   * Determines required Eminence in order to use this command.
   */
  accessEminence: number;

}

/**
 * Declares an interface schema for Authorization Configurations in Commands.
 */
export interface CommandClientAuthorizationConfig extends CommandAuthorizationConfig {

  /**
   * House blacklisting lists for this command.
   */
  blacklist: CommandClientAuthorizationListConfig;

  /**
   * House whitelisting lists for this command.
   */
  whitelist: CommandClientAuthorizationListConfig;

}

/**
 * Declares an interface schema for authorization lists in Commands.
 */
export interface CommandClientAuthorizationListConfig {

  /**
   * A list of unique identifiers for users to in authorization configurations.
   */
  users: string[];

}
