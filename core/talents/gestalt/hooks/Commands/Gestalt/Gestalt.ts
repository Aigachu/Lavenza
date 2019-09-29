/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as jsonic from "jsonic";
import * as _ from "underscore";

// Imports.
import { ClientType } from "../../../../../lib/Lavenza/Bot/Client/ClientType";
import { Command } from "../../../../../lib/Lavenza/Bot/Command/Command";
import { Resonance } from "../../../../../lib/Lavenza/Bot/Resonance/Resonance";
import { Igor } from "../../../../../lib/Lavenza/Confidant/Igor";
import { Sojiro } from "../../../../../lib/Lavenza/Confidant/Sojiro";
import { Gestalt as GestaltService } from "../../../../../lib/Lavenza/Gestalt/Gestalt";

/**
 * Gestalt command used to make database queries through a client's chat.
 */
export class Gestalt extends Command {

  /**
   * Store all usable Gestalt protocols.
   */
  private protocols: string[] = [
    "get",
    "post",
    "update",
    "delete",
  ];

  /**
   * Execute command.
   *
   * @inheritDoc
   */
  public async execute(resonance: Resonance): Promise<void> {
    // The first argument must be one of the protocols, or we don't do anything.
    if (!_.contains(this.protocols, resonance.instruction.arguments._[0])) {
      await resonance.__reply("You need to use one of the API protocols.");

      return;
    }

    const protocol = resonance.instruction.arguments._[0];
    const endpoint = resonance.instruction.arguments._[1];
    const payload = jsonic(
      resonance.instruction.arguments._.slice(2)
        .join(" "),
    ) || {};

    switch (protocol) {
      case "get": {
        const getResult = await GestaltService.get(endpoint);

        if (Sojiro.isEmpty(getResult)) {
          await resonance.__reply("No data found for that path, sadly. :(");

          return;
        }

        // If a Discord Client exists for the bot, we send a message to the Discord architect.
        if (!Sojiro.isEmpty(await resonance.bot.getClient(ClientType.Discord))) {
          const getResultToString = JSON.stringify(getResult, undefined, "\t");
          await resonance.send(resonance.bot.joker.discord, `\`\`\`\n${getResultToString}\n\`\`\``);
        }
        break;
      }

      case "update": {
        const updateResult = await GestaltService.update(endpoint, payload)
          .catch(Igor.continue);

        if (Sojiro.isEmpty(updateResult)) {
          await resonance.__reply("No data found at that path, sadly. :(");

          return;
        }

        // If a Discord Client exists for the bot, we send a message to the Discord architect.
        if (!Sojiro.isEmpty(await resonance.bot.getClient(ClientType.Discord))) {
          const updateResultToString = JSON.stringify(updateResult, undefined, "\t");
          await resonance.send(resonance.bot.joker.discord, `\`\`\`\n${updateResultToString}\n\`\`\``);
        }
      }
    }
  }

}
