/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {CommandClientHandler} from "../../../../../../../lib/Lavenza/Bot/Command/CommandClientHandler";
import {TwitchResonance} from "../../../../../../../lib/Lavenza/Bot/Resonance/TwitchResonance";
/**
 * A simple client handler.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
export class Handler extends CommandClientHandler {

  /**
   * Resonance that triggered the command.
   */
  public resonance: TwitchResonance;

  /**
   * @inheritDoc
   */
  async execute(data: any = {}) {

  }

}
