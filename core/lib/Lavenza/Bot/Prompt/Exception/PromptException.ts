/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Igor } from "../../../Confidant/Igor";

import { PromptExceptionType } from "./PromptExceptionType";

/**
 * Provides a base class for Prompt Exceptions.
 */
export class PromptException extends Error {

  /**
   * Type of this exception.
   */
  public readonly type: PromptExceptionType;

  // tslint:disable-next-line:comment-format
  // noinspection JSUnusedLocalSymbols
  /**
   * Prompt constructor.
   */
  public constructor(type: PromptExceptionType, message: string = "") {
    super();

    if (!Object.values(PromptExceptionType)
      .includes(type)) {
      Igor.throw("Invalid PromptException type '{{type}}' used in constructor. Please use a valid type. See /lib/Bot/Prompt/Exception/PromptExceptionTypes for more details.", {type})
        .then(() => {
        // Do nothing.
      });
    }

    this.type = type;
  }

  /**
   * Override base toString method.
   */
  public toString(): string {
    return `Prompt error of type '${this.type}' has occurred!`;
  }

}
