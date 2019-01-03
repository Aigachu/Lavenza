/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Argument handler for the 'register' argument in the DND command.
 */
export default class Register {

  /**
   * Handle command 'register' option.
   *
   * @param {Order} order
   *   Order detailing the command.
   * @param {Resonance} resonance
   *   Resonance that issued the command.
   * @param {*} command
   *   Command that this argument handler is being used for.
   *
   */
  static async handle(order, resonance, command) {
    await this.registration(order, resonance, command).catch(Lavenza.continue);
  }


  /**
   * Handle command 'register' option.
   *
   * @param {Order} order
   *   Order detailing the command.
   * @param {Resonance} resonance
   *   Resonance that issued the command.
   * @param {*} command
   *   Command that this argument handler is being used for.
   *
   */
  static async registration(order, resonance, command) {

    // If a player already exists for this user, we should tell them this.
    // Get the player identity of the Discord user that sent the resonance.
    let playerData = await command.talent.getPlayerData(resonance.message.author.id).catch(Lavenza.stop);

    // If player data already exists, we exit the process here.
    if (!Lavenza.isEmpty(playerData)) {
      await resonance.message.reply(`Hey, you already have an account! You don't need to register again.`).catch(Lavenza.stop);
      return;
    }

    // We'll progressively build the player's data.
    playerData = {};

    // Set the Player's ID. It will be the same as their Discord User ID.
    playerData.id = resonance.message.author.id;

    // Set the creation timestamp.
    playerData.creationDate = Date.now();

    // Let's add some flavor to it. Make her type for a bit.
    await resonance.client.typeFor(2, resonance.message.channel);

    // A little welcome message.
    await resonance.message.reply(`Welcome to **Dungeons & Discord**!`).catch(Lavenza.stop);

    // Type for 3 seconds.
    await resonance.client.typeFor(3, resonance.message.channel);

    // Ask the player if they want green tea.
    /** @catch Throw the error to stop execution. */
    await resonance.bot.prompt(`First thing's first, to break the ice, would you like some green tea?`, resonance, 10, async (responseResonance, prompt) => {

      // Type for 2 seconds.
      await resonance.client.typeFor(2, resonance.message.channel);

      // Check if the user confirms.
      if (Lavenza.Sojiro.isConfirmation(responseResonance.content)) {

        // Save the green tea for later.
        await resonance.message.reply(`Awesome! I'll get started on that right away. In the meantime...`).catch(Lavenza.stop);
        playerData.greenTea = true;

      } else {
        await resonance.message.reply(`Oh! That's completely fine. Moving on...`).catch(Lavenza.stop);
      }

    }).catch(error => {
      resonance.message.channel.send(`Seems like you couldn't answer me in time...That's alright! You can try again later. :)`);

      // We forcefully throw an error here to end execution. This means that without this prompt, we shouldn't proceed.
      Lavenza.throw(error);
    });

    // Type for 4 seconds.
    await resonance.client.typeFor(4, resonance.message.channel);

    // Ask the player more questions...
    // await resonance.bot.addPrompt(`First of all, would you like some green tea? (Y/n)`, resonance, 10, async (responseResonance, prompt) => {
    //
    // }).catch(Lavenza.stop);

    // Little conclusion.
    resonance.message.channel.send(`Well...Now that I think about it, I don't really have questions for you after all! Maybe in a future update. ;)`);

    // Register the player.
    await command.talent.registerPlayer(playerData).catch(Lavenza.stop);

    // More conclusions.
    await resonance.client.typeFor(4, resonance.message.channel);
    resonance.message.channel.send(`I went ahead and created your player in my database. You should be set. Your next step will be to create a character! Use \`--newgame\` to get started with that.`);
    await resonance.client.typeFor(4, resonance.message.channel);
    resonance.message.channel.send(`Remember to let your imagination run wild! And have fun. :)`);

    // If the player asked for tea in the beginning, hand it to them!
    if (playerData.greenTea) {
      await resonance.client.typeFor(5, resonance.message.channel);
      resonance.message.reply(`wait! I almost forgot...Here's your tea! - :tea:`).catch(Lavenza.stop);
    }
  }
}