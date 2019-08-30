/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * A little Enum to manage our types of Prompt Exceptions.
 *
 * We don't wanna have to change them EVERYWHERE. So we manage them all here!
 */
module.exports = {
  NO_RESPONSE: 'no-response',
  INVALID_RESPONSE: 'invalid-response',
  MISC: 'miscellaneous',
  MAX_RESET_EXCEEDED: 'max-reset-exceeded',
};