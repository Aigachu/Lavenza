"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports.
const CommandClientHandler_1 = require("../../../../../../../lib/Lavenza/Bot/Command/CommandClientHandler");
/**
 * A simple client handler.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
class Handler extends CommandClientHandler_1.CommandClientHandler {
    /**
     * @inheritDoc
     */
    execute(data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.Handler = Handler;
