/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as _ from 'underscore';
import * as jsonic from 'jsonic';

// Imports.
import {Gestalt as GestaltService} from '../../../../../lib/Lavenza/Gestalt/Gestalt';
import GestaltTalent from '../../../Gestalt';
import {Command} from '../../../../../lib/Lavenza/Bot/Command/Command';
import {CommandConfigurations} from "../../../../../lib/Lavenza/Bot/Command/CommandConfigurations";
import {Resonance} from '../../../../../lib/Lavenza/Bot/Resonance/Resonance';
import {Sojiro} from '../../../../../lib/Lavenza/Confidant/Sojiro';
import {ClientType} from '../../../../../lib/Lavenza/Bot/Client/ClientType';
import {Igor} from '../../../../../lib/Lavenza/Confidant/Igor';

/**
 * Hello command.
 *
 * Literally just replies with 'Hello!'.
 *
 * A great testing command.
 */
export default class Gestalt extends Command {
  // Store the Gestalt protocols.
  private protocols: string[] = [
    'get',
    'post',
    'update',
    'delete'
  ];

  /**
   * @inheritDoc
   */
  async build(config: CommandConfigurations, talent: GestaltTalent) {
    // Run the parent build function. Must always be done.
    await super.build(config, talent);
  }

  /**
   * @inheritDoc
   */
  async execute(resonance: Resonance) {
    // The first argument must be one of the protocols, or we don't do anything.
    if (!_.contains(this.protocols, resonance.instruction.arguments._[0])) {
      await resonance.__reply('You need to use one of the API protocols.');
      return;
    }

    let protocol = resonance.instruction.arguments._[0];
    let endpoint = resonance.instruction.arguments._[1];
    let payload = jsonic(resonance.instruction.arguments._.slice(2).join(' ')) || {};

    switch (protocol) {
      case 'get': {
        let getResult = await GestaltService.get(endpoint);

        if (Sojiro.isEmpty(getResult)) {
          await resonance.__reply('No data found for that path, sadly. :(');
          return;
        }

        // If a Discord Client exists for the bot, we send a message to the Discord architect.
        if (!Sojiro.isEmpty(await resonance.bot.getClient(ClientType.Discord))) {
          let getResultToString = JSON.stringify(getResult, null, '\t');
          await resonance.send(resonance.bot.joker.discord, '```\n' + getResultToString + '\n```');
        }
        break;
      }

      case 'update': {
        let updateResult = await GestaltService.update(endpoint, payload).catch(Igor.continue);

        if (Sojiro.isEmpty(updateResult)) {
          await resonance.__reply('No data found at that path, sadly. :(');
          return;
        }

        // If a Discord Client exists for the bot, we send a message to the Discord architect.
        if (!Sojiro.isEmpty(await resonance.bot.getClient(ClientType.Discord))) {
          let updateResultToString = JSON.stringify(updateResult, null, '\t');
          await resonance.send(resonance.bot.joker.discord, '```\n' + updateResultToString + '\n```');
        }
        break;
      }
    }
  }

}