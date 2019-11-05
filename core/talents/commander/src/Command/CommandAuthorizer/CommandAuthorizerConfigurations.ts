/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { BotConfigurations } from "../../../../../lib/Lavenza/Bot/BotConfigurations";
import { BotClientConfig, ClientConfigurations, CommandClientConfig } from "../../../../../lib/Lavenza/Bot/Client/ClientConfigurations";
import { CommandConfigurations, CommandParameterConfig } from "../CommandConfigurations";

/**
 * Provide an interface for a Command Authorizer's collection of configurations.
 *
 * Since this class needs a lot of configurations to make checks, we organize them in an easy to access Object.
 *
 * We provide an interface for better type completion.
 */
export interface CommandAuthorizerConfigurationsCollection {

  /**
   * House bot's configurations.
   */
  bot: CommandAuthorizerBotConfigurations;

  /**
   * House command's configurations.
   */
  command: CommandAuthorizerCommandConfigurations;

  /**
   * House client's configurations.
   */
  client: ClientConfigurations;

}

/**
 * Provides an interface for Command Authorizer Bot configurations.
 */
export interface CommandAuthorizerBotConfigurations {

  /**
   * House core bot configurations.
   */
  base: BotConfigurations;

  /**
   * House client specific configurations for bot.
   */
  client: BotClientConfig;

}

/**
 * Provides an interface for Command Authorizer Command configurations.
 */
export interface CommandAuthorizerCommandConfigurations {

  /**
   * House core command configurations.
   */
  base: CommandConfigurations;

  /**
   * House client specific configurations for command.
   */
  client: CommandClientConfig;

  /**
   * House command's parameter configurations.
   */
  parameters: CommandParameterConfig;

}
