/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides an enum for each of the runtime flows.
 *
 * They happen in the provided order. Each service can run specified tasks in each of these flows.
 * Priority values are assigned to services and are used to the determine the absolute order of tasks within each flow.
 *
 * Now, to properly explain this...
 *
 * When Lavenza executes it's entry point function (so the summon() function in the Core.ts file), it will go through
 * the four processes outlined here. The idea is that in your .services.yml files (the core one and any declared by
 * talents), you outline which services run tasks on the provided steps. This is how the execution flow is determined.
 *
 * Essentially, everything in Lavenza is managed through services, even core implementations have been coded in this
 * way to set the stage for talents.
 *
 * So, take a look at the core.services.yml file to see an example of how to set the execution order. Everything will be
 * outlined in the "runtime" key, at the top of the file.
 *
 * This gives developers the ability to inject services basically anywhere into the runtime process with customizations
 * such as dependencies and the priority key.
 */
enum RuntimeProcessId {
  genesis = "genesis",
  synthesis = "synthesis",
  statis = "statis",
  symbiosis = "symbiosis",
}

export { RuntimeProcessId };
