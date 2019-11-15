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
const Command_1 = require("../../../../../core/talents/commander/src/Command/Command");
/**
 * Love command!
 *
 * Test your love for something...Or someone... ;)
 */
class Love extends Command_1.Command {
    /**
     * Execute command.
     *
     * @inheritDoc
     */
    execute(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the thing the caller is getting love percentage for.
            // Lol Aiga naming your variable 'thing' really? xD
            const thing = resonance.instruction.content;
            // Calculate the percent.
            // It's completely random.
            // @TODO - Make it calculate a percent using an algorithm, so the result is always the same.
            const percent = `${Math.floor(Math.random() * 100)}%`;
            // Invoke Client Handlers to determine what to do in each client.
            /** @see ./handlers */
            yield this.fireClientHandlers(resonance, {
                percent,
                thing,
            });
        });
    }
}
exports.Love = Love;
