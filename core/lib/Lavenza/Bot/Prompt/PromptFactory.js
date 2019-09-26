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
const DiscordPrompt_1 = require("./DiscordPrompt");
const TwitchPrompt_1 = require("./TwitchPrompt");
const ClientType_1 = require("../Client/ClientType");
/**
 * Provide a factory class that manages the creation of the right client given a type.
 */
class PromptFactory {
    /**
     * Set up a prompt to a specified user.
     *
     * Prompts are interactive ways to query information from a user in a seamless conversational way.
     *
     * @param user
     *   User that is being prompted.
     * @param line
     *   The communication line for this prompt. Basically, where we want the interaction to happen.
     * @param resonance
     *   The Resonance tied to this prompt.
     * @param lifespan
     *   The lifespan of this Prompt.
     *   If the bot doesn't receive an answer in time, we cancel the prompt.
     *   10 seconds is the average time a white boy waits for a reply from a girl he's flirting with after sending her a
     *   message. You want to triple that normally. You're aiming for a slightly more patient white boy. LMAO!
     * @param onResponse
     *   The callback function that runs once a response has been heard.
     * @param onError
     *   The callback function that runs once a failure occurs. Failure includes not getting a response.
     * @param bot
     *   The bot that is prompting the user.
     */
    static build(user, line, resonance, lifespan, onResponse, onError, bot) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize the object.
            let prompt;
            // Depending on the requested type, we build the appropriate client.
            switch (resonance.client.type) {
                // For Discord clients, we build a Discord Prompt.
                case ClientType_1.ClientType.Discord: {
                    prompt = new DiscordPrompt_1.DiscordPrompt(user, line, resonance, lifespan, onResponse, onError, bot);
                    break;
                }
                // For Twitch clients, we build a Twitch Prompt.
                case ClientType_1.ClientType.Twitch: {
                    prompt = new TwitchPrompt_1.TwitchPrompt(user, line, resonance, lifespan, onResponse, onError, bot);
                    break;
                }
                // // For Slack clients, we build a Slack Prompt.
                // case ClientTypes.Slack: {
                //   prompt = new SlackPrompt(request, line, resonance, onResponse, bot);
                //   break;
                // }
            }
            return prompt;
        });
    }
}
exports.PromptFactory = PromptFactory;
