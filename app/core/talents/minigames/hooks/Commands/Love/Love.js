/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Love command!
 *
 * Test your love for something...Or someone... ;)
 */
export default class Love extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(resonance) {

    // Variable to hold the message.
    let message = '';

    // Get the thing the caller is getting love percentage for.
    // Lol Aiga naming your variable 'thing' really? xD
    let thing = resonance.order.rawContent;

    // Calculate the percent.
    // It's completely random.
    // @TODO - Make it calculate a percent using an algorithm, so the result is always the same.
    let percent = `${Math.floor(Math.random() * 100)}%`;

    // Invoke Client Handlers to determine what to do in each client.
    /** @see ./handlers */
    await this.fireClientHandlers(resonance, {
        thing: thing,
        percent: percent,
      }
    );

  }

}