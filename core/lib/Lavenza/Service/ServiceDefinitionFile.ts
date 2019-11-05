/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

import { AssociativeObject } from "../Types";

/**
 * Provides an interface for Service Definition files.
 */
export interface ServiceDefinitionFile {

  /**
   * Hold list of all service definitions.
   */
  services: AssociativeObject<ServiceDefinition>;

}

/**
 * Provides an interface for Service Definitions.
 */
export interface ServiceDefinition {

  /**
   * Path to the class for this Service.
   */
  class: string;

  /**
   * Priorities for this Service.
   */
  priority: string | number | ServicePriority;

  /**
   * Dependencies on other services.
   */
  dependencies: string[];

  /**
   * Primordial flag for the service.
   */
  primordial: boolean;

}

/**
 * Provides an interface for Service Priority data.
 */
export interface ServicePriority  {

  /**
   * Priority specific to genesis tasks.
   */
  genesis: string | number;

  /**
   * Priority specific to build tasks.
   */
  build: string | number;

  /**
   * Priority specific to arrangement tasks.
   */
  arrange: string | number;

  /**
   * Priority specific to run tasks.
   */
  run: string | number;

}
