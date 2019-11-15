/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../../../../lib/Lavenza/Bot/Bot";
import { Catalogue } from "../../../../lib/Lavenza/Service/Catalogue/Catalogue";
import { Talent } from "../../../../lib/Lavenza/Talent/Talent";
import { Listener } from "../Listener/Listener";

/**
 * Provides a Catalogue for Listeners.
 */
export class ListenerCatalogue extends Catalogue<Listener> {

  /**
   * Store an array of listeners in a library designed for a given bot.
   *
   * @param listeners
   *   Array of listeners.
   * @param entity
   *   Entity to store the listeners for.
   */
  public async storeListenersForEntity(listeners: Listener[], entity: Bot | Talent): Promise<void> {
    // If a bot, we set the catalogue library id to the Bots's ID with a unique key.
    if (entity instanceof Bot) {
      await this.store(listeners, `bot::${entity.id}`);
    }
    // If a talent, we set the catalogue library id to the Talent's Machine Name with a unique key.
    if (entity instanceof Talent) {
      await this.store(listeners, `talent::${entity.machineName}`);
    }
  }

  /**
   * Store an array of listeners in a library designed for a given bot.
   *
   * @param entity
   *   Entity to get the listeners for.
   */
  public async getListenersForEntity(entity: Bot | Talent): Promise<Listener[]> {
    // If a bot, we set the catalogue library id to the Bots's ID with a unique key.
    if (entity instanceof Bot) {
      return this.library(`bot::${entity.id}`);
    }
    // If a talent, we set the catalogue library id to the Talent's Machine Name with a unique key.
    if (entity instanceof Talent) {
      return this.library(`talent::${entity.machineName}`);
    }
  }

}
