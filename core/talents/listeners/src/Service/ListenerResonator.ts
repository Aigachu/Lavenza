/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Resonance } from "../../../../lib/Lavenza/Resonance/Resonance";
import { Resonator } from "../../../../lib/Lavenza/Resonance/Resonator/Resonator";
import { ServiceContainer } from "../../../../lib/Lavenza/Service/ServiceContainer";

import { ListenerCatalogue } from "./ListenerCatalogue";

/**
 * Provides a resonator for Listeners.
 */
export abstract class ListenerResonator extends Resonator {

  /**
   * The priority of the Resonator. This determines the order in which Resonators will resonate.
   */
  public abstract priority: number = 4000;

  /**
   * Resonate function for the Listeners talent.
   *
   * Loop through all listeners in a bot and listen to the Resonance.
   *
   * @param resonance
   *   The resonance that was created from the client.
   */
  public async resonate(resonance: Resonance): Promise<void> {
    // Get all listeners for the bot.
    const listeners = await ServiceContainer.get(ListenerCatalogue).getListenersForEntity(resonance.bot);

    // Run all listeners.
    await Promise.all(listeners.map((listener) => listener.listen(resonance)));
  }

}


