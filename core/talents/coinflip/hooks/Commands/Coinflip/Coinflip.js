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
const Command_1 = require("../../../../../lib/Lavenza/Bot/Command/Command");
const Igor_1 = require("../../../../../lib/Lavenza/Confidant/Igor");
const Kawakami_1 = require("../../../../../lib/Lavenza/Confidant/Kawakami");
const Sojiro_1 = require("../../../../../lib/Lavenza/Confidant/Sojiro");
const GuessGameArgHandler_1 = require("./src/ArgHandler/GuessGameArgHandler");
// Noinspection JSUnusedGlobalSymbols
/**
 * Coinflip command.
 *
 * Flip a coin!
 */
class Coinflip extends Command_1.Command {
    constructor() {
        super(...arguments);
        /**
         * Maximum number of coins to flip.
         */
        this.maximumNumberOfCoins = 5;
    }
    /**
     * Flip a coin and return Heads or Tails.
     */
    static flipACoin() {
        return __awaiter(this, void 0, void 0, function* () {
            return Math.floor(Math.random() * 2) === 0 ? "Tails" : "Heads";
        });
    }
    /**
     * Execute coinflip command tasks!
     *
     * @inheritDoc
     */
    execute(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the arguments & raw content.
            const args = resonance.instruction.arguments;
            const content = resonance.instruction.content;
            // If the 'd' or 'duel' arguments are used, we fire the DuelArgHandler handler.
            if ("g" in args || "guess" in args || "guessgame" in args) {
                const input = args.d || args.guess || args.guessgame;
                yield GuessGameArgHandler_1.GuessGameArgHandler.handle(this, resonance, input)
                    .catch(Igor_1.Igor.stop);
                return;
            }
            // Here, we go forth with the regular execution of the command.
            // By default, the user is only flipping 1 coin.
            let numberOfCoins = 1;
            // If the 'c' or 'coins' argument is used, we change the number of coins.
            if ("c" in args || !isNaN(Number(content)) && !Sojiro_1.Sojiro.isEmpty(content)) {
                // Determine what we're working with.
                const providedNumber = args.c || Number(content);
                // If the provided count isn't a number, we can't go through with this.
                if (isNaN(providedNumber) || !Number.isInteger(providedNumber)) {
                    yield resonance.__reply("Uh...Sorry {{user}}, but this doesn't seem to be a valid number of coins to flip.", {
                        user: resonance.author,
                    }, "::COINFLIP-INVALID_COIN_COUNT");
                    return;
                }
                // We'll set a maximum. On va se calmer la...
                if (providedNumber > this.maximumNumberOfCoins) {
                    yield resonance.__reply("Whoa {{user}}! Let's not exaggerate now haha. Maximum of {{max}} coins okay?!", {
                        max: yield Kawakami_1.Kawakami.bold(this.maximumNumberOfCoins),
                        user: resonance.author,
                    }, "::COINFLIP-MAX_COIN_COUNT_SURPASSED");
                    return;
                }
                // We'll set a maximum. On va se calmer la...
                if (providedNumber === 0) {
                    yield resonance.__reply("And how would you expect me to flip 0 coins?", { user: resonance.author, max: yield Kawakami_1.Kawakami.bold(this.maximumNumberOfCoins) }, "::COINFLIP-FLIP_ZERO_COINS");
                    return;
                }
                // Otherwise, we should be good to adjust the number of coins.
                numberOfCoins = providedNumber;
            }
            // Now we'll work out flipping the coins.
            // If we're only flipping 1 coin, we simply do it.
            if (numberOfCoins === 1) {
                // Flip the coin already and get the result.
                const result = yield Coinflip.flipACoin();
                // Type for a second for some added effect!
                yield resonance.typeFor(1, resonance.channel);
                // First, we'll send the flip message.
                yield resonance.__reply("Okay {{user}}! Flipping a coin!", { user: resonance.author }, "::COINFLIP-FLIP_MESSAGE");
                // Type for 2 seconds.
                yield resonance.typeFor(2, resonance.channel);
                // Send the result!
                yield resonance.__reply("{{user}}, you obtained {{result}}!", {
                    result: yield Kawakami_1.Kawakami.bold(result),
                    user: resonance.author,
                }, "::COINFLIP-FLIP_RESULT");
                // End execution here.
                return;
            }
            // Alternatively, when there are multiple results, we calculate each result.
            const results = {
                heads: 0,
                tails: 0,
            };
            // Flip a coin for the number of times defined.
            for (let i = 0; i < numberOfCoins; i += 1) {
                // Flip a coin.
                const coinflip = yield Coinflip.flipACoin();
                if (coinflip === "Heads") {
                    results.heads += 1;
                }
                else {
                    results.tails += 1;
                }
            }
            // Alternatively, when we have multiple results...
            // Type for a second for some added effect!
            yield resonance.client.typeFor(1, resonance.channel);
            // First, we'll send the flip message.
            yield resonance.__reply("Okay {{user}}! Flipping {{count}} coins. This will only take a moment...", {
                count: yield Kawakami_1.Kawakami.bold(numberOfCoins),
                user: resonance.author,
            }, "::COINFLIP-FLIP_MESSAGE_MULTIPLE");
            // Type for 2 seconds.
            yield resonance.client.typeFor(4, resonance.channel);
            // Send the result!
            yield resonance.__reply("{{user}}, you obtained the following results:\n\nTails: {{tails}}\nHeads: {{heads}}", {
                heads: yield Kawakami_1.Kawakami.bold(results.heads),
                tails: yield Kawakami_1.Kawakami.bold(results.tails),
                user: resonance.author,
            }, "::COINFLIP-FLIP_RESULT_MULTIPLE");
        });
    }
}
exports.Coinflip = Coinflip;
