/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Resonance } from "../Resonance/Resonance";

/**
 * Provide an interface for the Functional Programming gateway exposed in bots.
 */
export interface BotFunctionalDoor {

  /**
   * Resonate function that will apply to all messages heard by the bot.
   */
  resonate?(resonance: Resonance): Promise<void>;

}
