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
   * @inheritDoc
   */
  static async execute(resonance) {

    // Array to hold all of the rolls.
    let result = "";

    let dice_faces = resonance.order.args._[0] || 6;

    // Roll the dice
    let roll = Math.floor(Math.random() * dice_faces) + 1;

    // Roll types are randomized and have different delays.
    let roll_types = [];

    // Set roll types.
    roll_types.push({
      message: "*rolls the dice normally*",
      timeout: 1
    });
    roll_types.push({
      message: "*throws the dice on the ground violently...*",
      timeout: 2
    });
    roll_types.push({
      message: "*accidentally drops the dice on the ground while getting ready*",
      timeout: 2
    });
    roll_types.push({
      message: "*spins the dice*",
      timeout: 5
    });

    // Choose a roll type with a random key.
    let rand = roll_types[Math.floor(Math.random() * roll_types.length)];

    // Build the response.
    let response = await Lavenza.__("{{author}}, the result of your roll is: **{{roll}}**!", {
      author: resonance.author.username,
      roll: roll
    }, resonance.locale);

    //
    await resonance.__reply(rand.message);

    // Depending on the type of client, we do different actions.
    switch (resonance.client.type) {

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