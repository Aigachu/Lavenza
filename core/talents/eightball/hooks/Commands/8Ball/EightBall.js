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
const Command_1 = require("../../../../../lib/Lavenza/Bot/Command/Command");
const Yoshida_1 = require("../../../../../lib/Lavenza/Confidant/Yoshida");
/**
 * 8Ball command! Ask 8Ball a question. :)
 */
class EightBall extends Command_1.Command {
    /**
     * Eightball Builder.
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
            // We'll store all possible answers in an array.
            // The timeout is the amount of time before the answer is actually said. Adds a bit of suspense!
            this.answers = [];
            this.answers.push({
                message: '"It is certain."',
                timeout: 2,
            });
            this.answers.push({
                message: '"It is decidedly so."',
                timeout: 2,
            });
            this.answers.push({
                message: '"Without a doubt."',
                timeout: 3,
            });
            this.answers.push({
                message: '"Yes, definitely."',
                timeout: 4,
            });
            this.answers.push({
                message: '"You may rely on it."',
                timeout: 2,
            });
            this.answers.push({
                message: '"As I see it, yes."',
                timeout: 3,
            });
            this.answers.push({
                message: '"Most likely."',
                timeout: 4,
            });
            this.answers.push({
                message: '"Outlook good."',
                timeout: 2,
            });
            this.answers.push({
                message: '"Yes."',
                timeout: 4,
            });
            this.answers.push({
                message: '"Signs point to yes."',
                timeout: 2,
            });
            this.answers.push({
                message: '"Reply hazy try again."',
                timeout: 2,
            });
            this.answers.push({
                message: '"Ask again later."',
                timeout: 2,
            });
            this.answers.push({
                message: '"Better not tell you now."',
                timeout: 3,
            });
            this.answers.push({
                message: '"Cannot predict now."',
                timeout: 4,
            });
            this.answers.push({
                message: '"Concentrate and ask again."',
                timeout: 2,
            });
            this.answers.push({
                message: `"Don't count on it."`,
                timeout: 3,
            });
            this.answers.push({
                message: '"My reply is no."',
                timeout: 4,
            });
            this.answers.push({
                message: '"My sources say no."',
                timeout: 2,
            });
            this.answers.push({
                message: '"Very doubtful."',
                timeout: 4,
            });
            this.answers.push({
                message: '"Outlook not so good."',
                timeout: 2,
            });
        });
    }
    /**
     * Get a random answer for 8Ball to say.
     *
     * @returns
     *   The answer, fetched randomly from the list of answers.
     */
    getRandomAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            // We'll use a random number for the array key.
            return this.answers[Math.floor(Math.random() * this.answers.length)];
        });
    }
    /**
     * Execute command.
     *
     * @inheritDoc
     */
    execute(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get a random answer.
            const rand = yield this.getRandomAnswer();
            // Translate the answer's message real quick.
            const answerMessage = yield Yoshida_1.Yoshida.translate(rand.message, resonance.locale);
            // Invoke Client Handlers to determine what to do in each client.
            /** @see ./handlers */
            yield this.fireClientHandlers(resonance, { answer: answerMessage, delay: rand.timeout });
        });
    }
}
exports.EightBall = EightBall;
