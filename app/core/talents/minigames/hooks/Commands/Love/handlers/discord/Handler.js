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
   * Execute this handler's tasks.
   *
   * @inheritDoc
   */
  async execute(data = {}) {

    // Making the text sexy.
    data.percent = await Lavenza.bold(data.percent);
    data.thing = await Lavenza.bold(data.thing);

    // Send the result message.
    await this.resonance.__reply(`There is {{percent}} love between {{author}} and {{thing}}!`, {percent: data.percent, author: this.resonance.author, thing: data.thing});

  }

}