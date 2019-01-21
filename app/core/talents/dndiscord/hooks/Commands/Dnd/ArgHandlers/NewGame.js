/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Argument handler for the 'newgame' argument in the DND command.
 */
export default class NewGame {

  /**
   * Handle command 'newgame' option.
   *
   * @param {Resonance} resonance
   *   Resonance that issued the command.
   * @param {*} core
   *   Core DNDiscord Talent.
   *
   */
  static async handle(resonance, core) {

    // Get the player identity of the Discord user that sent the resonance.
    let player = await core.getPlayerData(resonance.message.author.id);

    // If player data doesn't exists, we exit the process here.
    if (Lavenza.isEmpty(player)) {
      await resonance.reply(`Hmm, it doesn't seem like you have an account. You may want to create one with the \`--register\` option! If this is an error, make sure to contact Aiga directly. :)`);
      return;
    }

    // @TODO - Check if the player already has 3 characters assigned.

    // Define variable to store the conversation channel.
    let conversationChannel = resonance.message.channel;

    // Now we want to check if the request was done in DMs. If not, we tell the player that we'll DM them shortly.
    if (resonance.message.channel.type !== "dm") {

      // Make her type for a bit.
      await resonance.client.typeFor(2, conversationChannel);

      // Tell the user we'll take this to the DMs.
      await resonance.reply(`Ah you want to create a character? Awesome! I'll dm you in just a second. ;)`);

      // Wait 5 seconds.
      await Lavenza.wait(5);

      // Create a DMChannel between the bot and the user (to make sure it exists).
      await resonance.message.author.createDM();

      // Set the conversation channel.
      conversationChannel = resonance.message.author.dmChannel;
    }

    // Now we enter the character creation process.
    await resonance.send(conversationChannel, `Uhhh! This command actually isn't ready yet...(Aiga come on...Hurry up!) :sweat_smile:`);

    // Make her type for a bit.
    await resonance.client.typeFor(2, conversationChannel);

    await resonance.send(conversationChannel, `Ummm...In the meantime here's your player data? I guess?`);

    await resonance.bot.getClient(Lavenza.ClientTypes.Discord).sendEmbed(conversationChannel, {
      description: `\`\`\`${JSON.stringify(await player.data(), null, '\t')}\`\`\``
    });

  }
}