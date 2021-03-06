/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as jsonic from "jsonic";
import * as _ from "underscore";

// Imports.
import { ClientType } from "../../../../../lib/Lavenza/Client/ClientType";
import { Igor } from "../../../../../lib/Lavenza/Confidant/Igor";
import { Sojiro } from "../../../../../lib/Lavenza/Confidant/Sojiro";
import { Core } from "../../../../../lib/Lavenza/Core/Core";
import { Resonance } from "../../../../../lib/Lavenza/Resonance/Resonance";
import { Command } from "../../../../commander/src/Command/Command";
import { Instruction } from "../../../../commander/src/Instruction/Instruction";

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
  public async execute(instruction: Instruction, resonance: Resonance): Promise<void> {
    // The first argument must be one of the protocols, or we don't do anything.
    if (!_.contains(this.protocols, instruction.arguments._[0])) {
      await resonance.__reply("You need to use one of the API protocols.");

      return;
    }

    const protocol = instruction.arguments._[0];
    const endpoint = instruction.arguments._[1];
    const payload = jsonic(
      instruction.arguments._.slice(2)
        .join(" "),
    ) || {};

    switch (protocol) {
      case "get": {
        const getResult = await Core.gestalt().get(endpoint);

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
        const updateResult = await Core.gestalt().update(endpoint, payload)
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
