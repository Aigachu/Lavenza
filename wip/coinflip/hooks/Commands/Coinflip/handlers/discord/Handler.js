/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * A simple client handler.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
export default class Handler extends Lavenza.CommandClientHandler {

  /**
   * @inheritDoc
   */
  async execute(data = {}) {

  }

  async getOpponent(data) {
    let input = data.userInput;
    input = input.replace('<@', '');
    input = input.replace('!', '');
    input = input.replace('>', '');
    let opponent = this.resonance.guild.members.find(member => member.id === input);
    return opponent || undefined;
  }

}