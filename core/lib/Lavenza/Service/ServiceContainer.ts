/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from "path";

// Imports.
import { Akechi } from "../Confidant/Akechi";
import { Igor } from "../Confidant/Igor";
import { Morgana } from "../Confidant/Morgana";
import { AssociativeObject } from "../Types";

import { RuntimeProcessId } from "./RuntimeProcessId";
import { Service } from "./Service";
import {
  RuntimeFlowDefinition, RuntimeTask,
  ServiceDefinitionFile,
} from "./ServiceDefinitionFile";
import { ServiceType } from "./ServiceType";

/**
 * Provides a static class with helper functions pertaining to commands.
 */
export class ServiceContainer {

  /**
   * Store Services.
   */
  public static services: Service[] = [];

  /**
   * Store execution flows.
   */
  public static runtimeTasks: AssociativeObject<RuntimeTask[]> = {};

  /**
   * Fetch a service from the Core container.
   */
  public static get<S extends Service>(id: ServiceType<S> | string): S {
    // Find the service.
    const service: Service = ServiceContainer.services.find((prop: Service) => prop.constructor === id || prop.id === id);

    // If the service wasn't found, throw a warning.
    if (!service) {
      // tslint:disable-next-line:comment-format
      // noinspection JSIgnoredPromiseFromCall
      Igor.throw(`Tried to call non-existent service "${id}".`);

      return undefined;
    }

    return service as S;
  }

  /**
   * Get all services of a specific tag.
   *
   * @param tag
   *   The tag to search for.
   */
  public static getServicesWithTag(tag: string): Service[] {
    return ServiceContainer.services.filter((service: Service) => service.tags.includes(tag)) || [];
  }

  /**
   * Check if a service exists in the container.
   *
   * @param id
   *   ID of the service to check.
   *
   * @returns
   *   Returns true if the service is found, false otherwise.
   */
  public static serviceExists(id: string): boolean {
    return ServiceContainer.services.find((prop: Service) => prop.id === id) !== undefined;
  }

  /**
   * Load services defined in a service definition file and append them directly to Lavenza's Core.
   *
   * @param definitionFilePath
   *   Path to the service definition file.
   * @param talent
   *   Talent to link the loaded services to.
   */
  public static async load(definitionFilePath: string, talent?: string): Promise<void> {
    // First, we'll simply check if the file exists.
    if (!await Akechi.fileExists(definitionFilePath)) {
      await Morgana.warn(`No Service Definition File found at "${definitionFilePath}".`);
    }

    // If the file exists, we'll use the yaml loader to get it.
    const definitionFileData = await Akechi.readYamlFile(definitionFilePath) as ServiceDefinitionFile;
    const serviceDefinitions = definitionFileData.services;
    const runtimeFlow = definitionFileData.runtime as RuntimeFlowDefinition;

    // Declare variable to hold services.
    const services = [];

    // For all of the definitions, we want to load services.
    for (const [serviceId, definition] of Object.entries(serviceDefinitions)) {
      // If his service already exists, we should exit with an error.
      if (services.find((srv: Service) => srv.id === serviceId)) {
        await Igor.throw(`Duplicate services "${serviceId}". Please adjust service names accordingly.`);
      }

      // Get the true path to the service, relative to the location of the definition file.
      const serviceFilePath = `${path.dirname(definitionFilePath)}/${definition.class}`;

      // If the service file doesn't exist, we stop here and exit the program completely.
      if (!Akechi.fileExists(serviceFilePath)) {
        await Igor.throw(`The requested service file "${serviceFilePath}" for service "${serviceFilePath}" does not exist.`);
      }

      // We will simply require the file here.
      let service: Service = await import(serviceFilePath);
      service = new service[path.basename(serviceFilePath, ".js")](serviceId, definition.dependencies, definition.tags, talent);

      // Assign the service to the variable we defined.
      services.push(service);
    }

    // Set all the services we loaded.
    ServiceContainer.services = [...ServiceContainer.services, ...services];

    // Check Service dependencies and run build functions.
    for (const service of ServiceContainer.services) {
      // Check if all dependencies exist for this service.
      for (const dependency of service.dependencies) {
        // If the dependency isn't loaded, we exit with an error.
        if (!ServiceContainer.services.find((srv) => srv.id === dependency)) {
          await Igor.throw(`Service "${service.id}" depends on non-existent service "${dependency}". Please verify that all needed services exist and are instantiated during runtime."`);
        }
      }
      // Run build tasks.
      await service.build();
    }

    // Load Runtime Flows.
    for (const [processId, processServices] of Object.entries(runtimeFlow)) {
      // If the process ID is not in the list of those defined in the Enum, we exit with an error.
      if (!(processId in RuntimeProcessId)) {
        await Igor.throw(`The defined process "${processId}" is invalid. Please verify your .services.yml files!`);
      }

      // If there are no processServices, we skip to the next item..
      if (!processServices) {
        continue;
      }

      // Now we'll loop through the defined processes.
      for (const serviceDefinition of processServices) {
        // If the service doesn't exist, for whatever reason, we should exit.
        if (!ServiceContainer.serviceExists(serviceDefinition.service)) {
          await Igor.throw(`The defined service "${serviceDefinition.service}" does not exist or was not loaded. Please verify your .services.yml files!`);
        }

        // Otherwise, we're good.
        // We add this service to the runtime tasks array.
        // If the runtime tasks array for this process doesn't exist yet, we initialize it.
        ServiceContainer.runtimeTasks[processId] = ServiceContainer.runtimeTasks[processId] || [];
        ServiceContainer.runtimeTasks[processId].push(
          {
            method: serviceDefinition.method || processId,
            priority: serviceDefinition.priority as number || 0,
            service: ServiceContainer.get(serviceDefinition.service),
          });
      }
    }

    // Finally, sort all runtime tasks.
    for (const tasks of Object.values(ServiceContainer.runtimeTasks)) {
      tasks.sort(ServiceContainer.prioritySort);
    }
  }

  /**
   * Run tasks for a specified runtime process.
   *
   * @param process
   *   The ID of the runtime process we want to run tasks for.
   */
  public static async tasks(process: RuntimeProcessId): Promise<void> {
    // If there are no tasks for this process, we should quit out.
    if (!ServiceContainer.runtimeTasks[process]) {
      await Morgana.warn(`There are no runtime tasks specified for the "${process}" process. Proceeding...`);

      return;
    }

    for (const task of ServiceContainer.runtimeTasks[process]) {
      await Morgana.status(`TASK ${task.priority}: ${task.service.id}->${task.method}() ...`);
      await task.service[task.method]();
      await Morgana.success("Done!");
      if (ServiceContainer.runtimeTasks[process].indexOf(task) !== ServiceContainer.runtimeTasks[process].length - 1) {
        await Morgana.status("\n");
      }
    }
  }

  /**
   * Utility function to compare two services using their 'priority' value.
   *
   * @param a
   *   First service.
   * @param b
   *   Second service.
   *
   * @returns
   *   Comparison value.
   *   - If returns less than 0, sort a to an index lower than b (i.e. a comes first).
   *   - If returns 0, leave a and b unchanged with respect to each other,
   *     but sorted with respect to all different elements.
   *   - If returns greater than 0, sort b to an index lower than a (i.e. b comes first).
   */
  private static prioritySort(a: RuntimeTask, b: RuntimeTask): number {
    return b.priority as number - a.priority as number;
  }

}
