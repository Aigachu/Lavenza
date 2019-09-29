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
const Kawakami_1 = require("../../../../../lib/Lavenza/Confidant/Kawakami");
const Sojiro_1 = require("../../../../../lib/Lavenza/Confidant/Sojiro");
const Gestalt_1 = require("../../../../../lib/Lavenza/Gestalt/Gestalt");
/**
 * Command Prefix command.
 *
 * Use this command to adjust the command prefix on the fly.
 *
 * @TODO - This needs to update client specific configurations as well.
 */
class CPrefix extends Command_1.Command {
    /**
     * Execute command.
     *
     * @inheritDoc
     */
    execute(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the arguments.
            const args = yield resonance.getArguments();
            // Manage the 's' option.
            if ("s" in args) {
                // If the value is empty, we should get out.
                if (Sojiro_1.Sojiro.isEmpty(args.s)) {
                    return;
                }
                // Get the current cprefix.
                const currentConfig = yield Gestalt_1.Gestalt.get(`/bots/${resonance.bot.id}/config/core`);
                const currentPrefix = currentConfig.commandPrefix;
                // Update the cprefix.
                yield Gestalt_1.Gestalt.update(`/bots/${resonance.bot.id}/config/core`, { commandPrefix: args.s });
                // Send a confirmation.
                yield resonance.__reply("I've updated the command prefix from {{oldPrefix}} to {{newPrefix}}.", {
                    newPrefix: yield Kawakami_1.Kawakami.bold(args.s),
                    oldPrefix: yield Kawakami_1.Kawakami.bold(currentPrefix),
                });
            }
        });
    }
}
exports.CPrefix = CPrefix;
