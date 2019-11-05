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
import { Core } from "../Core/Core";

import { Service } from "./Service";
import { ServiceDefinitionFile } from "./ServiceDefinitionFile";
import { ServiceType } from "./ServiceType";

/**
 * Provides a static class with helper functions pertaining to commands.
 */
export abstract class ServiceContainer {

  /**
   * Store Services.
   */
  public static services: Service[] = [];

  /**
   * Fetch a service from the Core container.
   */
  public static get<S extends Service>(id: ServiceType<S> | string): S {
    // Find the service.
    const service: Service = ServiceContainer.services.find((prop: Service) => prop.constructor === id || prop.id === id);

    // If the service wasn't found, throw a warning.
    if (!service) {
      Igor.throw(`Tried to call non-existent service "${id}".`);

      return undefined;
    }

    return service as S;
  }

  /**
   * Load services defined in a service definition file and append them directly to Lavenza's Core.
   *
   * @param definitionFilePath
   *   Path to the service definition file.
   */
  public static async load(definitionFilePath: string): Promise<void> {
    // First, we'll simply check if the file exists.
    if (!await Akechi.fileExists(definitionFilePath)) {
      await Morgana.warn(`No Service Definition File found at "${definitionFilePath}".`);
    }

    // If the file exists, we'll use the yaml loader to get it.
    const definitionFileData = await Akechi.readYamlFile(definitionFilePath) as ServiceDefinitionFile;
    const serviceDefinitions = definitionFileData.services;

    // Declare variable to hold services.
    const services = [];

    // For all of the definitions, we want to load services.
    await Promise.all(Object.keys(serviceDefinitions).map(async (serviceDefinitionKey) => {
      // Store the definition.
      const definition = serviceDefinitions[serviceDefinitionKey];

      // If his service already exists, we should exit with an error.
      if (services.find((srv: Service) => srv.id === serviceDefinitionKey)) {
        await Igor.throw(`Duplicate services "${serviceDefinitionKey}". Please adjust service names accordingly.`);
      }

      // Get the true path to the service, relative to the location of the definition file.
      const serviceFilePath = `${path.dirname(definitionFilePath)}/${definition.class}`;

      // If the service file doesn't exist, we stop here and exit the program completely.
      if (!Akechi.fileExists(serviceFilePath)) {
        await Igor.throw(`The requested service file "${serviceFilePath}" for service "${serviceFilePath}" does not exist.`);
      }

      // We will simply require the file here.
      let service: Service = await import(serviceFilePath);
      service = new service[path.basename(serviceFilePath, ".js")](serviceDefinitionKey, definition.priority, definition.dependencies, definition.primordial);

      // Assign the service to the variable we defined.
      services.push(service);
    })).catch(Igor.throw);

    // Set all the services we loaded.
    ServiceContainer.services = [...ServiceContainer.services, ...services];

    // Check Service dependencies.
    for (const service of ServiceContainer.services) {
      // Check if all dependencies exist for this service.
      for (const dependency of service.dependencies) {
        // If the dependency isn't loaded, we exit with an error.
        if (!ServiceContainer.services.find((srv) => srv.id === dependency)) {
          await Igor.throw(`Service "${service.id}" depends on non-existent service "${dependency}. Please verify that all needed services exist and are instantiated during runtime."`);
        }
      }
    }
  }

}
