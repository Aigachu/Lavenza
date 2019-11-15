/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { ServiceInterface } from "./ServiceInterface";

/**
 * Provides a base class for Services.
 *
 * Services are functionality extenders that can be accessed through the core of the application.
 *
 * They are prepared at runtime and usually come with bundled functionality that can be accessed elsewhere in the code.
 */
export abstract class Service implements ServiceInterface {

  /**
   * ID of the service.
   *
   * @inheritDoc
   */
  public id: string;

  /**
   * Dependencies of this service.
   *
   * @inheritDoc
   */
  public dependencies: string[] = [];

  /**
   * Tags of this service.
   *
   * @inheritDoc
   */
  public tags: string[] = [];

  /**
   * Talent this service is linked to.
   *
   * Services don't need to be attached to a Talent, but all services defined through a talent will automatically be
   * linked. This is to prevent bots that don't have a certain talent enabled from running behaviors for said talent.
   */
  public talent: string;

  /**
   * Service constructor.
   *
   * @param id
   *   ID of the service. This is the key given to it in the definition file.
   * @param dependencies
   *   The dependencies of this service.
   * @param tags
   *   The tags of this service.
   * @param talent
   *   Talent this service is linked to, if any.
   */
  public constructor(id: string, dependencies: string[] = [], tags: string[] = [], talent?: string) {
    this.id = id;
    this.dependencies = dependencies;
    this.tags = tags;
    this.talent = talent;
  }

}
