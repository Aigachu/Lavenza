/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Service } from "../../Service/Service";
import { ServiceContainer } from "../../Service/ServiceContainer";
import { Gestalt } from "../Gestalt";

/**
 * Provides an abstract class for Composers.
 *
 * Composers are directly tied to the Gestalt database service.
 *
 * They serve as bootstrappers to set any schemas or collections up during runtime.
 *
 * These services can also serve as helpers to access specific parts of the database.
 */
export abstract class Composer extends Service {

  /**
   * Service tags.
   */
  public tags: string[] = [ "composer" ];

  /**
   * The priority of the Resonator. This determines the order in which Resonators will resonate.
   */
  public abstract priority: number;

  /**
   * House the gestalt service that will be injected through DI with the build() function.
   */
  public gestaltService: Gestalt;

  /**
   * Build tasks for composers.
   */
  public async build(): Promise<void> {
    this.gestaltService = ServiceContainer.get(Gestalt);
  }

  /**
   * Each composer service must implement this function to determine what to do when the Manager calls them.
   *
   * Composers are made to do database bootstrapping during runtime.
   */
  public abstract async compose(): Promise<void>;

}


