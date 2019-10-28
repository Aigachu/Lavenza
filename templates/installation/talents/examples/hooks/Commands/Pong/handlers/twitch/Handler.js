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
const lavenza_1 = require("lavenza");
/**
 * A simple Twitch client handler for the Pong command.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
class Handler extends lavenza_1.CommandClientHandler {
    /**
     * Execute this handler's tasks.
     *
     * @inheritDoc
     */
    execute(data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Example of accessing the data that was passed in the this.fireClientHandlers() function call in the command.
            // It'all be found in the data variable.
            // In the case of this example, data.hello should be accessible here.
            console.log(data);
            // You also have access to these!
            // The command this handler is being used for.
            console.log(this.command);
            // The resonance, of course!
            console.log(this.resonance);
            // The path to the directory of this handler. Useful if you want to include even more files.
            console.log(this.directory);
            // Send an additional message when this command is used in Twitch clients.
            yield this.resonance.__reply("I love Twitch! It's such a cool website. :P");
        });
    }
    /**
     * Execute a custom method for this handler.
     *
     * @param data
     *   Data given through the command's call of its handlers() function.
     */
    myCustomMethod(data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Depending on if the invoker had a good day or not, customize reply.
            if (data.goodDay === true) {
                yield this.resonance.__reply("Good days are awesome, right?");
            }
            else if (data.goodDay === false) {
                yield this.resonance.__reply("Bad days suck huh...");
            }
            else {
                yield this.resonance.__reply(">:(");
            }
        });
    }
}
exports.Handler = Handler;
