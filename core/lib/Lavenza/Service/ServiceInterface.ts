/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides an interface for Services.
 */
export interface ServiceInterface {

  /**
   * ID of the service.
   * Used to identify and call the service from within the code.
   */
  id: string;

  /**
   * Dependencies of this service.
   * Some services have actions that make use of other services' features. We manage this here.
   */
  dependencies: string[];

  /**
   * Tags of this service.
   * Tags can be used to quickly obtain services tagged with specific labels.
   */
  tags: string[];

  /**
   * Talent this service is linked to.
   *
   * Services don't need to be attached to a Talent, but all services defined through a talent will automatically be
   * linked. This is to prevent bots that don't have a certain talent enabled from running behaviors for said talent.
   */
  talent?: string;

  /**
   * Build the service.
   *
   * Since constructors can't be async, and we may want to do async tasks to build parts of a service, Services can
   * implement an asynchronous build function.
   *
   * This can be used to initialize some class properties we may want.
   */
  build(): Promise<void>;

  /**
   * Perform genesis tasks to prepare a service during the primordial stages of runtime.
   *
   * Genesis goes through the very first initializations of the application.
   * Only services declared in "core.services.yml" can have genesis tasks.
   */
  genesis?(): Promise<void>;

  /**
   * Perform synethesis tasks to prepare a service during the initial stages of runtime.
   *
   * Synthesis will do as it insinuates: Combine and connect different parts of the code.
   * Listeners will be linked to Talents. Talents will be linked to Bots. And so on...
   */
  synthesis?(): Promise<void>;

  /**
   * Perform statis tasks that occur after synthesis.
   *
   * Statis tasks will run after synthesis is complete and things are theoretically stabilized.
   *
   * This is a good time to run database initializations and more.
   */
  statis?(): Promise<void>;

  /**
   * Perform symbiosis tasks that occur after statis.
   *
   * The final part of the execution phase.
   */
  symbiosis?(): Promise<void>;

}
