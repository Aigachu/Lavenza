/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Instruction } from "../../../Instruction/Instruction";
import { CommandHelpHandler } from "../../CommandHelpHandler/CommandHelpHandler";

/**
 * Provides an abstract class for Help Handlers.
 *
 * Help handlers are simple classes that determine what to do when the help argument is invoked for a command.
 */
export class TwitchCommandHelpHandler extends CommandHelpHandler {

  /**
   * Method that handles what happens when the help argument is invoked.
   *
   * @param instruction
   *   Instruction to fire the help handler for.
   */
  public async help(instruction: Instruction): Promise<void> {
    await instruction.resonance.send(instruction.resonance.author, "Sadly, command help text is currently not available for Twitch. Sorry!");
  }

}
