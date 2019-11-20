/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Declares an interface schema for Talent Configurations.
 */
export interface TalentConfigurations {

  /**
   * The name of the Talent's class.
   */
  class: string;

  /**
   * The clients this talent is activated in.
   */
  clients: string[] | string;

  /**
   * Machine names of other talents that this talent depends on.
   */
  dependencies: string[];

  /**
   * Description of the talent.
   */
  description: string;

  /**
   * The path to the directory of this Talent, containing all code related to the Talent.
   */
  directory: string;

  /**
   * Reader-friendly name of the Talent.
   */
  name: string;

  /**
   * Priority rating of the talent.
   */
  priority: number;

  /**
   * The version number of the Talent.
   */
  version: string;

}
