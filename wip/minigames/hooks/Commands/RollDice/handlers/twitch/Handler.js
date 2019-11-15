"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
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
const CommandClientHandler_1 = require("../../../../../../../core/talents/commander/src/Command/CommandClientHandler");
const Sojiro_1 = require("../../../../../../../core/lib/Lavenza/Confidant/Sojiro");
const Yoshida_1 = require("../../../../../../../core/lib/Lavenza/Confidant/Yoshida");
/**
 * A simple client handler.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
class Handler extends CommandClientHandler_1.CommandClientHandler {
    /**
     * Execute this handler's tasks.
     *
     * @inheritDoc
     */
    execute(data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build the response.
            const response = yield Yoshida_1.Yoshida.translate("{{author}}, the result of your roll is: {{roll}}!", {
                author: this.resonance.author.username,
                roll: data.roll,
            }, this.resonance.locale);
            // Await the delay patiently...
            yield Sojiro_1.Sojiro.wait(data.delay);
            // Send the response.
            yield this.resonance.reply(response);
        });
    }
}
exports.Handler = Handler;
