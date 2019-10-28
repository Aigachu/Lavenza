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
// Modules.
const events_1 = require("events");
// Imports.
const Igor_1 = require("../../Confidant/Igor");
const Sojiro_1 = require("../../Confidant/Sojiro");
const PromptException_1 = require("./Exception/PromptException");
const PromptExceptionType_1 = require("./Exception/PromptExceptionType");
/**
 * Provides a base class for Prompts.
 *
 * Prompts can be set for a bot to await input from a user. Using the received input, it can then act upon it.
 */
class Prompt {
    /**
     * Prompt constructor.
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
     *   The Bot this prompt is being created for.
     */
    constructor(user, line, resonance, lifespan, onResponse, onError, bot) {
        /**
         * Event Emitter.
         */
        this.ee = new events_1.EventEmitter();
        /**
         * Field to hold the number of times this prompt has failed through error.
         */
        this.resetCount = 0;
        this.user = user;
        this.line = line;
        this.resonance = resonance;
        this.lifespan = lifespan;
        this.requester = resonance.author;
        this.onResponse = onResponse;
        this.onError = onError;
        this.bot = bot;
    }
    /**
     * Prompts have their own listen functions.
     *
     * Checks the condition with a received resonance, and resolves the Prompt
     * if conditions are matched.
     *
     * @param resonance
     *   The resonance that was heard by the Prompt.
     */
    listen(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the resonance that was just heard is not from the same client, we do nothing.
            if (resonance.client.type !== this.resonance.client.type) {
                return;
            }
            // We check the condition defined in this prompt. If it passes, we resolve it.
            if (yield this.condition(resonance)) {
                // Emit the event that will alert the Prompt that it should be resolved.
                yield this.ee.emit("prompt-response", resonance);
            }
        });
    }
    /**
     * Await the resolution of the prompt.
     *
     * If the prompt doesn't get resolved by the user within the lifespan, it will
     * cancel itself. Otherwise, after resolution, we clear the awaiting status.
     *
     * @returns
     *   Resolution of the prompt, or an error.
     */
    await() {
        // We manage the Promise here.
        return new Promise((resolve, reject) => {
            // Set the bomb. We'll destroy the prompt if it takes too long to execute.
            this.timer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                // Check if the prompt still exists after the time has elapsed.
                if (this.bot.prompts.includes(this)) {
                    // If the lifespan depletes, we remove the prompt.
                    yield this.disable();
                    const exception = new PromptException_1.PromptException(PromptExceptionType_1.PromptExceptionType.NO_RESPONSE, "No response was provided in the time given. Firing error handler.");
                    yield this.onError(exception);
                    reject();
                }
            }), this.lifespan * 1000);
            // If we get a response, we clear the bomb and return early.
            this.ee.on("prompt-response", (resonance) => __awaiter(this, void 0, void 0, function* () {
                // Clear timeouts and event listeners since we got a response.
                yield this.clearTimer();
                yield this.clearListeners();
                // Fire the callback.
                yield this.onResponse(resonance, this)
                    .catch((e) => __awaiter(this, void 0, void 0, function* () {
                    const exception = new PromptException_1.PromptException(PromptExceptionType_1.PromptExceptionType.MISC, e);
                    yield this.onError(exception);
                }));
                yield this.disable();
                resolve();
            }));
        });
    }
    // tslint:disable-next-line:comment-format
    // noinspection JSUnusedGlobalSymbols
    /**
     * Resets the prompt to listen for another message.
     *
     * This can be useful in situations where you want to try reading the input again.
     *
     * @param error
     *   Details of the error that occurred causing the prompt to reset.
     *
     * @returns
     *   Resolution of the prompt (newly reset), or an error.
     */
    reset({ error = "" }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.resetCount === 2) {
                yield this.error(PromptExceptionType_1.PromptExceptionType.MAX_RESET_EXCEEDED);
                return;
            }
            if (!Sojiro_1.Sojiro.isEmpty(error)) {
                yield this.error(error);
            }
            this.resetCount += 1;
            yield this.await()
                .catch(Igor_1.Igor.pocket);
        });
    }
    /**
     * Disable this prompt.
     */
    disable() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clearTimer();
            yield this.clearListeners();
            yield this.bot.removePrompt(this);
        });
    }
    /**
     * Send an error to the error handler for this prompt.
     *
     * @param type
     *   Type of PromptException to fire.
     */
    error(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const exception = new PromptException_1.PromptException(type);
            yield this.onError(exception);
        });
    }
    /**
     * Clear the timer attached to this prompt.
     */
    clearTimer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clearTimeout(this.timer);
        });
    }
    /**
     * Clear all event listeners in this prompt's event emitter.
     */
    clearListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ee.removeAllListeners();
        });
    }
}
exports.Prompt = Prompt;
