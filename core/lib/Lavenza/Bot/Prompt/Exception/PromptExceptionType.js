"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A little Enum to manage our types of Prompt Exceptions.
 *
 * We don't wanna have to change them EVERYWHERE. So we manage them all here!
 */
var PromptExceptionType;
(function (PromptExceptionType) {
    /**
     * When a prompt doesn't receive a response before it's lifespan, fire this error.
     */
    PromptExceptionType["NO_RESPONSE"] = "no-response";
    /**
     * When a prompt doesn't receive a valid response, fire this error.
     */
    PromptExceptionType["INVALID_RESPONSE"] = "invalid-response";
    /**
     * Fire this error for miscellaneous failures.
     */
    PromptExceptionType["MISC"] = "miscellaneous";
    /**
     * When a prompt reaches it's maximum reset allowance, fire this error.
     */
    PromptExceptionType["MAX_RESET_EXCEEDED"] = "max-reset-exceeded";
})(PromptExceptionType || (PromptExceptionType = {}));
exports.PromptExceptionType = PromptExceptionType;
