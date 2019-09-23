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
const _ = require("underscore");
const jsonic = require("jsonic");
// Imports.
const Gestalt_1 = require("../../../../../lib/Lavenza/Gestalt/Gestalt");
const Command_1 = require("../../../../../lib/Lavenza/Bot/Command/Command");
const Sojiro_1 = require("../../../../../lib/Lavenza/Confidant/Sojiro");
const ClientType_1 = require("../../../../../lib/Lavenza/Bot/Client/ClientType");
const Igor_1 = require("../../../../../lib/Lavenza/Confidant/Igor");
/**
 * Hello command.
 *
 * Literally just replies with 'Hello!'.
 *
 * A great testing command.
 */
class Gestalt extends Command_1.default {
    constructor() {
        super(...arguments);
        // Store the Gestalt protocols.
        this.protocols = [
            'get',
            'post',
            'update',
            'delete'
        ];
    }
    /**
     * @inheritDoc
     */
    build(config, talent) {
        const _super = Object.create(null, {
            build: { get: () => super.build }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Run the parent build function. Must always be done.
            yield _super.build.call(this, config, talent);
        });
    }
    /**
     * @inheritDoc
     */
    execute(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // The first argument must be one of the protocols, or we don't do anything.
            if (!_.contains(this.protocols, resonance.instruction.arguments._[0])) {
                yield resonance.__reply('You need to use one of the API protocols.');
                return;
            }
            let protocol = resonance.instruction.arguments._[0];
            let endpoint = resonance.instruction.arguments._[1];
            let payload = jsonic(resonance.instruction.arguments._.slice(2).join(' ')) || {};
            switch (protocol) {
                case 'get': {
                    let getResult = yield Gestalt_1.default.get(endpoint);
                    if (Sojiro_1.default.isEmpty(getResult)) {
                        yield resonance.__reply('No data found for that path, sadly. :(');
                        return;
                    }
                    // If a Discord Client exists for the bot, we send a message to the Discord architect.
                    console.log(yield resonance.bot.getClient(ClientType_1.default.Discord));
                    if (!Sojiro_1.default.isEmpty(yield resonance.bot.getClient(ClientType_1.default.Discord))) {
                        let getResultToString = JSON.stringify(getResult, null, '\t');
                        yield resonance.send(resonance.bot.joker.discord, '```\n' + getResultToString + '\n```');
                    }
                    break;
                }
                case 'update': {
                    let updateResult = yield Gestalt_1.default.update(endpoint, payload).catch(Igor_1.default.continue);
                    if (Sojiro_1.default.isEmpty(updateResult)) {
                        yield resonance.__reply('No data found at that path, sadly. :(');
                        return;
                    }
                    // If a Discord Client exists for the bot, we send a message to the Discord architect.
                    if (!Sojiro_1.default.isEmpty(resonance.bot.getClient(ClientType_1.default.Discord))) {
                        let updateResultToString = JSON.stringify(updateResult, null, '\t');
                        yield resonance.send(resonance.bot.joker.discord, '```\n' + updateResultToString + '\n```');
                    }
                    break;
                }
            }
        });
    }
}
exports.default = Gestalt;
