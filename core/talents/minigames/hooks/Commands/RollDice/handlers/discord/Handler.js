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
const Kawakami_1 = require("../../../../../../../lib/Lavenza/Confidant/Kawakami");
const Yoshida_1 = require("../../../../../../../lib/Lavenza/Confidant/Yoshida");
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
            // Making the text sexy.
            data.roll = yield Kawakami_1.Kawakami.bold(data.roll);
            // Build the response.
            const response = yield Yoshida_1.Yoshida.translate("{{author}}, the result of your roll is: {{roll}}!", {
                author: this.resonance.author,
                roll: data.roll,
            }, this.resonance.locale);
            // Start typing with the chosen answer's timeout, then send the reply to the user.
            yield this.resonance.client.typeFor(data.delay, this.resonance.channel);
            yield this.resonance.reply(response);
        });
    }
}
exports.Handler = Handler;
