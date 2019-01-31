/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * RollDice Command!
 *
 * Roll dice to test your luck! Play the lottery if you roll 10000/10000.
 */
export default class RollDice extends Lavenza.Command {

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

    // Roll types are randomized and have different delays.
    this.rolls = [];

    // Set roll types.
    this.rolls.push({
      message: "*rolls the dice normally*",
      timeout: 2
    });
    this.rolls.push({
      message: "*throws the dice on the ground violently...*",
      timeout: 3
    });
    this.rolls.push({
      message: "*accidentally drops the dice on the ground while getting ready*",
      timeout: 4
    });
    this.rolls.push({
      message: "*spins the dice*",
      timeout: 4
    });

  }

  /**
   * Get a random answer for 8Ball to say.
   *
   * @returns {Promise<string>}
   *   The answer, fetched randomly from the list of answers.
   */
  static async getRandomRoll() {

    // We'll use a random number for the array key.
    return this.rolls[Math.floor(Math.random() * this.rolls.length)];

  }

  /**
   * @inheritDoc
   */
  static async execute(resonance) {

    // Determine the type of die requested.
    // It will default to 6 face dice.
    let faces = resonance.order.args._[0] || 6;

    // If the # of faces is not a number, we send a message and return.
    if (isNaN(faces)) {
      return;
    }

    // Roll the die.
    let roll = Math.floor(Math.random() * faces) + 1;

    // Choose a roll type with a random key.
    let rand = await this.getRandomRoll();

    // Send the initial message.
    await resonance.reply(rand.message);

    // Invoke Client Handlers to determine what to do in each client.
    /** @see ./handlers */
    await this.handlers(resonance, {
        roll: roll,
        delay: rand.timeout
      }
    );
  }

}