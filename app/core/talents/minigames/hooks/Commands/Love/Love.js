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

    // Processes the command only if there's input.
    if (Lavenza.isEmpty(resonance.order.rawContent)) {
      // Store the message to be returned.
      resonance.message.reply(`${resonance.message.author}, you have 100% for ZeRo & M2K's AS5es if you don't specify an object or person!`);
      return;
    }

    // Get the thing the caller is getting love percentage for.
    // Lol Aiga naming your variable 'thing' really? xD
    let thing = resonance.order.rawContent;

    // Calculate the percent.
    // It's completely random.
    // @TODO - Make it calculate a percent using an algorithm, so the result is always the same.
    let percent = Math.floor(Math.random() * 100);

    // Store the message to be returned.
    message = `There is __**${percent}%**__ love between ${resonance.message.author} and **${thing}**!`;

    // I'll be honest, I forget the joke behind the message that is returned here. But it seems funny.

    // Send the message.
    resonance.message.channel.send(message);

  }

}