/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import _ from 'underscore';
import jsonic from 'jsonic';

/**
 * Hello command.
 *
 * Literally just replies with 'Hello!'.
 *
 * A great testing command.
 */
export default class Gestalt extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async build(config, talent) {

    // Run the parent build function. Must always be done.
    await super.build(config, talent);

    // Set REST protocols.
    this.protocols = [
      'get',
      'post',
      'update',
      'delete'
    ];

  }

  /**
   * @inheritDoc
   */
  static async execute(resonance) {

    // The first argument must be one of the protocols, or we don't do anything.
    if (!_.contains(this.protocols, resonance.order.args._[0])) {
      resonance.message.reply('You need to use one of the API protocols.');
      return;
    }

    let protocol = resonance.order.args._[0];
    let endpoint = resonance.order.args._[1];
    let payload = jsonic(resonance.order.args._.slice(2).join(' ')) || {};

    switch (protocol) {
      case 'get': {
        let getResult = await Lavenza.Gestalt.get(endpoint);

        if (Lavenza.isEmpty(getResult)) {
          await resonance.message.__reply('No data found for that path, sadly. :(');
          return;
        }

        // If a Discord Client exists for the bot, we send a message to the Discord architect.
        if (!Lavenza.isEmpty(resonance.bot.getClient(Lavenza.ClientTypes.Discord))) {
          let getResultToString = JSON.stringify(getResult, null, '\t');
          await resonance.send(resonance.bot.architect.discord, '```\n' + getResultToString + '\n```');
        }
        break;
      }

      case 'update': {
        let updateResult = await Lavenza.Gestalt.update(endpoint, payload).catch(Lavenza.continue);

        if (Lavenza.isEmpty(updateResult)) {
          await resonance.__reply('No data found at that path, sadly. :(');
          return;
        }

        // If a Discord Client exists for the bot, we send a message to the Discord architect.
        if (!Lavenza.isEmpty(resonance.bot.getClient(Lavenza.ClientTypes.Discord))) {
          let updateResultToString = JSON.stringify(updateResult, null, '\t');
          await resonance.send(resonance.bot.architect.discord, '```\n' + updateResultToString + '\n```');
        }
        break;
      }
    }
  }

}