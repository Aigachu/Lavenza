/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { BotConfigurations } from "../../../../../lib/Lavenza/Bot/BotConfigurations";
import { Kawakami } from "../../../../../lib/Lavenza/Confidant/Kawakami";
import { Sojiro } from "../../../../../lib/Lavenza/Confidant/Sojiro";
import { Core } from "../../../../../lib/Lavenza/Core/Core";
import { Resonance } from "../../../../../lib/Lavenza/Resonance/Resonance";
import { Command } from "../../../../commander/src/Command/Command";
import { Instruction } from "../../../../commander/src/Instruction/Instruction";

/**
 * Command Prefix command.
 *
 * Use this command to adjust the command prefix on the fly.
 *
 * @TODO - This needs to update client specific configurations as well.
 */
export class CPrefix extends Command {

  /**
   * Execute command.
   *
   * @inheritDoc
   */
  public async execute(instruction: Instruction, resonance: Resonance): Promise<void> {
    // Get the arguments.
    const args = instruction.arguments;

    // Manage the 's' option.
    if ("s" in args) {
      // If the value is empty, we should get out.
      if (Sojiro.isEmpty(args.s)) { return; }

      // Get the current cprefix.
      const currentConfig = await Core.gestalt().get(`/bots/${resonance.bot.id}/config/core`) as BotConfigurations;
      const currentPrefix = currentConfig.commandPrefix;

      // Update the cprefix.
      await Core.gestalt().update(`/bots/${resonance.bot.id}/config/core`, {commandPrefix: args.s});

      // @TODO - For each client, we need to update the command prefix in all contexts.

      // Send a confirmation.
      await resonance.__reply("I've updated the command prefix from {{oldPrefix}} to {{newPrefix}}.", {
        newPrefix: await Kawakami.bold(args.s),
        oldPrefix: await Kawakami.bold(currentPrefix),
      });
    }
  }

}
