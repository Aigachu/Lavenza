/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * A little Enum to manage our types of Prompt Exceptions.
 *
 * We don't wanna have to change them EVERYWHERE. So we manage them all here!
 */
enum PromptExceptionType {

  /**
   * When a prompt doesn't receive a response before it's lifespan, fire this error.
   */
  NO_RESPONSE = "no-response",

  /**
   * When a prompt doesn't receive a valid response, fire this error.
   */
  INVALID_RESPONSE = "invalid-response",

  /**
   * Fire this error for miscellaneous failures.
   */
  MISC = "miscellaneous",

  /**
   * When a prompt reaches it's maximum reset allowance, fire this error.
   */
  MAX_RESET_EXCEEDED = "max-reset-exceeded",

}

export { PromptExceptionType };
