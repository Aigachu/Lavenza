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
const minimist = require("minimist");
const Morgana_1 = require("../../../Confidant/Morgana");
/**
 * Provides an Interpreter for Commands.
 *
 * This class will determine if a command has been heard by the Bot. It takes a resonance and analyzes it accordingly.
 */
class CommandInterpreter {
    /**
     * Interpret a Resonance, attempting to find a command in the raw content.
     *
     * @param resonance
     *   The Resonance that will be interpreted.
     */
    static interpret(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch an instruction if we can.
            let instruction = yield this.getInstruction(resonance);
            // Set the instruction to the Resonance.
            // If an instruction wasn't found, undefined will be set here, which shouldn't be a problem!
            yield resonance.setInstruction(instruction);
        });
    }
    /**
     * Get an Instruction from a message.
     *
     * The checks and analysis will determine if a command exists in the resonance.
     *
     * @param resonance
     *   The resonance received from the listener.
     *
     * @returns
     *   Returns an Instruction will all relevant information about the command in it.
     */
    static getInstruction(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize some variables.
            let content = resonance.content;
            let bot = resonance.bot;
            let client = resonance.client;
            // Split content with spaces.
            // i.e. If the input is '! ping hello', then we get ['!', 'ping', 'hello'].
            let splitContent = content.split(' ');
            // Get the active bot configuration from the database.
            let botConfig = yield bot.getActiveConfig();
            // Get command prefix.
            // If there is a command prefix override for this client, we will set it. If not, we grab the default.
            let cprefix = yield bot.getCommandPrefix(resonance);
            // If the content doesn't start with the command prefix or the bot tag, it's not a command.
            // @todo - In Discord, we want to be able to tag the bot. Maybe in other clients too. But for now we'll keep it simple.
            if (!splitContent[0].startsWith(cprefix)) {
                return undefined;
            }
            // At this point we know it's potentially a command. We'll need to find out which command was called.
            // First, we'll format the string accordingly if needed.
            // If a user enters a command attached to the prefix, we separate them here.
            if (splitContent[0].length !== cprefix.length) {
                splitContent = content.replace(cprefix, cprefix + ' ').split(' ');
            }
            // Attempt to fetch the command from the bot.
            let command = yield bot.getCommand(splitContent[1].toLowerCase());
            // If the command doesn't exist, we'll stop here.
            if (!command) {
                yield Morgana_1.default.warn('No command found in message...');
                return undefined;
            }
            // Now we do one final check to see if this command is allowed to be used in this client.
            // We check the command configuration for this.
            if (!command.allowedInClient(client.type)) {
                yield Morgana_1.default.warn('Command found, but not allowed in client. Returning.');
                return undefined;
            }
            // Next, we'll build the arguments as well, using minimist.
            let args = minimist(splitContent.slice(2));
            // Get the command configuration and build the configuration object for this order.
            // We want to send the bot config and the command config back with the Order.
            let commandConfig = yield command.getActiveConfigForBot(bot);
            let config = {
                bot: botConfig,
                command: commandConfig
            };
            // Return our crafted Order.
            return {
                command: command,
                arguments: args,
                content: splitContent.slice(2).join(' ')
            };
        });
    }
}
exports.default = CommandInterpreter;
