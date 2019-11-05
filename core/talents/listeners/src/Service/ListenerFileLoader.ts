/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from "path";

// Imports.
import { Morgana } from "../../../../lib/Lavenza/Confidant/Morgana";
import { Sojiro } from "../../../../lib/Lavenza/Confidant/Sojiro";
import { FileLoader } from "../../../../lib/Lavenza/Service/Loader/FileLoader";
import { Listener } from "../Listener";

/**
 * Provides an abstract class for special services that are used to discover bonds between Talents.
 */
export class ListenerFileLoader extends FileLoader<Listener> {

  /**
   * Store the type of file you wish to load.
   */
  protected fileType: string = ".js";

  /**
   * Load a command from a given file found in the loader.
   *
   * @param listenerFilePath
   *   Path to the file defining the listener
   *
   * @return
   *   The instantiated Listener.
   */
  public async process(listenerFilePath: string): Promise<Listener> {
    // We will simply require the file here.
    let listener: Listener = await import(listenerFilePath);
    listener = new listener[path.basename(listenerFilePath, ".js")]();

    // If the require fails or the result is empty, we stop.
    if (Sojiro.isEmpty(listener)) {
      await Morgana.warn(
        "A Listener class could not be loaded: {{listener}}.",
        {listener: listenerFilePath},
      );

      return;
    }

    // Run listener build tasks.
    // We only do this to assign the talent to the listener. That way, the listener can access the Talent.
    await listener.build();

    // If everything goes smoothly, we register the listener to the Talent.
    return listener;
  }

}
