/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Handicap command.
 */
export default class SmashHandicap extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {
    // Array to store handicaps.
    let handicaps = [];

    // Set handicap types.
    handicaps.push({
      title: "Air Mac",
      details: "You may not use aerials during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "FG Link",
      details: "You may only use Special Moves (B) moves to attack during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "A for Effort",
      details: "You may only use Normal Attacks (A) moves to attack during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Smashing Effort",
      details: "You may only attack using smash attacks!",
      timeout: 3
    });
    handicaps.push({
      title: "Take Flight",
      details: "You may only attack using aerials!",
      timeout: 3
    });
    handicaps.push({
      title: "We Tech Those",
      details: "You may not tech during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Dunkin Donuts",
      details: "You may only finish off stocks with Dunks!",
      timeout: 3
    });
    handicaps.push({
      title: "SOLOYOLO",
      details: "You may only kill by taking someone to the shadow realm with you!",
      timeout: 3
    });
    handicaps.push({
      title: "Best Defense is Offense",
      details: "You may not shield during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Counterattack",
      details: "You may only kill someone by using a counter move!",
      timeout: 3
    });
    handicaps.push({
      title: "Manhandled",
      details: "You may only grab during this match to attack!",
      timeout: 3
    });
    handicaps.push({
      title: "One and Done",
      details: "You may not recover once knocked off stage!",
      timeout: 3
    });
    handicaps.push({
      title: "Pitch a Tent",
      details: "You may only win by timing your opponent out!",
      timeout: 3
    });
    handicaps.push({
      title: "Trigger Happy",
      details: "You may not use your shoulder buttons (shield buttons) during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Slow and Steady",
      details: "You may only walk in order to move during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Get your Footing",
      details: "You may only end your opponent's stocks with footstools!",
      timeout: 3
    });
    handicaps.push({
      title: "The Bakery",
      details: "You may not roll during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Iron Boots",
      details: "You may not jump during this match!",
      timeout: 3
    });
    handicaps.push({
      title: "Comeback King",
      details: "You must forfeit your first stock at the beginning of the match!",
      timeout: 3
    });
    handicaps.push({
      title: "Too Edgy",
      details: "You may not edgeguard the opponent during the match!",
      timeout: 3
    });
    handicaps.push({
      title: "On Tilt",
      details: "You must kill the opponent utilizing a tilt attack!",
      timeout: 3
    });

    // Randomly select a handicap from the array.
    let rand = handicaps[Math.floor(Math.random() * handicaps.length)];

    // Generate the message.
    let message = `**${rand.title}**`;
    message += `\n${rand.details}`;
    message += `\n\nGood luck! :P`;

    // Send the results to the caller.
    // Add a bit of delay for flavor.
    resonance.message.reply("your handicap will be...").then(() => {
      resonance.message.channel.startTyping(1);
      Lavenza.wait(rand.timeout).then(() => {
        resonance.message.channel.send(message);
        resonance.message.channel.stopTyping();
      });
    });
  }

}