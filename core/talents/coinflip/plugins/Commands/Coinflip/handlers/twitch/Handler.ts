/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { TwitchResonance } from "../../../../../../../lib/Lavenza/Client/Twitch/TwitchResonance";
import { AbstractObject } from "../../../../../../../lib/Lavenza/Types";
import { CommandClientHandler } from "../../../../../../commander/src/Command/CommandClientHandler";

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
   * Execute handler tasks!
   *
   * @inheritDoc
   */
  public async execute(data: AbstractObject = {}): Promise<void> {
    // Do nothing for now!
  }

}
