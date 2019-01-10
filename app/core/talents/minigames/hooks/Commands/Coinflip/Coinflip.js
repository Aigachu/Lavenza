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
      message: "_Coinflip emulation has begun. Just a moment..._",
      timeout: 2
    });

    flip_types.push({
      message: "_Coinflip emulation has begun. Looks like..._",
      timeout: 1
    });

    flip_types.push({
      message: "_Coinflip emulation has begun. The coin spins_\nWait for it...",
      timeout: 5
    });

    // The 'rand' variable will store the flip type.
    // We get it by generating a random number when choosing which key to get from the array.
    let rand = flip_types[Math.floor(Math.random() * flip_types.length)];

    // Send the flip to the channel.
    resonance.message.channel.send(rand.message).then(() => {
      // Start typing for the amount of time the flip_type is set to.
      resonance.message.channel.startTyping(1);
      Lavenza.wait(rand.timeout).then(() => {
        resonance.message.channel.send(`<@${resonance.message.author.id}> obtained **${result}** !`);
        resonance.message.channel.stopTyping();
      });
    });
  }

}