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

    // Build the response, with translations.
    let response = await Lavenza.__(`{{author}} obtained {{result}}!`, {
      author: this.resonance.message.author.username,
      result: data.result
    }, this.resonance.locale);

    // Wait for the delay.
    await Lavenza.wait(data.delay);

    // Send the result.
    await this.resonance.reply(response);

  }

}