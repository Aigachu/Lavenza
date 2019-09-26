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
    PromptExceptionType["NO_RESPONSE"] = "no-response";
    PromptExceptionType["INVALID_RESPONSE"] = "invalid-response";
    PromptExceptionType["MISC"] = "miscellaneous";
    PromptExceptionType["MAX_RESET_EXCEEDED"] = "max-reset-exceeded";
})(PromptExceptionType || (PromptExceptionType = {}));
exports.PromptExceptionType = PromptExceptionType;
