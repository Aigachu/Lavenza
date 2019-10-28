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
const Gestalt_1 = require("../../../../../lib/Lavenza/Gestalt/Gestalt");
/**
 * Locale command.
 */
class Locale extends Command_1.Command {
    /**
     * Execute command.
     *
     * @inheritDoc
     */
    execute(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the arguments.
            const args = yield resonance.getArguments();
            // If "set" is the first argument, we allow the user to set locale settings for themselves.
            // @TODO - This will be much more intricate later on!
            if (args._[0] === "set") {
                const locale = args._[1];
                // Use Gestalt to make the modification.
                const payload = {};
                payload[`${resonance.author.id}`] = { locale };
                yield Gestalt_1.Gestalt.update(`/i18n/${resonance.bot.id}/clients/${resonance.client.type}/users`, payload);
                // Send a reply.
                yield resonance.__reply("I've modified your locale settings! From now on, I will answer you in this language when I can. You can change this setting at any time.", locale);
            }
        });
    }
}
exports.Locale = Locale;
