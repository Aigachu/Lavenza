/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Command } from "../../../../../core/talents/commander/src/Command/Command";
import { Resonance } from "../../../../../core/lib/Lavenza/Resonance/Resonance";
import { Gestalt } from "../../../../../core/talents/gestalt/src/Service/Gestalt";

/**
 * Locale command.
 */
export class Locale extends Command {

  /**
   * Execute command.
   *
   * @inheritDoc
   */
  public async execute(resonance: Resonance): Promise<void> {
    // Get the arguments.
    const args = await resonance.getArguments();

    // If "set" is the first argument, we allow the user to set locale settings for themselves.
    // @TODO - This will be much more intricate later on!
    if (args._[0] === "set") {
      const locale = args._[1];

      // Use Gestalt to make the modification.
      const payload = {};
      payload[`${resonance.author.id}`] = {locale};
      await Gestalt.update(`/i18n/${resonance.bot.id}/clients/${resonance.client.type}/users`, payload);

      // Send a reply.
      await resonance.__reply("I've modified your locale settings! From now on, I will answer you in this language when I can. You can change this setting at any time.", locale);
    }

  }

}
