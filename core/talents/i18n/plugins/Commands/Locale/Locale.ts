/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Core } from "../../../../../lib/Lavenza/Core/Core";
import { Resonance } from "../../../../../lib/Lavenza/Resonance/Resonance";
import { Command } from "../../../../commander/src/Command/Command";
import { Instruction } from "../../../../commander/src/Instruction/Instruction";

/**
 * Locale command.
 */
export class Locale extends Command {

  /**
   * Execute command.
   *
   * @inheritDoc
   */
  public async execute(instruction: Instruction, resonance: Resonance): Promise<void> {
    // Get the arguments.
    const args = instruction.arguments;

    // If "set" is the first argument, we allow the user to set locale settings for themselves.
    // @TODO - This will be much more intricate later on!
    if (args._[0] === "set") {
      const locale = args._[1];

      // Use Gestalt to make the modification.
      const payload = {};
      payload[`${resonance.author.id}`] = {locale};
      await Core.gestalt().update(`/i18n/${resonance.bot.id}/clients/${resonance.client.type}/users`, payload);

      // Send a reply.
      await resonance.__reply("I've modified your locale settings! From now on, I will answer you in this language when I can. You can change this setting at any time.", locale);
    }

  }

}
