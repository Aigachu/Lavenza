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
 *
 * Priority values are assigned to services and are used to the determine the absolute order of tasks within each flow.
 */
enum RuntimeProcessId {
  genesis = "genesis",
  synthesis = "synthesis",
  statis = "statis",
  symbiosis = "symbiosis",
}

export { RuntimeProcessId };
