/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { CommandClientConfig, CommandConfigurations } from "../Command/CommandConfigurations";

/**
 * Provide an interface for Instruction configurations, which are simply a regrouping of the command's configurations.
 */
export interface InstructionCommandConfig {

  /**
   * Base configurations of the command.
   */
  base: CommandConfigurations;

  /**
   * Client specific configurations of the command for the instruction.
   */
  client: CommandClientConfig;

}
