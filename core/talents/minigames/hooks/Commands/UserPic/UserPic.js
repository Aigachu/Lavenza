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
const Command_1 = require("../../../../../lib/Lavenza/Bot/Command/Command");
/**
 * UserPic command.
 *
 * Used to send a bigger version of a user's avatar to a discord channel.
 */
class UserPic extends Command_1.Command {
    /**
     * Execute command.
     *
     * @inheritDoc
     */
    execute(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Trim the given tag from the command.
            resonance.instruction.content = resonance.instruction.content.trim()
                .replace("<@", "")
                .replace("!", "")
                .replace(">", "");
            // Find the member in the current guild.
            const guildMember = resonance.message.guild.members.find((member) => member.id === resonance.instruction.content);
            // If a member isn't found, the input may be wrong.
            if (guildMember === null) {
                yield resonance.__reply("Hmm...Did you make a mistake? I couldn't get a pic with the input you provided... :(");
                return;
            }
            // Send the user's avatar to the channel.
            yield resonance.message.channel.send(guildMember.user.avatarURL);
        });
    }
}
exports.UserPic = UserPic;
