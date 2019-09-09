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
    data.roll = await Lavenza.bold(data.roll);

    // Build the response.
    let response = await Lavenza.__("{{author}}, the result of your roll is: {{roll}}!", {
      author: this.resonance.author,
      roll: data.roll
    }, this.resonance.locale);

    // Start typing with the chosen answer's timeout, then send the reply to the user.
    await this.resonance.client.typeFor(data.delay, this.resonance.channel);
    await this.resonance.reply(response);

  }

}