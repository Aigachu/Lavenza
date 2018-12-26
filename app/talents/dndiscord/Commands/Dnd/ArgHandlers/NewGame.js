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

    // Get the identity of the Discord user that sent the Resonance.
    let character = await command.talent.getCharacter(resonance.message.author.id).catch(Lavenza.stop);

    // If the character already exists, we should send a message and exit.
    if (!Lavenza.isEmpty(character)) {
      console.log(await character.getData());
      resonance.message.reply('you seem to already have a character. You have to clear your save data to create a new one! You can accomplish this with the `--restart` argument.');
    }

    // If not, we can get on with the creation process.
    // await resonance.bot.addPrompt(resonance, () => {
    //
    // }).catch(Lavenza.stop);

  }
}