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
   * @param {Order} order
   *   Order detailing the command.
   * @param {Resonance} resonance
   *   Resonance that issued the command.
   * @param {*} command
   *   Command that this argument handler is being used for.
   *
   */
  static async handle(order, resonance, command) {

    // Get the player identity of the Discord user that sent the resonance.
    let player = await command.talent.getPlayerData(resonance.message.author.id).catch(Lavenza.stop);

    // If player data doesn't exists, we exit the process here.
    if (Lavenza.isEmpty(player)) {
      await resonance.message.reply(`Hmm, it doesn't seem like you have an account. You may want to create one with the \`--register\` option! If this is an error, make sure to contact Aiga directly. :)`).catch(Lavenza.stop);
      return;
    }

    // Now we enter the character creation process.

    console.log(player);

  }
}