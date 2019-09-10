"use strict";
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
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
const Sojiro_1 = require("../../../Confidant/Sojiro");
const Morgana_1 = require("../../../Confidant/Morgana");
// Imports.
const CommandAuthorizer_1 = require("./CommandAuthorizer");
const Eminence_1 = require("../../Eminence/Eminence");
/**
 * Provides an Authorizer for commands invoked in Discord.
 */
class TwitchCommandAuthorizer extends CommandAuthorizer_1.default {
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
     * The warrant function. This function will return TRUE if the order is authorized, and FALSE otherwise.
     *
     * Twitch specific checks are performed here.
     */
    warrant() {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate that the command is allowed to be used in this Channel.
            if (!this.validateChannel()) {
                yield Morgana_1.default.warn('channel validation failed');
                return false;
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
            return this.resonance.author.username;
        });
    }
    /**
     * @inheritDoc
     */
    getAuthorEminence() {
        return __awaiter(this, void 0, void 0, function* () {
            // First, we'll check if this user's ID is found in the core configuration of the bot for this client.
            // Get the user roles configurations for the Guild where this message took place.
            let clientUserEminences = this.configurations.bot.client.userEminences;
            if (this.authorID in clientUserEminences) {
                return Eminence_1.default[clientUserEminences[this.authorID]];
            }
            // First, we'll check if this user's ID is found in the core configuration of the bot.
            // Get the user roles configurations for the Guild where this message took place.
            let channelUserEminences = this.configurations.client.channels[this.resonance.channel.id].userEminences;
            if (this.authorID in channelUserEminences) {
                return Eminence_1.default[channelUserEminences[this.authorID]];
            }
            // If nothing is found, we'll assume this user's eminence is None.
            return Eminence_1.default.None;
        });
    }
    /**
     * @inheritDoc
     */
    sendCooldownNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            // Send a whisper directly to the author.
            yield this.resonance.send(this.resonance.author, `That command is on cooldown. :) Please wait!`);
        });
    }
    /**
     * Validates that the command can be used in the Discord Channel where it was invoked.
     *
     * @returns
     *   TRUE if this authorization passes, FALSE otherwise.
     */
    validateChannel() {
        if (Sojiro_1.default.isEmpty(this.configurations.command.client.authorization.blacklist.channels)) {
            return true;
        }
        return this.configurations.command.client.authorization.blacklist.channels.includes(this.resonance.channel.id);
    }
}
exports.default = TwitchCommandAuthorizer;
