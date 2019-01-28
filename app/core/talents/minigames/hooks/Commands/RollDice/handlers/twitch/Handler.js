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

    // Build the response.
    let response = await Lavenza.__("{{author}}, the result of your roll is: {{roll}}!", {
      author: this.resonance.author.username,
      roll: data.roll
    }, this.resonance.locale);

    // Await the delay patiently...
    await Lavenza.wait(data.delay);

    // Send the response.
    await this.resonance.reply(response);

  }

}