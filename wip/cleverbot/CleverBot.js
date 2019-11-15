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
const CleverBotApi = require("wip/cleverbot/CleverBot");
const Morgana_1 = require("../../core/lib/Lavenza/Confidant/Morgana");
const Talent_1 = require("../../core/lib/Lavenza/Talent/Talent");
/**
 * CleverBot Talent.
 *
 * Provide CleverBot functionality to an existing Lavenza Bot.
 */
class CleverBot extends Talent_1.Talent {
    /**
     * Initializers for CleverBot talent.
     *
     * Here, we expect to obtain a CleverBot API Key in environement variables for Bots using this talent.
     *
     * @inheritDoc
     */
    initialize(bot) {
        const _super = Object.create(null, {
            initialize: { get: () => super.initialize }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Run default initializer.
            yield _super.initialize.call(this, bot);
            // Initialize CleverBot API connection with Bot ENV.
            const cleverBotApiKey = bot.env.CLEVER_BOT_API_KEY;
            // If the token isn't found, we throw an error.
            if (cleverBotApiKey === undefined) {
                yield Morgana_1.Morgana.error("CleverBot API Key is missing for {{bot}}. An entry called CLEVER_BOT_API_KEY must be found in the bot's env file for the CleverBot Talent to work.", {
                    bot: bot.id,
                });
                return;
            }
            // Initialize variables if all is well.
            this.cleverBotApi = new CleverBotApi({ key: cleverBotApiKey });
        });
    }
}
exports.CleverBot = CleverBot;
