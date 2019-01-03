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
   * @param {*} core
   *   Core DNDiscord Talent.
   *
   */
  static async registration(order, resonance, core) {

    // If a player already exists for this user, we should tell them this.
    // Get the player identity of the Discord user that sent the resonance.
    let playerData = await core.getPlayerData(resonance.message.author.id).catch(Lavenza.stop);

    // If player data already exists, we exit the process here.
    if (!Lavenza.isEmpty(playerData)) {
      await resonance.message.reply(`Hey, you already have an account! You don't need to register again.`).catch(Lavenza.stop);
      return;
    }

    // Define variable to store the conversation channel.
    let conversationChannel = resonance.message.channel;

    // Now we want to check if the request was done in DMs. If not, we tell the player that we'll DM them shortly.
    if (resonance.message.channel.type !== "dm") {

      // Make her type for a bit.
      await DiscordClient.typeFor(2, conversationChannel);

      // Tell the user we'll take this to the DMs.
      await resonance.message.reply(`Ooh, you wanna register for DNDiscord? Alright! I'll dm you in a second!`).catch(Lavenza.stop);

      // Wait 5 seconds.
      await Lavenza.wait(5).catch(Lavenza.stop);

      // Create a DMChannel between the bot and the user (to make sure it exists).
      await resonance.message.author.createDM().catch(Lavenza.stop);

      // Set the conversation channel.
      conversationChannel = resonance.message.author.dmChannel;
    }

    // We'll progressively build the player's data.
    playerData = {};

    // Set the Player's ID. It will be the same as their Discord User ID.
    playerData.id = resonance.message.author.id;

    // Set the creation timestamp.
    playerData.creationDate = Date.now();

    // Let's add some flavor to it. Make her type for a bit.
    await DiscordClient.typeFor(2, conversationChannel);

    // A little welcome message.
    await resonance.message.author.send(`Welcome to **Dungeons & Discord**!`).catch(Lavenza.stop);

    // Type for 3 seconds.
    await DiscordClient.typeFor(3, conversationChannel);

    // Ask the player if they want green tea.
    /** @catch Throw the error to stop execution. */
    await resonance.bot.prompt(`First thing's first, to break the ice, would you like some green tea?`, conversationChannel, resonance, 10, async (responseResonance, prompt) => {

      // Type for 2 seconds.
      await DiscordClient.typeFor(2, conversationChannel);

      // Check if the user confirms.
      if (Lavenza.Sojiro.isConfirmation(responseResonance.content)) {

        // Save the green tea for later.
        await conversationChannel.send(`Awesome! I'll get started on that right away. In the meantime...`).catch(Lavenza.stop);
        playerData.greenTea = true;

      } else {
        await conversationChannel.send(`Oh! That's completely fine. Moving on...`).catch(Lavenza.stop);
      }

    }).catch(error => {
      conversationChannel.send(`Seems like you couldn't answer me in time...That's alright! You can try again later. :)`);

      // We forcefully throw an error here to end execution. This means that without this prompt, we shouldn't proceed.
      Lavenza.throw(error);
    });

    // Type for 4 seconds.
    await DiscordClient.typeFor(4, conversationChannel);

    // Ask the player more questions...
    // await resonance.bot.addPrompt(`First of all, would you like some green tea? (Y/n)`, resonance, 10, async (responseResonance, prompt) => {
    //
    // }).catch(Lavenza.stop);

    // Little conclusion.
    conversationChannel.send(`Okay so, normally I'd ask you a bunch of questions, but it seems like Aiga's been lazy as usual...:sweat_smile:`);

    // Register the player.
    await core.registerPlayer(playerData).catch(Lavenza.stop);

    // More conclusions.
    await DiscordClient.typeFor(4, conversationChannel);
    conversationChannel.send(`I went ahead and created your player in my database. You should be set. Your next step will be to create a character! Use \`;° dnd --newgame\` to get started with that.`);
    await DiscordClient.typeFor(4, conversationChannel);
    conversationChannel.send(`Remember to let your imagination run wild! And have fun. :)`);

    // If the player asked for tea in the beginning, hand it to them!
    if (playerData.greenTea) {
      await Lavenza.wait(10).catch(Lavenza.stop);
      await DiscordClient.typeFor(2, conversationChannel);
      conversationChannel.send(`Wait! I almost forgot...Here's your tea! - :tea:`).catch(Lavenza.stop);
    }
  }
}