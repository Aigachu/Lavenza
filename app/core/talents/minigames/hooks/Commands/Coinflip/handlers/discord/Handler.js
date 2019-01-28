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

    // Bold the result for emphasis.
    data.result = await Lavenza.bold(data.result);

    // Build the final response, with translations.
    let response = await Lavenza.__(`{{author}} obtained {{result}}!`, {author: this.resonance.message.author, result: data.result}, this.resonance.locale);

    // Send initial message.
    // We modify it to give it a bit of Markdown flavor.
    let initialMessage = await Lavenza.italics(data.initialMessage);
    await this.resonance.__reply(initialMessage);

    // Start typing with the chosen answer's timeout, then send the reply to the user.
    await this.resonance.client.typeFor(data.delay, this.resonance.channel);
    await this.resonance.reply(response);

  }

}