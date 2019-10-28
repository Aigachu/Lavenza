"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Imports.
const Igor_1 = require("../../../Confidant/Igor");
const PromptExceptionType_1 = require("./PromptExceptionType");
/**
 * Provides a base class for Prompt Exceptions.
 */
class PromptException extends Error {
    // tslint:disable-next-line:comment-format
    // noinspection JSUnusedLocalSymbols
    /**
     * Prompt constructor.
     */
    constructor(type, message = "") {
        super();
        if (!Object.values(PromptExceptionType_1.PromptExceptionType)
            .includes(type)) {
            Igor_1.Igor.throw("Invalid PromptException type '{{type}}' used in constructor. Please use a valid type. See /lib/Bot/Prompt/Exception/PromptExceptionTypes for more details.", { type })
                .then(() => {
                // Do nothing.
            });
        }
        this.type = type;
    }
    /**
     * Override base toString method.
     */
    toString() {
        return `Prompt error of type '${this.type}' has occurred!`;
    }
}
exports.PromptException = PromptException;
