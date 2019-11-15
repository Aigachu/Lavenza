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
// Modules.
const jsonic = require("jsonic");
const _ = require("underscore");
// Imports.
const ClientType_1 = require("../../../../../core/lib/Lavenza/Client/ClientType");
const Command_1 = require("../../../../../core/talents/commander/src/Command/Command");
const Igor_1 = require("../../../../../core/lib/Lavenza/Confidant/Igor");
const Sojiro_1 = require("../../../../../core/lib/Lavenza/Confidant/Sojiro");
const Gestalt_1 = require("../../../../../core/talents/gestalt/src/Service/Gestalt");
/**
 * Gestalt command used to make database queries through a client's chat.
 */
class Gestalt extends Command_1.Command {
    constructor() {
        super(...arguments);
        /**
         * Store all usable Gestalt protocols.
         */
        this.protocols = [
            "get",
            "post",
            "update",
            "delete",
        ];
    }
    /**
     * Execute command.
     *
     * @inheritDoc
     */
    execute(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // The first argument must be one of the protocols, or we don't do anything.
            if (!_.contains(this.protocols, resonance.instruction.arguments._[0])) {
                yield resonance.__reply("You need to use one of the API protocols.");
                return;
            }
            const protocol = resonance.instruction.arguments._[0];
            const endpoint = resonance.instruction.arguments._[1];
            const payload = jsonic(resonance.instruction.arguments._.slice(2)
                .join(" ")) || {};
            switch (protocol) {
                case "get": {
                    const getResult = yield Gestalt_1.Gestalt.get(endpoint);
                    if (Sojiro_1.Sojiro.isEmpty(getResult)) {
                        yield resonance.__reply("No data found for that path, sadly. :(");
                        return;
                    }
                    // If a Discord Client exists for the bot, we send a message to the Discord architect.
                    if (!Sojiro_1.Sojiro.isEmpty(yield resonance.bot.getClient(ClientType_1.ClientType.Discord))) {
                        const getResultToString = JSON.stringify(getResult, undefined, "\t");
                        yield resonance.send(resonance.bot.joker.discord, `\`\`\`\n${getResultToString}\n\`\`\``);
                    }
                    break;
                }
                case "update": {
                    const updateResult = yield Gestalt_1.Gestalt.update(endpoint, payload)
                        .catch(Igor_1.Igor.continue);
                    if (Sojiro_1.Sojiro.isEmpty(updateResult)) {
                        yield resonance.__reply("No data found at that path, sadly. :(");
                        return;
                    }
                    // If a Discord Client exists for the bot, we send a message to the Discord architect.
                    if (!Sojiro_1.Sojiro.isEmpty(yield resonance.bot.getClient(ClientType_1.ClientType.Discord))) {
                        const updateResultToString = JSON.stringify(updateResult, undefined, "\t");
                        yield resonance.send(resonance.bot.joker.discord, `\`\`\`\n${updateResultToString}\n\`\`\``);
                    }
                }
            }
        });
    }
}
exports.Gestalt = Gestalt;
