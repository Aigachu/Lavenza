/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Register from './ArgHandlers/Register';
import NewGame from './ArgHandlers/NewGame';

/**
 * DND command!
 *
 * Central command to manage the general features of the Dungeons & Discord game!
 *
 * Users can use this command to register and start their adventure.
 */
export default class Dnd extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {

    // If the 'register' argument is used, we fire the New Game handler.
    if ('register' in order.args) {
      await Register.handle(order, resonance, this.talent).catch(Lavenza.stop);
      return;
    }

    // If the 'newgame' argument is used, we fire the New Game handler.
    if ('newgame' in order.args) {
      await NewGame.handle(order, resonance, this.talent).catch(Lavenza.stop);
      return;
    }

    // await resonance.bot.getClient(Lavenza.ClientTypes.Discord).sendEmbed(resonance.message.channel, {
    //   description: `\`\`\`${JSON.stringify(order.args, null, '\t')}\`\`\``
    // }).catch(Lavenza.stop);

  }

}