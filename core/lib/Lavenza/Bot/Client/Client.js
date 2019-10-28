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
const Igor_1 = require("../../Confidant/Igor");
/**
 * Provides a base class for Clients.
 */
class Client {
    /**
     * Client constructor.
     *
     * @param bot
     *   The Bot this client is for.
     * @param config
     *   The configurations for this Client.
     */
    constructor(bot, config) {
        this.bot = bot;
        this.config = config;
    }
    /**
     * Listen to a message heard in a client.
     *
     * Now, explanations.
     *
     * This function will be used in clients to send a 'communication' back to the bot. This happens whenever a message
     * is 'heard', meaning that the bot is in a chat room and a message was sent by someone (or another bot).
     *
     * When this function is ran, we fetch the raw content of the message sent, and we build a Resonance object with it.
     * This is a fancy name for an object that stores information about a received communication. Then, we send off the
     * Resonance to the listeners that are on the bot with all the information needed to act upon the message that was
     * heard.
     *
     * Listeners will receive the Resonance, and then they react to them. Perfect example is the CommandListener, that
     * will receive a Resonance and determine whether a command was issued to the Bot. Custom Listeners defined in Talents
     * can do whatever they want when they hear a message!
     *
     * This function will also have logic pertaining to Prompts, but this can be explained elsewhere. :)
     *
     * @param message
     *   Message object from this client, obtained from a message event.
     */
    resonate(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Construct a 'Resonance'.
            const resonance = yield this.buildResonance(message);
            // Run build tasks on the resonance.
            yield resonance.build();
            // Fire all of the bot's prompts, if any.
            yield Promise.all(this.bot.prompts.map((prompt) => __awaiter(this, void 0, void 0, function* () {
                // Fire the listen function.
                yield prompt.listen(resonance);
            })));
            // Fire all of the bot's listeners.
            yield Promise.all(this.bot.listeners.map((listener) => __awaiter(this, void 0, void 0, function* () {
                // Fire the listen function.
                yield listener.listen(resonance);
            })));
        });
    }
    /**
     * The command authority function. This function will return TRUE if the command is authorized, and FALSE otherwise.
     *
     * Each client will have it's own CommandAuthorizer implementation that will extend the core functionality.
     *
     * @returns
     *   Returns true if the command is authorized. False otherwise.
     */
    authorize(command, resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build the authorizer.
            const authorizer = yield this.buildCommandAuthorizer(command, resonance);
            yield authorizer.build();
            // Return the result of the authorizer.
            return authorizer.authorize();
        });
    }
    /**
     * Set up prompts for a client.
     *
     * @inheritDoc
     *   From Resonance class.
     *
     * @see Resonance
     */
    prompt(user, line, resonance, lifespan, onResponse, onError = (e) => __awaiter(this, void 0, void 0, function* () {
        console.log(e);
    })) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build the prompt.
            const prompt = yield this.buildPrompt(user, line, resonance, lifespan, onResponse, onError);
            // Set the prompt to the bot.
            this.bot.prompts.push(prompt);
            // Await resolution of the prompt.
            yield prompt.await()
                .catch(Igor_1.Igor.pocket);
        });
    }
}
exports.Client = Client;
