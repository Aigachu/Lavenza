/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { BotConfigurations } from "../../../../../lib/Lavenza/Bot/BotConfigurations";
import { Command } from "../../../../../lib/Lavenza/Bot/Command/Command";
import { Resonance } from "../../../../../lib/Lavenza/Bot/Resonance/Resonance";
import { Kawakami } from "../../../../../lib/Lavenza/Confidant/Kawakami";
import { Sojiro } from "../../../../../lib/Lavenza/Confidant/Sojiro";
import { Gestalt } from "../../../../../lib/Lavenza/Gestalt/Gestalt";

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
  public async execute(resonance: Resonance): Promise<void> {
    // Get the arguments.
    const args = await resonance.getArguments();

    // Manage the 's' option.
    if ("s" in args) {
      // If the value is empty, we should get out.
      if (Sojiro.isEmpty(args.s)) { return; }

      // Get the current cprefix.
      const currentConfig = await Gestalt.get(`/bots/${resonance.bot.id}/config/core`) as BotConfigurations;
      const currentPrefix = currentConfig.commandPrefix;

      // Update the cprefix.
      await Gestalt.update(`/bots/${resonance.bot.id}/config/core`, {commandPrefix: args.s});

      // For each client, we need to update the command prefix in all contexts.


      // Send a confirmation.
      await resonance.__reply("I've updated the command prefix from {{oldPrefix}} to {{newPrefix}}.", {
        newPrefix: await Kawakami.bold(args.s),
        oldPrefix: await Kawakami.bold(currentPrefix),
      });
    }
  }

}
