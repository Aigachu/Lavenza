/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Instruction } from "../../Instruction/Instruction";

/**
 * Provides an abstract class for Help Handlers.
 *
 * Help handlers are simple classes that determine what to do when the help argument is invoked for a command.
 */
export abstract class CommandHelpHandler {

  /**
   * Method that handles what happens when the help argument is invoked.
   *
   * @param instruction
   *   Instruction to fire the help handler for.
   */
  public abstract async help(instruction: Instruction): Promise<void>;

}
