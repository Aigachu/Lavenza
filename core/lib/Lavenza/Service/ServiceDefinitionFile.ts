/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { AssociativeObject } from "../Types";

import { RuntimeProcessId } from "./RuntimeProcessId";
import { Service } from "./Service";

/**
 * Provides an interface for Service Definition files.
 */
export interface ServiceDefinitionFile {

  /**
   * Hold list of all service definitions.
   */
  services: AssociativeObject<ServiceDefinition>;

  /**
   * Hold list of all runtime steps divided into 4 levels.
   */
  runtime: RuntimeFlowDefinition;

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
   * Dependencies on other services.
   */
  dependencies: string[];

  /**
   * Tags for this service.
   */
  tags: string[];

}

/**
 * Provides a type for a Runtime Flow definition.
 */
export type RuntimeFlowDefinition = {

  /**
   * Each definition will be an array of objects containing a list of services that must run actions during the given
   * process ID.
   */
  [key in RuntimeProcessId]: RuntimeTaskDefinition[];

};

/**
 * Provides an interface for Runtime Service Definitions.
 * These are configurations for a certain service's actions in the process where it is set.
 */
export interface RuntimeTaskDefinition {

  /**
   * Stores the ID of the service.
   */
  service: string;

  /**
   * Priority of this execution service within the established process.
   */
  priority: number;

  /**
   * Class method to run for this task.
   * We assume that this class method exists in the service, and enter a string here.
   */
  method: string;

}

/**
 * Export an interface for runtime tasks.
 */
export interface RuntimeTask {

  /**
   * The service that will execute the task.
   */
  service: Service;

  /**
   * The priority of this task.
   */
  priority: number;

  /**
   * The class method to run for the task.
   */
  method: string;

}
