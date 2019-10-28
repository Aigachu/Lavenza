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
/**
 * RollDice Command!
 *
 * Roll dice to test your luck! Play the lottery if you roll 10000/10000.
 */
class RollDice extends Command_1.Command {
    /**
     * Get a random answer for 8Ball to say.
     *
     * @returns
     *   The answer, fetched randomly from the list of answers.
     */
    static getRandomRoll() {
        return __awaiter(this, void 0, void 0, function* () {
            // We'll use a random number for the array key.
            return RollDice.rolls[Math.floor(Math.random() * RollDice.rolls.length)];
        });
    }
    /**
     * This is the static build function of the command.
     *
     * You can treat this as a constructor. Assign any properties that the command may
     * use!
     *
     * @inheritDoc
     */
    build(config, talent) {
        const _super = Object.create(null, {
            build: { get: () => super.build }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // The build function must always run the parent's build function! Don't remove this line.
            yield _super.build.call(this, config, talent);
            // Roll types are randomized and have different delays.
            RollDice.rolls = [];
            // Set roll types.
            RollDice.rolls.push({
                message: "*rolls the dice normally*",
                timeout: 2,
            });
            RollDice.rolls.push({
                message: "*throws the dice on the ground violently...*",
                timeout: 3,
            });
            RollDice.rolls.push({
                message: "*accidentally drops the dice on the ground while getting ready*",
                timeout: 4,
            });
            RollDice.rolls.push({
                message: "*spins the dice*",
                timeout: 4,
            });
        });
    }
    /**
     * Execute command.
     *
     * @inheritDoc
     */
    execute(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get arguments.
            const args = yield resonance.getArguments();
            // Determine the type of die requested.
            // It will default to 6 face dice.
            const faces = args._[0] || 6;
            // If the # of faces is not a number, we send a message and return.
            if (isNaN(faces)) {
                return;
            }
            // Roll the die.
            const roll = Math.floor(Math.random() * faces) + 1;
            // Choose a roll type with a random key.
            const rand = yield RollDice.getRandomRoll();
            // Send the initial message.
            yield resonance.reply(rand.message);
            // Invoke Client Handlers to determine what to do in each client.
            /** @see ./handlers */
            yield this.fireClientHandlers(resonance, {
                delay: rand.timeout,
                roll,
            });
        });
    }
}
exports.RollDice = RollDice;
