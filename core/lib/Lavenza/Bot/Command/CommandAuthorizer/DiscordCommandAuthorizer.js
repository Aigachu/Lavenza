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
const CommandAuthorizer_1 = require("./CommandAuthorizer");
const Sojiro_1 = require("../../../Confidant/Sojiro");
const Morgana_1 = require("../../../Confidant/Morgana");
const Igor_1 = require("../../../Confidant/Igor");
const Eminence_1 = require("../../Eminence/Eminence");
/**
 * Provides an Authorizer for commands invoked in Discord.
 */
class DiscordCommandAuthorizer extends CommandAuthorizer_1.CommandAuthorizer {
    /**
     * Since authorizers are static classes, we'll have a build function to make preparations.
     */
    build(resonance) {
        const _super = Object.create(null, {
            build: { get: () => super.build }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Run parent build function.
            yield _super.build.call(this, resonance);
        });
    }
    /**
     * The warrant function. This function will return TRUE if the command is authorized, and FALSE otherwise.
     *
     * Discord specific checks are performed here.
     */
    warrant() {
        return __awaiter(this, void 0, void 0, function* () {
            // If the message is not a direct message, we assume it is in a server and do additional validations.
            let messageIsPrivate = yield this.resonance.isPrivate();
            if (!messageIsPrivate) {
                // Validate that the command is allowed to be used in this Guild (Server).
                let guildValidation = yield this.validateGuild();
                if (!guildValidation) {
                    yield Morgana_1.Morgana.warn('discord guild validation failed');
                    return false;
                }
                // Validate that the command is allowed to be used in this Channel.
                let channelValidation = yield this.validateChannel();
                if (!channelValidation) {
                    yield Morgana_1.Morgana.warn('discord channel validation failed');
                    return false;
                }
            }
            // If all those checks pass through, we can authorize the command.
            return true;
        });
    }
    /**
     * @inheritDoc
     */
    getAuthorIdentification() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resonance.author.id;
        });
    }
    /**
     * @inheritDoc
     * @TODO - Explore some cool stuff to do with Discord Roles.
     */
    getAuthorEminence() {
        return __awaiter(this, void 0, void 0, function* () {
            // First, we'll check if this user's ID is found in the core configuration of the bot for this client.
            // Get the user roles configurations for the Guild where this message took place.
            let clientUserEminences = this.configurations.bot.client.userEminences;
            if (clientUserEminences && clientUserEminences[this.authorID]) {
                return Eminence_1.Eminence[clientUserEminences[this.authorID]];
            }
            // If the user's ID is not found in the prior config, we'll search the client specific configurations.
            let guildUserEminences = this.configurations.client.guilds[this.resonance.guild.id].userEminences;
            if (guildUserEminences && guildUserEminences[this.authorID]) {
                return Eminence_1.Eminence[guildUserEminences[this.authorID]];
            }
            // If nothing is found, we'll assume this user's eminence is None.
            return Eminence_1.Eminence.None;
        });
    }
    /**
     * @inheritDoc
     */
    sendCooldownNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            // Send a reply alerting the user that the command is on cooldown.
            this.resonance.reply(`That command is on cooldown. :) Please wait!`).then((message) => __awaiter(this, void 0, void 0, function* () {
                // Delete the message containing the command.
                this.resonance.message.delete().catch(Igor_1.Igor.continue);
                // After 5 seconds, delete the reply originally sent.
                yield Sojiro_1.Sojiro.wait(5);
                yield message.delete().catch(Igor_1.Igor.continue);
            }));
        });
    }
    /**
     * Validates that the command can be used in the Discord Guild (Server) where it was invoked.
     *
     * @returns
     *   TRUE if this authorization passes, FALSE otherwise.
     */
    validateGuild() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Sojiro_1.Sojiro.isEmpty(this.configurations.command.client.authorization.blacklist.guilds)) {
                return true;
            }
            return this.configurations.command.client.authorization.blacklist.guilds.includes(this.resonance.guild.id);
        });
    }
    /**
     * Validates that the command can be used in the Discord Channel where it was invoked.
     *
     * @returns
     *   TRUE if this authorization passes, FALSE otherwise.
     */
    validateChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Sojiro_1.Sojiro.isEmpty(this.configurations.command.client.authorization.blacklist.channels)) {
                return true;
            }
            return this.configurations.command.client.authorization.blacklist.channels.includes(this.resonance.channel.id);
        });
    }
}
exports.DiscordCommandAuthorizer = DiscordCommandAuthorizer;
