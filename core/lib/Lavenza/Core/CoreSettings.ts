/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Declares an interface schema for Core Lavenza settings.
 */
export interface CoreSettings {

  /**
   * List of machine names of bots to automatically boot when starting Lavenza.
   */
  autoboot: string[];

  /**
   * Machine name of the Master Bot, the main bot being used.
   */
  master: string;

}
