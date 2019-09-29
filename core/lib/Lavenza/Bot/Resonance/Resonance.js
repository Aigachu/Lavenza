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
const Igor_1 = require("../../Confidant/Igor");
const Sojiro_1 = require("../../Confidant/Sojiro");
const Yoshida_1 = require("../../Confidant/Yoshida");
/**
 * Provides a model that regroups information about a message received from a client.
 *
 * I love the name. But yes, this is a model to house a collection of useful information about a message a bot
 * receives.
 *
 * If a message contains a command, it will be stored here after being deciphered. Everything happens here, and all
 * relevant data can be found here.
 *
 * To manage different types of clients, this class also acts as a parent class to child classes that are more
 * client specific. This being said, child classes make good use of functions and properties in this class.
 */
class Resonance {
    /**
     * Resonance constructor.
     *
     * @param content
     *   The raw string content of the message received. This is deciphered by the bot.
     * @param message
     *   The message object received, unmodified. This is useful, since different clients might send different kinds of
     *   messages. It's always nice to have the original message.
     * @param bot
     *   The bot that heard this resonance.
     * @param client
     *   The client that sent the original message.
     */
    constructor(content, message, bot, client) {
        this.content = content;
        this.message = message;
        this.bot = bot;
        this.client = client;
        this.instruction = undefined; // A demand is set to the Resonance only if a command was issued.
        this.author = undefined; // The author will be resolved depending on the type of Resonance.
    }
    /**
     * Perform build tasks for a Resonance.
     *
     * This function runs shortly after a resonance is constructed. Consider this an asynchronous constructor.
     */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            this.origin = yield this.resolveOrigin();
            this.locale = yield this.getLocale();
            this.private = yield this.resolvePrivacy();
        });
    }
    /**
     * Set this Resonance's Instruction.
     *
     * @param instruction
     *   An instruction to set to the Resonance.
     */
    setInstruction(instruction) {
        return __awaiter(this, void 0, void 0, function* () {
            this.instruction = instruction;
        });
    }
    /**
     * Return command associated to this Resonance, if any.
     *
     * @returns
     *   Returns the command tied to this Resonance, through its instruction.
     */
    getCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.instruction.command;
        });
    }
    /**
     * Return arguments used with the command issued in this Resonance, if any.
     */
    getArguments() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.instruction.arguments;
        });
    }
    /**
     * Execute command coming from this resonance.
     *
     * The command is attached to the order linked to this resonance, if any.
     *
     * And order is only built and attached to the resonance if it's found through the CommandInterpreter.
     */
    executeCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.instruction.command.execute(this);
        });
    }
    /**
     * Execute help request for a command, coming from this resonance.
     *
     * The command is attached to the order linked to this resonance, if any.
     *
     * And order is only built and attached to the resonance if it's found through the CommandInterpreter.
     */
    executeHelp() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.instruction.command.help(this);
        });
    }
    /**
     * Returns whether or not this Resonance was heard in a private channel.
     *
     * @returns
     *   Returns true if the Resonance was heard in a private channel. Returns false otherwise.
     */
    isPrivate() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.private === "public";
        });
    }
    /**
     * Set up a prompt to a specified user.
     *
     * Prompts are interactive ways to query information from a user in a seamless conversational way.
     *
     * Commands can issue prompts to expect input from the user in their next messages. For example, is a user uses the
     * '!ping' command, in the code we can use Prompts to prompt the user for information afterwards. The prompt can send
     * a message along the lines of "Pong! How are you?" and act upon the next reply the person that initially called the
     * command writes (Or act upon any future message really).
     *
     * @param user
     *   User that is being prompted.
     * @param line
     *   The communication line for this prompt. Basically, where we want the interaction to happen.
     * @param lifespan
     *   The lifespan of this Prompt.
     *   If the bot doesn't receive an answer in time, we cancel the prompt.
     *   10 seconds is the average time a white boy waits for a reply from a girl he's flirting with after sending her a
     *   message. You want to triple that normally. You're aiming for a slightly more patient white boy. LMAO! Thank you
     *   AVION for this wonderful advice!
     * @param onResponse
     *   The callback function that runs once a response has been heard.
     * @param onError
     *   The callback function that runs once a failure occurs. Failure includes not getting a response.
     */
    prompt(user, line, lifespan, onResponse, onError = (e) => __awaiter(this, void 0, void 0, function* () { console.log(e); })) {
        return __awaiter(this, void 0, void 0, function* () {
            // Simply run this through the bot's prompt function.
            yield this.client.prompt(user, line, this, lifespan, onResponse, onError);
        });
    }
    /**
     * Reply to the current resonance.
     *
     * This will send a formatted reply to the Resonance, replying directly to the message that was heard.
     *
     * @param content
     *   Content to send back.
     * @param personalizationTag
     *   Tag for text personalizations, if needed. This will use Yoshida to get personalizations for the current bot.
     *
     * @returns
     *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
     *   act upon it if needed.
     */
    reply(content, personalizationTag = "") {
        return __awaiter(this, void 0, void 0, function* () {
            // Basically call the send method, but we already know the destination.
            return this.send(this.origin, content, personalizationTag);
        });
    }
    /**
     * Reply to the current resonance, with a translating the string.
     *
     * This will send a formatted reply to the Resonance, replying directly to the message that was heard.
     *
     * We make this function flexible, similar to how i18n.__() works. It will allow multiple definitions for function
     * calls and act depending on what types of parameters are given.
     *
     * @param parameters
     *   Parameters to parse from the call.
     *
     * @returns
     *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
     *   act upon it if needed.
     */
    __reply(...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // Parse the parameters obtained.
            const params = yield Yoshida_1.Yoshida.parseI18NParams(parameters);
            // Basically call the send method, but we already know the destination.
            return this.__send(this.origin, { phrase: params.phrase, locale: params.locale, tag: params.tag }, params.replacers, "PARSED")
                .catch(Igor_1.Igor.stop);
        });
    }
    /**
     * Send a message to a destination using information from the resonance.
     *
     * This will send a formatted message to it's destination.
     *
     * This function acts as a shortcut to sending messages back to a resonance.
     *
     * @param destination
     *   Destination to send this message to.
     * @param content
     *   Content to send back to the destination.
     * @param personalizationTag
     *   Tag for text personalizations, if needed. This will use Yoshida to get personalizations for the current bot.
     *
     * @returns
     *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
     *   act upon it if needed. This is useful for Discord.
     */
    send(destination, content, personalizationTag = "") {
        return __awaiter(this, void 0, void 0, function* () {
            // Store variable for any content that is altered.
            let alteredContent = content;
            // If a personalization tag is set, we want to use Yoshida to get a personalization for this bot.
            if (!Sojiro_1.Sojiro.isEmpty(personalizationTag)) {
                alteredContent = yield Yoshida_1.Yoshida.personalize(alteredContent, personalizationTag, this.bot);
            }
            // If all fails, we'll simply use this instance's doSend function.
            // Which will currently crash the program.
            return this.doSend(this.bot, destination, alteredContent)
                .catch(Igor_1.Igor.stop);
        });
    }
    /**
     * Send a message to a destination using information from the resonance, translating the text.
     *
     * This will send a formatted message to it's destination.
     *
     * This function acts as a shortcut to sending messages back to a resonance. It
     * will handle translation of the text as well.
     *
     * We make this function flexible, similar to how i18n.__() works. It will allow multiple definitions for function
     * calls and act depending on what types of parameters are given.
     *
     * @param destination
     *   Destination to send this message to.
     * @param parameters
     *   Parameters to parse from the call.
     *
     * @returns
     *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
     *   act upon it if needed.
     */
    __send(destination, ...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // Parse the parameters obtained.
            const params = yield Yoshida_1.Yoshida.parseI18NParams(parameters);
            // If a locale is not set in the parameters, we need to determine what it is using the Resonance.
            if (params.locale === undefined) {
                params.locale = yield this.locale;
            }
            // If a locale is STILL not defined after the above code, we set it to the default one set to the bot.
            if (params.locale === undefined) {
                const config = yield this.bot.getActiveConfig();
                params.locale = config.locale;
            }
            // If a personalization tag is set, we want to use Yoshida to get a personalization for this bot.
            if (!Sojiro_1.Sojiro.isEmpty(params.tag)) {
                params.phrase = yield Yoshida_1.Yoshida.personalize(params.phrase, params.tag, this.bot)
                    .catch(Igor_1.Igor.stop);
            }
            // Now, using the information from the parameters, we fetch necessary translations.
            const content = yield Yoshida_1.Yoshida.translate({ phrase: params.phrase, locale: params.locale }, params.replacers, "PARSED");
            // Invoke the regular send function.
            return this.send(destination, content);
        });
    }
}
exports.Resonance = Resonance;
