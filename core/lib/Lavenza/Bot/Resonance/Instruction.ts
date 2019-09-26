/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {Command} from "../Command/Command";

/**
 * Provides an "Instruction" model that regroups information about a command that was interpreted from a message.
 *
 * This class will contain relevant information surrounding the command called.
 *
 * Instructions are sent for approval before they carry out the command.
 */
export interface Instruction {
  /**
   * Command that contained the current Order.
   */
  command: Command;

  /**
   * Arguments of the command received, if any.
   */
  arguments: any;

  /**
   * Raw content of the message that was deciphered as an order.
   */
  content: any;
}