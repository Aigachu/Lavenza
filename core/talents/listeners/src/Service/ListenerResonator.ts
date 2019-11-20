/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Sojiro } from "../../../../lib/Lavenza/Confidant/Sojiro";
import { Resonance } from "../../../../lib/Lavenza/Resonance/Resonance";
import { Resonator } from "../../../../lib/Lavenza/Resonance/Resonator/Resonator";
import { ServiceContainer } from "../../../../lib/Lavenza/Service/ServiceContainer";

import { ListenerCatalogue } from "./ListenerCatalogue";

/**
 * Provides a resonator for Listeners.
 */
export class ListenerResonator extends Resonator {

  /**
   * The priority of the Resonator. This determines the order in which Resonators will resonate.
   */
  public priority: number = 4000;

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

    // If there are no listeners, we can return.
    if (Sojiro.isEmpty(listeners)) {
      return;
    }

    // Run all listeners.
    await Promise.all(listeners.map((listener) => listener.listen(resonance)));
  }

}


