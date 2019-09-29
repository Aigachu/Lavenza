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
const Listener_1 = require("../../Listener/Listener");
const CommandInterpreter_1 = require("../CommandInterpreter/CommandInterpreter");
/**
 * Provides a Listener that listens for commands when messages are heard by a Bot.
 *
 * The CommandListener will handle the determination of whether a received Resonance contains a command or not.
 *
 * All the logic for commands starts here.
 */
class CommandListener extends Listener_1.Listener {
    /**
     * Listen to a resonance and act upon it.
     *
     * @inheritDoc
     */
    listen(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Use the CommandInterpreter to find out if there's a command in the resonance.
            // If there's a command, the interpreter will return an instruction that will be assigned to the Resonance we heard.
            yield CommandInterpreter_1.CommandInterpreter.interpret(resonance);
            // If there is no instruction, we do nothing after all.
            if (!resonance.instruction) {
                return;
            }
            // If the help option is used, we fire the help function of the command and return.
            const args = yield resonance.getArguments();
            if (args._.includes("help") || "help" in args) {
                resonance.executeHelp()
                    .then(() => {
                    // Do nothing.
                });
                return;
            }
            // Now that we know a command has been found, we need to pass it through the right Authorizer.
            // We use a factory to build an appropriate authorizer.
            const authorized = yield resonance.client.authorize(yield resonance.getCommand(), resonance);
            if (!authorized) {
                return;
            }
            // If a command was found and authorized, execute it.
            resonance.executeCommand()
                .then(() => {
                // Do nothing.
            });
        });
    }
}
exports.CommandListener = CommandListener;
