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
const lavenza_1 = require("lavenza");
/**
 * Ping command.
 *
 * Literally just replies with 'Pong!'.
 *
 * A great testing command.
 */
class Ping extends lavenza_1.Command {
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
            // Example of setting a property to use across the command.
            // We'll be sending this response back.
            this.responseMessage = "Pong!";
        });
    }
    /**
     * The execution of the command's actions.
     *
     * If this is a command that is available in multiple clients, you can make cases surrounding the 'type' property
     * of the resonance. A simple way to do this is to implement a switch statement on 'resonance.type'.
     *
     * Alternatively, you can adopt any design pattern you want. The Pong command has an example of an advanced pattern
     * using Factory Design principles. Check that out!
     *
     * @inheritDoc
     */
    execute(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sending a reply with the built-in reply() function in the resonance.
            // Resonances come with a shortcut function called reply() built in.
            // This will send a message back to the same context.
            // Regardless of the client it came from, this function should work. So you don't have to worry about that.
            // Also, note that we send the field we set above!
            yield resonance.reply(this.responseMessage, "::PING_RESPONSE");
            // Sending a reply with the built-in __reply() function in the resonance.
            // The __reply() function has the exact same signature as the translation function.
            // This means that it automatically handles translations.
            // We use a quick example of replacers here to avoid translating specific values or emotes.
            // In this case, you don't want to translate the author's name, or the emote either, so you use replacers!
            // On top of everything, Personalizations are built-in to the function as well. You must add a tag at the end
            yield resonance.__reply("Hi {{author}}! Here's some tea: {{tea}}", { author: resonance.author.username, tea: ":tea:" }, "::PING_RESPONSE_TEA");
            // After you're done checking out this command, check out the Pong command!
            // It has far more advanced examples of what you can do!
        });
    }
}
exports.Ping = Ping;
