/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Service } from "../../Service/Service";
import { Resonance } from "../Resonance";

/**
 * Provides an abstract class for Resonators.
 *
 * Resonators are services that will simply act upon messages heard from a client.
 *
 * When a message is heard, a Resonance is created and sent to Resonators. This Resonance contains information about
 * the message received. Anything can be done with a message that has been heard.
 */
export abstract class Resonator extends Service {

  /**
   * Service tags.
   */
  public tags: string[] = [ "resonator" ];

  /**
   * The priority of the Resonator. This determines the order in which Resonators will resonate.
   */
  public abstract priority: number;

  /**
   * Each resonator service must implement this function to determine what to do upon hearing a resonance.
   *
   * @param resonance
   *   The resonance that was created from the client.
   */
  public abstract async resonate(resonance: Resonance): Promise<void>;

}


