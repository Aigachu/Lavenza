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
    // Otherwise, check if a functional file exists for the bot.
    const botFunctDoor = `${resonance.bot.directory}/${resonance.bot.id}.js`;
    if (await Akechi.fileExists(botFunctDoor)) {
      const botFunct = await require(botFunctDoor) as BotFunctionalDoor;
      await botFunct.resonate(resonance);
    }
  }

}


