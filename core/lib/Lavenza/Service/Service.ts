/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { ServicePriority } from "./ServiceDefinitionFile";

/**
 * Provides a base class for Services.
 *
 * Services are functionality extenders that can be accessed through the core of the application.
 *
 * They are prepared at runtime and usually come with bundled functionality that can be accessed elsewhere in the code.
 */
export abstract class Service {

  /**
   * ID of the service.
   * Used to identify and call the service from within the code.
   */
  public id: string;

  /**
   * Priority value of the service.
   * Used to determine what order to execute all services' build/arrange tasks in.
   */
  public priority: string | number | ServicePriority;

  /**
   * Dependencies of this service.
   * Some services have actions that make use of other services' features. We manage this here.
   */
  public dependencies: string[] = [];

  /**
   * Primordial flag for this service.
   * Primordial services run extra tasks in the very initial stages of the application's execution.
   * This includes tasks that run before all Talents are loaded and extra services are in play.
   */
  public primordial: boolean = false;

  /**
   * Service constructor.
   *
   * @param id
   *   ID of the service. This is the key given to it in the definition file.
   * @param priority
   *   The priority values of this Service.
   * @param dependencies
   *   The dependencies of this service.
   * @param primordial
   *   If a service is primordial, it was run preliminary tasks in the primordial stage of Lavenza's execution.
   */
  public constructor(id: string, priority: string | number | ServicePriority = 0, dependencies: string[] = [], primordial: boolean = false) {
    this.id = id;
    this.priority = priority instanceof Object ? priority : {
      arrange: priority,
      build: priority,
      genesis: priority,
      run: priority,
    };
    this.dependencies = dependencies;
    this.primordial = primordial;
  }

  /**
   * Utility function to compare two services using their 'priority' value.
   *
   * @param a
   *   First service.
   * @param b
   *   Second service.
   * @param type
   *   Type to priority to check for. Either 'build' or 'arrange'.
   *
   * @returns
   *   Comparison value.
   *   - If returns less than 0, sort a to an index lower than b (i.e. a comes first).
   *   - If returns 0, leave a and b unchanged with respect to each other,
   *     but sorted with respect to all different elements.
   *   - If returns greater than 0, sort b to an index lower than a (i.e. b comes first).
   */
  public static prioritySort(a: Service, b: Service, type: string): number {
    return b.priority[type] as number - a.priority[type] as number;
  }

  /**
   * Sort genesis priority.
   * @inheritDoc
   */
  public static prioritySortGenesis(a: Service, b: Service): number {
    return Service.prioritySort(a, b, "genesis");
  }

  /**
   * Sort build priority.
   * @inheritDoc
   */
  public static prioritySortBuild(a: Service, b: Service): number {
    return Service.prioritySort(a, b, "build");
  }

  /**
   * Sort arrange priority.
   * @inheritDoc
   */
  public static prioritySortArrange(a: Service, b: Service): number {
    return Service.prioritySort(a, b, "arrange");
  }

  /**
   * Sort run priority.
   * @inheritDoc
   */
  public static prioritySortRun(a: Service, b: Service): number {
    return Service.prioritySort(a, b, "run");
  }

  /**
   * Perform genesis tasks to prepare a service during the primordial stages of runtime.
   *
   * Whatever goes in here handles tasks that must be done during the primordial phases of Lavenza's execution.
   */
  public async genesis(): Promise<void> {
    // The base genesis functions don't do anything.
    // Each service can define actions to undertake during the genesis phase of the application.
    // The genesis function only runs for Primordial Services.
  }

  /**
   * Perform build tasks to prepare a service during the initial stages of runtime.
   *
   * Whatever goes in here handles tasks that must be done during the initial phases of Lavenza's execution.
   */
  public async build(): Promise<void> {
    // The base build functions don't do anything.
    // Each service can define actions to undertake during the build phase of the application.
  }

  /**
   * Perform arrangements that occur after build tasks.
   */
  public async arrange(): Promise<void> {
    // The base build functions don't do anything.
    // Each service can define actions to undertake during the build phase of the application.
  }

  /**
   * Perform run tasks that occur after arrangements.
   */
  public async run(): Promise<void> {
    // The base build functions don't do anything.
    // Each service can define actions to undertake during the build phase of the application.
  }

}
