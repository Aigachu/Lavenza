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
const Sojiro_1 = require("../../Confidant/Sojiro");
const Kawakami_1 = require("../../Confidant/Kawakami");
/**
 * A simple client handler.
 *
 * Client Handlers are mostly used when Commands need to do different tasks depending on the client where they were
 * invoked. Using Client Handlers makes it easy to decouple the code properly.
 *
 * A great example of this can be found in the examples command. It'll be easier to understand in practice!
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
class CommandClientHandler {
    /**
     * ClientHandler constructor.
     *
     * Provides a constructor for ClientHandlers, classes that handle tasks for Commands that are specific to a client.
     *
     * @param command
     *   Command this handler belongs to.
     * @param resonance
     *   Resonance that triggered the command.
     * @param directory
     *   Path to this Handler's directory.
     */
    constructor(command, resonance, directory) {
        this.command = command;
        this.resonance = resonance;
        this.directory = directory;
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Send a basic reply.
     *
     * A wrapper function that can send a quick reply to a message.
     *
     * @param data
     *   The data containing information on the message to send.
     *
     * @returns
     *   The message that was sent as a reply.
     */
    basicReply(data) {
        return __awaiter(this, void 0, void 0, function* () {
            data.replacers = data.replacers || {};
            // Set up for "bolding" any replacers.
            if (!Sojiro_1.Sojiro.isEmpty(data.bolds)) {
                yield Promise.all(data.bolds.map((key) => __awaiter(this, void 0, void 0, function* () {
                    if (!data.replacers[key]) {
                        return;
                    }
                    data.replacers[key] = yield Kawakami_1.Kawakami.bold(data.replacers[key]);
                })));
            }
            yield this.resonance.typeFor(1, this.resonance.channel);
            yield this.resonance.__reply(data.message, Object.assign({ user: this.resonance.author }, data.replacers));
        });
    }
}
exports.CommandClientHandler = CommandClientHandler;
