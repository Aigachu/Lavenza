/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Resonance } from "../../../../lib/Lavenza/Resonance/Resonance";
import { AbstractObject } from "../../../../lib/Lavenza/Types";
import { Command } from "../Command/Command";

import { InstructionCommandConfig } from "./InstructionCommandConfig";

/**
 * Provides a class for Instructions, entities that regroup information about a command that was interpreted from a
 * resonance.
 *
 * This class will contain relevant information surrounding the command called.
 *
 * Instructions are sent for approval before they carry out the command.
 */
export class Instruction {

  /**
   * The resonance this instruction was parsed from.
   */
  public resonance: Resonance;

  /**
   * The command prefix used to build this instruction.
   *
   * Can come in handy to save this here.
   */
  public prefix: string;

  /**
   * Arguments of the command received, if any.
   */
  public arguments: AbstractObject;

  /**
   * Command that contained the current Order.
   */
  public command: Command;

  /**
   * Store active configurations of the command this instruction is for.
   */
  public config: InstructionCommandConfig;

  /**
   * Raw content of the message that was deciphered.
   *
   * This is different than the raw content of the resonance, as it will strip any text used to invoke the command.
   *
   * i.e. In a message such as "$ping hi", "$ping " will be stripped, and content will only contain "hi".
   */
  public content: string;

  /**
   * Constructor for Instructions.
   *
   * @param resonance
   *   The Resonance that this instruction was parsed from.
   * @param command
   *   The command that was loaded.
   * @param prefix
   *   The command prefix used to build this instruction.
   * @param config
   *   The command configurations.
   * @param args
   *   The arguments parsed from the command.
   * @param content
   *   The raw content of the instruction.
   */
  public constructor(resonance: Resonance, command: Command, prefix: string, config: InstructionCommandConfig, args: AbstractObject, content: string) {
    this.resonance = resonance;
    this.config = config;
    this.command = command;
    this.arguments = args;
    this.content = content;
  }

}
