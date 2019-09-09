/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import PromptExceptionType from "./PromptExceptionType";
import Igor from "../../../Confidant/Igor";

/**
 * Provides a base class for Prompt Exceptions.
 */
export default class PromptException extends Error {

  /**
   * Type of this exception.
   */
  private readonly type: PromptExceptionType;

  /**
   * Prompt constructor.
   */
  constructor(type: PromptExceptionType, message = '') {
    super();

    if (!Object.values(PromptExceptionType).includes(type)) {
      Igor.throw(`Invalid PromptException type '{{type}}' used in constructor. Please use a valid type. See /lib/Bot/Prompt/Exception/PromptExceptionTypes for more details.`, {type: type}).then(() => {
        // Do nothing.
      });
    }

    this.type = type;
  }

  /**
   * Override base toString method.
   */
  toString(): string {
    return `Prompt error of type '` + this.type + `' has occurred!`;
  }

}