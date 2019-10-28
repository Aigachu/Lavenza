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
const Prompt_1 = require("../../Prompt/Prompt");
/**
 * Provides a class for Prompts set in Discord.
 */
class DiscordPrompt extends Prompt_1.Prompt {
    /**
     * @inheritDoc
     */
    constructor(user, line, resonance, lifespan, onResponse, onError, bot) {
        super(user, line, resonance, lifespan, onResponse, onError, bot);
    }
    /**
     * Set condition for discord prompts.
     *
     * @inheritDoc
     */
    condition(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // In Discord, we wait for the next message that comes from the author, in the configured 'line'.
            return resonance.message.channel.id === this.line.id && resonance.message.author.id === this.user.id;
        });
    }
}
exports.DiscordPrompt = DiscordPrompt;
