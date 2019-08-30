/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
const ExceptionTypes = require('./PromptExceptionTypes');

/**
 * Provides a base class for Prompt Exceptions.
 */
module.exports = class PromptException extends Error {

  /**
   * Prompt constructor.
   */
  constructor(type, message = '') {
    super();

    if (!Object.values(ExceptionTypes).includes(type)) {
      Lavenza.throw(`Invalid PromptException type '{{type}}' used in constructor. Please use a valid type. See /lib/Bot/Prompt/Exception/PromptExceptionTypes for more details.`, {type: type});
    }

    this.type = type;
  }

  toString() {
    return `Prompt error of type '` + this.type + `' has occurred!`;
  }

};