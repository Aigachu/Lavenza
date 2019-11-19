/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Resonance } from "../../../../lib/Lavenza/Resonance/Resonance";
import { Talent } from "../../../../lib/Lavenza/Talent/Talent";

/**
 * Provides an abstract base class for Listeners.
 *
 * Listeners receive a 'Resonance' from a Bot and can act upon what they hear.
 *
 * They are basically entry points for extended functionality when wanting to tell a Bot what to do upon hearing
 * a message from any given client.
 */
export abstract class Listener {

  /**
   * The Talent that declared this listener.
   * This property simply exists in case a user would like to assign a talent to their listener.
   */
  protected talent: Talent;

  /**
   * Perform build tasks.
   *
   * Since Listeners will sometimes need to build data asynchronously,they can call this function once to set
   * their properties and more.
   */
  public async build(): Promise<void> {
    // The base build() function for listeners doesn't do anything. Additional assignments may be done in this function.
  }

  /**
   * Main function of all listeners used to listen to a Resonance.
   *
   * All logic for what to do upon hearing a Resonance should be added in this function. It's the entry point.
   *
   * Each child class should have its own listen() implementation. This base class implementation will urge you to
   * make one.
   *
   * @param resonance
   *   The Resonance to listen to.
   */
  public abstract async listen(resonance: Resonance): Promise<void>;

}
