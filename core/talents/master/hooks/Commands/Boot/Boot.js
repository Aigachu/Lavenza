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
const Sojiro_1 = require("../../../../../lib/Lavenza/Confidant/Sojiro");
const BotManager_1 = require("../../../../../lib/Lavenza/Bot/BotManager");
const Command_1 = require("../../../../../lib/Lavenza/Bot/Command/Command");
/**
 * Boot Command.
 *
 * Handles the 'boot' command, allowing a bot to boot other bots in the system.
 */
class Boot extends Command_1.default {
    /**
     * @inheritDoc
     */
    build(config, talent) {
        const _super = Object.create(null, {
            build: { get: () => super.build }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // The build function must always run the parent's build function! Don't remove this line.
            yield _super.build.call(this, config, talent);
        });
    }
    /**
     * @inheritDoc
     */
    execute(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // The raw content here should be the ID of the bot we want to activate.
            let botToBoot = resonance.instruction.content;
            // Now we should check if the bot exists.
            if (Sojiro_1.default.isEmpty(BotManager_1.default.bots[botToBoot])) {
                yield resonance.__reply(`Hmm...That bot doesn't seem to exist in the codebase. Did you make a typo? Make sure to enter the exact ID of the bot for this to work.`);
                return;
            }
            // If all is good, we can go ahead and boot the bot.
            yield resonance.__reply(`Initializing boot process for {{bot}}. They should be active shortly!`, { bot: botToBoot });
            yield BotManager_1.default.boot(botToBoot);
        });
    }
}
exports.default = Boot;
