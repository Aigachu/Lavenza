/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Akechi } from "../Confidant/Akechi";
import { Resonance } from "../Resonance/Resonance";
import { Resonator } from "../Resonance/Resonator/Resonator";
import { ServiceContainer } from "../Service/ServiceContainer";
import { TalentCatalogue } from "../Talent/TalentCatalogue";
import { BotFunctionalDoor } from "./BotFunctionalDoor";

/**
 * Provides a Resonator for the Functional Door.
 */
export class FunctionalResonator extends Resonator {

  /**
   * The priority of the Resonator. This determines the order in which Resonators will resonate.
   */
  public priority: number = 4500;

  /**
   * Each resonator service must implement this function to determine what to do upon hearing a resonance.
   */
  public async resonate(resonance: Resonance): Promise<void> {
    // Get all talents assigned to this bot.
    const talents = await ServiceContainer.get(TalentCatalogue).getTalentsForBot(resonance.bot);

    // We want to sort each talent by priority real fast.
    talents.sort((a, b) => b.priority - a.priority);

    // We'll loop through all Talents assigned to this bot.
    for (const talent of talents) {
      // Run the Resonate function for the talent.
      // Not all talents will implement this, but they can if they want to.
      await talent.resonate(resonance);
    }

    // Otherwise, check if a functional file exists for the bot.
    const botFunctDoor = `${resonance.bot.directory}/${resonance.bot.id}.js`;
    if (await Akechi.fileExists(botFunctDoor)) {
      const botFunct = await require(botFunctDoor) as BotFunctionalDoor;
      await botFunct.resonate(resonance);
    }
  }

}


