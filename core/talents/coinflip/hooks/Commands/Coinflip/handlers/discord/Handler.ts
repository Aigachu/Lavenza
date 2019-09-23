/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import CommandClientHandler from "../../../../../../../lib/Lavenza/Bot/Command/CommandClientHandler";
import DiscordResonance from "../../../../../../../lib/Lavenza/Bot/Resonance/DiscordResonance";

/**
 * A simple client handler.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
export default class Handler extends CommandClientHandler {

  /**
   * Resonance that triggered the command.
   */
  public resonance: DiscordResonance;

  /**
   * @inheritDoc
   */
  async execute(data: any = {}) {
    // Do nothing.
  }

  /**
   * Fetch Discord user of the opponent being challenged for a guess game.
   *
   * @param data
   *   Data being sent to this handler.
   */
  async getOpponent(data: any) {
    let input = data.userInput;
    input = input.replace('<@', '');
    input = input.replace('!', '');
    input = input.replace('>', '');
    let opponent = this.resonance.guild.members.find(member => member.id === input);
    return opponent || undefined;
  }

}