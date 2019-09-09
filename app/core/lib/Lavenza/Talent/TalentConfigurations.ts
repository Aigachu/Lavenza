/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Declares an interface schema for Talent Configurations.
 */
export interface TalentConfigurations {
  name: string;
  description: string;
  directory: string;
  version: string;
  class: string;
  dependencies: Array<string>;
  clients: Array<string> | string;
}