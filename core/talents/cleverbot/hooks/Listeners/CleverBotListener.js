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
const ClientType_1 = require("../../../../lib/Lavenza/Bot/Client/ClientType");
const Listener_1 = require("../../../../lib/Lavenza/Bot/Listener/Listener");
const Morgana_1 = require("../../../../lib/Lavenza/Confidant/Morgana");
// Noinspection JSUnusedGlobalSymbols
/**
 * Custom Listener for the CleverBot Talent.
 *
 * It simply hears a message and has a small chance of querying the CleverBot API and answering!
 */
class CleverBotListener extends Listener_1.Listener {
    /**
     * This is the function that listens to messages and acts upon them.
     *
     * @inheritDoc
     */
    listen(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Say something clever! A 1% chance to do so.
            // We only bought 15K API calls for now...We don't want this to happen too often.
            // 2% chance of saying something clever.
            if (Math.random() < 0.02) {
                yield this.saySomethingClever(resonance);
            }
        });
    }
    /**
     * Say something clever using CleverBot's API.
     *
     * @param resonance
     *   The resonance heard by the listener.
     */
    saySomethingClever(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the API isn't set, we don't do anything.
            if (this.talent.cleverBotApi) {
                try {
                    if (resonance.client.type === ClientType_1.ClientType.Discord) {
                        const client = resonance.client;
                        yield client.typeFor(5, resonance.message.channel);
                    }
                    const response = yield this.talent.cleverBotApi.query(resonance.content);
                    let author = resonance.author.username;
                    // If we're on discord, the author should be a tag.
                    if (resonance.client.type === ClientType_1.ClientType.Discord) {
                        author = `<@${resonance.message.author.id}>`;
                    }
                    yield resonance.__reply("{{author}}, {{response}}", {
                        author,
                        response: response.output,
                    });
                }
                catch (e) {
                    yield Morgana_1.Morgana.warn("Error occurred when querying CleverBot API. This is either due to special characters being in the message heard in the listener, or the API not being able to be instantiated.");
                }
            }
        });
    }
}
exports.CleverBotListener = CleverBotListener;
