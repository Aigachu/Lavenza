/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Resonance } from "../../lib/Lavenza/Resonance/Resonance";
import { Talent } from "../../lib/Lavenza/Talent/Talent";

/**
 * WONDERFUL!
 */
export class Wonderful extends Talent {

  /**
   * Resonator function for the Wonderful talent.
   *
   * @inheritDoc
   */
  public async resonate(resonance: Resonance): Promise<void> {
    if (resonance.content === "wonderful") {
      await resonance.__reply("Wonderful! <3");
    }
  }

}
