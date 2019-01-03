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
class RollDice extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {

    // Array to hold all of the rolls.
    let result = "";

    let dice_faces = order.args._[0] || 6;

    // Roll the dice
    let roll = (Math.floor(Math.random() * dice_faces) + 1);

    // Store result message.
    let result_msg = " the result of your roll is: **" + roll + "**!";

    // Roll types are randomized and have different delays.
    let roll_types = [];

    // Set role types.
    roll_types.push({
      message: "_rolls the dice normally_",
      timeout: 1
    });
    roll_types.push({
      message: "_rolls the dice violently_\n_the die falls on the ground_",
      timeout: 2
    });
    roll_types.push({
      message: "_accidentally drops the dice on the ground while getting ready_\nOops! Still counts right...?",
      timeout: 2
    });
    roll_types.push({
      message: "_spins the dice_\nWait for it...",
      timeout: 5
    });

    // Choose a roll type with a random key.
    let rand = roll_types[Math.floor(Math.random() * roll_types.length)];

    // Send everything we just computed to the channel.
    resonance.message.channel.send(rand.message).then(() => {
      resonance.message.channel.startTyping(1);
      Lavenza.wait(rand.timeout).then(() => {
        resonance.message.reply(result_msg);
        resonance.message.channel.stopTyping();
      });
    });
  }

}