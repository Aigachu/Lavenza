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
   * This is the static build function of the command.
   *
   * You can treat this as a constructor. Assign any properties that the command may
   * use!
   *
   * @inheritDoc
   */
  static async build(config, talent) {

    // The build function must always run the parent's build function! Don't remove this line.
    await super.build(config, talent);

    // This command will have different types of flips. It will be selected by random.
    // Each 'flip type' will take different amounts of time and print different messages.
    // We'll store these in an array.
    this.flips = [];
    this.flips.push({
      message: "Coinflip emulation has begun! Just a moment...",
      timeout: 2
    });
    this.flips.push({
      message: "Coinflip emulation has begun. Looks like...",
      timeout: 1
    });
    this.flips.push({
      message: `Coinflip emulation has begun. The coin spins. Wait for it...`,
      timeout: 5
    });

  }

  /**
   * Get a random answer for 8Ball to say.
   *
   * @returns {Promise<string>}
   *   The answer, fetched randomly from the list of answers.
   */
  static async getRandomFlip() {

    // We'll use a random number for the array key.
    return this.flips[Math.floor(Math.random() * this.flips.length)];

  }

  /**
   * @inheritDoc
   */
  static async execute(resonance) {

    // Get the result of the flip. Returns either 0 or 1.
    let result = Math.floor(Math.random() * 2) === 0 ? 'Tails' : 'Heads';

    // The 'rand' variable will store the flip type.
    // We get it by generating a random number when choosing which key to get from the array.
    let rand = await this.getRandomFlip();

    // Invoke Client Handlers to determine what to do in each client.
    /** @see ./handlers */
    await this.handlers(resonance, {
        initialMessage: rand.message,
        result: result,
        delay: rand.timeout
      }
    );

  }

}