/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { ServicePriority } from "./ServiceDefinitionFile";

/**
 * Expose a type for Service class constructors.
 */
export type ServiceType<S> = new (id: string, priority: number | ServicePriority, dependencies: string[], primordial: boolean) => S;
