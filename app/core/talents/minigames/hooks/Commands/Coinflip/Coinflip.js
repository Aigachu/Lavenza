/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Coinflip command.
 *
 * Flip a coin!
 */
export default class Coinflip extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(resonance) {

    // Get the value of the flip. Returns either 0 or 1.
    let flip = Math.floor(Math.random() * 2);

    // The flip result is determined by the returned value.
    // 0 is Tails.
    // 1 is Heads.
    let result = flip === 0 ? 'Tails' : 'Heads';

    // This command will have different types of flips. It will be selected by random.
    // Each 'flip type' will take different amounts of time and print different messages.
    // We'll store these in an array.
    let flip_types = [];

    // Setting the flip types.
    flip_types.push({
      message: "Coinflip emulation has begun! Just a moment...",
      timeout: 2
    });

    flip_types.push({
      message: "Coinflip emulation has begun. Looks like...",
      timeout: 1
    });

    flip_types.push({
      message: `Coinflip emulation has begun. The coin spins. Wait for it...`,
      timeout: 5
    });

    // The 'rand' variable will store the flip type.
    // We get it by generating a random number when choosing which key to get from the array.
    let rand = flip_types[Math.floor(Math.random() * flip_types.length)];

    // Build the response, with translations.
    let response = await Lavenza.__(`{{author}} obtained **{{result}}**!`, {author: resonance.message.author.username, result: result}, resonance.locale);

    // Send initial message.
    await resonance.__reply(rand.message);

    // Depending on the type of client, we do different actions.
    switch(resonance.client.type) {

      // If we're in Discord, we do a bit of typing to make it seem more natural.
      case Lavenza.ClientTypes.Discord: {
        // Start typing with the chosen answer's timeout, then send the reply to the user.
        await resonance.client.typeFor(1, resonance.channel);
        await Lavenza.wait(rand.timeout);
        await resonance.reply(response);
        await resonance.message.channel.stopTyping();
        return;
      }

      // If we're in Twitch, simply send the answer.
      case Lavenza.ClientTypes.Twitch: {
        await Lavenza.wait(rand.timeout);
        // Start typing with the chosen answer's timeout, then send the reply to the user.
        await resonance.reply(response);
        return;
      }
    }

  }

}