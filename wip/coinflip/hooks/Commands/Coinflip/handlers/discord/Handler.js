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
const CommandClientHandler_1 = require("../../../../../../../core/talents/commander/src/Command/CommandClientHandler");
/**
 * A simple client handler.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
class Handler extends CommandClientHandler_1.CommandClientHandler {
    /**
     * Execute handler tasks.
     *
     * @inheritDoc
     */
    execute(data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Do nothing.
        });
    }
    /**
     * Fetch Discord user of the opponent being challenged for a guess game.
     *
     * @param data
     *   Data being sent to this handler.
     */
    getOpponent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let input = data.userInput;
            input = input.replace("<@", "");
            input = input.replace("!", "");
            input = input.replace(">", "");
            const opponent = this.resonance.guild.members.find((member) => member.id === input);
            return opponent.user || undefined;
        });
    }
}
exports.Handler = Handler;
