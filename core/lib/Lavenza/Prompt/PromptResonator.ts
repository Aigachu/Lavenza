/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Resonance } from "../Resonance/Resonance";
import { Resonator } from "../Resonance/Resonator/Resonator";

import { Prompt } from "./Prompt";

/**
 * Provides a Resonator for Prompts.
 *
 * Prompts are a core functionality in the framework and will implement their own resonator.
 */
export class PromptResonator extends Resonator {

  /**
   * The priority of the Resonator. This determines the order in which Resonators will resonate.
   */
  public priority: number = 5000;

  /**
   * Each resonator service must implement this function to determine what to do upon hearing a resonance.
   */
  public async resonate(resonance: Resonance): Promise<void> {
    // Fire all of the bot's prompts, if any.
    // @TODO - Prompts can have a catalogue of their own.
    await Promise.all(resonance.bot.prompts.map(async (prompt: Prompt) => {
      // Fire the listen function.
      await prompt.listen(resonance);
    }));
  }

}


