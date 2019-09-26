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
const DiscordResonance_1 = require("./DiscordResonance");
const TwitchResonance_1 = require("./TwitchResonance");
const ClientType_1 = require("../Client/ClientType");
const Sojiro_1 = require("../../Confidant/Sojiro");
const Igor_1 = require("../../Confidant/Igor");
/**
 * Provides a factory to create the appropriate CommandAuthorizer given a client.
 *
 * Each client validates clients in different ways.
 */
class ResonanceFactory {
    /**
     * Resonance builder defined by the factory.
     *
     * @param content
     *   The raw string content of the message heard by the bot.
     * @param message
     *   The message object received, unmodified. This is useful, since different clients might send different kinds of
     *   message objects. It's always nice to have the original message.
     * @param bot
     *   The bot that heard this message.
     * @param client
     *   The client that sent the original message.
     */
    static build(content, message, bot, client) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize the resonance variable.
            let resonance = null;
            //  Depending on the client type, build the appropriate CommandAuthorizer.
            switch (client.type) {
                // For Discord, we create a specific resonance.
                case ClientType_1.ClientType.Discord: {
                    resonance = new DiscordResonance_1.DiscordResonance(content, message, bot, client);
                    break;
                }
                // For Twitch, we create a specific resonance.
                case ClientType_1.ClientType.Twitch: {
                    resonance = new TwitchResonance_1.TwitchResonance(content, message, bot, client);
                    break;
                }
                // For Slack, we create a specific resonance.
                // case ClientTypes.Slack: {
                //   resonance = new SlackResonance(content, message, bot, client);
                //   break;
                // }
            }
            // This really shouldn't happen...But yeah...
            if (Sojiro_1.Sojiro.isEmpty(resonance)) {
                yield Igor_1.Igor.throw('Resonance could not be built. This should not happen. Fix your shitty code, Aiga!');
            }
            // Run Resonance async build.
            yield resonance.build();
            // Build the resonance. Then we're good to go. We can send it back to the bot.
            return resonance;
        });
    }
}
exports.ResonanceFactory = ResonanceFactory;
