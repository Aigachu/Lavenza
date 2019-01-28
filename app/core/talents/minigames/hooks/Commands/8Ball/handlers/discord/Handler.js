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

    // Put some emphasis on the answer's message.
    let answerMessage = await Lavenza.bold(data.answer);
    answerMessage = await Lavenza.italics(answerMessage);

    // Build the response, translated.
    let response = await Lavenza.__(`8ball says: {{response}}`, {response: answerMessage}, this.resonance.locale);

    // Start typing with the chosen answer's timeout, then send the reply to the user.
    await this.resonance.client.typeFor(1, this.resonance.channel);
    await Lavenza.wait(data.delay);
    await this.resonance.reply(response);
    await this.resonance.message.channel.stopTyping();

  }

}