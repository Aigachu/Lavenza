/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { AbstractObject } from "../../Types";
import { CommandClientConfig } from "../Client/ClientConfigurations";
import { Command } from "../../../../talents/commander/src/Command/Command";
import { CommandConfigurations } from "../../../../talents/commander/src/Command/CommandConfigurations";

/**
 * Provides an "Instruction" model that regroups information about a command that was interpreted from a message.
 *
 * This class will contain relevant information surrounding the command called.
 *
 * Instructions are sent for approval before they carry out the command.
 */
export interface Instruction {

  /**
   * Arguments of the command received, if any.
   */
  arguments: AbstractObject;

  /**
   * Command that contained the current Order.
   */
  command: Command;

  /**
   * Store active configurations of the command this instruction is for.
   */
  config: InstructionCommandConfig;

  /**
   * Raw content of the message that was deciphered as an order.
   */
  content: string;

}

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
