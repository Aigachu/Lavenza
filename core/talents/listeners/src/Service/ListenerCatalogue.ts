/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Catalogue } from "../../../../lib/Lavenza/Service/Catalogue/Catalogue";
import { ServiceContainer } from "../../../../lib/Lavenza/Service/ServiceContainer";
import { Listener } from "../Listener";

import { ListenerFileLoader } from "./ListenerFileLoader";

/**
 * Provides a static class with helper functions pertaining to commands.
 */
export class ListenerCatalogue extends Catalogue<Listener> {

  /**
   * From a given path, load commands into the repository via the CommandDirectoryLoader.
   *
   * @return
   *   The commands loaded from the provided path.
   */
  public async loadListeners(pathToLoadFrom: string): Promise<Listener[]> {
    const loadedListeners = await ServiceContainer.get(ListenerFileLoader).load(pathToLoadFrom);
    this.repository = [...this.repository, ...loadedListeners];

    return loadedListeners;
  }

}
