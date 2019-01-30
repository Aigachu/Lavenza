/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import fs from 'fs';

/**
 * Smash IronMan command.
 */
export default class SmashIronMan extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(resonance) {
    // Get all SSB4 character directories from the maiden's assets folder.
    let smash4_character_directories = fs.readdirSync(this.talent.directory + '/assets/portraits/ultimate');

    // Why the fuck is this a - 2?
    // Oh, right. There are two folders that aren't characters...
    // Misc...And MEMES...LMAO!
    // Anyways, this gets the roster size.
    let roster_size = smash4_character_directories.length - 2;

    // Number of characters to return.
    let count = roster_size;

    // Get the input if any.
    if (!Lavenza.isEmpty(resonance.order.args._)) {
      // The count is assumed to be the first input given.
      count = resonance.order.args._[0];
    }

    // If the input is not a number, we'll send them running.
    if (isNaN(count)) {
      // Send a message saying they fucked up.
      await resonance.__reply(`I only accept digital input okay? I'm sorry!`);
      return;
    }

    // The input data should be a number.
    // @TODO - Check if the data is a number before even doing this check.
    if (count > roster_size) {
      // Send a message saying they fucked up.
      await resonance.__reply(`That number is too high! There are only {{rosterSize}} characters in the Smash 4 roster you idiot! Didn't you know that?! Wow...`, {rosterSize: roster_size});
      return;
    }

    // Get the number of characters from the data.
    let number_of_characters = count;

    // Array to store the list of characters.
    let charlist = [];

    // Array to store the list of characters that are chosen for the caller.
    let chosen_characters = [];

    // For as many times as the given number from the input...
    for (let i = 0; i < number_of_characters; i++) {

      // Get a random character.
      let random_character = smash4_character_directories[Math.floor(Math.random() * smash4_character_directories.length)];

      // If the random character chosen is 'Misc', 'Meme' or already chosen, we re-select
      // @TODO - Load characters into an array, and when they are chosen, slice them.
      // Also, slice Misc and Memes before even looping into the array.
      while (random_character in chosen_characters || random_character === "Misc" || random_character === "Memes") {
        random_character = smash4_character_directories[Math.floor(Math.random() * smash4_character_directories.length)];
      }

      // Add character to the charlist.
      charlist[i] = random_character;

      // Add character to the chosen characters.
      chosen_characters[random_character] = random_character;
    }

    // Set message.
    await resonance.__reply("Here's your list of iron man characters!");

    // Set variable for characters message.
    let charactersMessage  = '';

    // Append characters the the list.
    charlist.every((char) => {
      charactersMessage += `${char} | `;
      return true;
    });

    await resonance.reply(charactersMessage);

  }

}