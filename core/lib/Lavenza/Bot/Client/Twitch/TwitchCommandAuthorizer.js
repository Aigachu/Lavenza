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
const Morgana_1 = require("../../../Confidant/Morgana");
const Sojiro_1 = require("../../../Confidant/Sojiro");
const CommandAuthorizer_1 = require("../../Command/CommandAuthorizer/CommandAuthorizer");
const Eminence_1 = require("../../Eminence/Eminence");
/**
 * Provides an Authorizer for commands invoked in Discord.
 */
class TwitchCommandAuthorizer extends CommandAuthorizer_1.CommandAuthorizer {
    /**
     * @inheritDoc
     */
    constructor(command, resonance) {
        super(command, resonance);
    }
    /**
     * The warrant function. This function will return TRUE if the order is authorized, and FALSE otherwise.
     *
     * Twitch specific checks are performed here.
     */
    warrant() {
        return __awaiter(this, void 0, void 0, function* () {
            // If the message is not a direct message, we assume it is in a server and do additional validations.
            const messageIsPrivate = yield this.resonance.isPrivate();
            if (!messageIsPrivate) {
                // Validate that the command is allowed to be used in this Channel.
                const channelValidation = yield this.validateChannel();
                if (!channelValidation) {
                    yield Morgana_1.Morgana.warn("twitch channel validation failed");
                    return false;
                }
            }
            // If all those checks pass through, we can authorize the command.
            return true;
        });
    }
    /**
     * Get Twitch user unique identification.
     *
     * In this case it's simply the username of the user.
     *
     * @inheritDoc
     */
    getAuthorIdentification() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resonance.author.username;
        });
    }
    /**
     * Get Author Eminence in Twitch context.
     *
     * @inheritDoc
     *
     * @TODO - Explore some cool stuff to do with Twitch Roles. i.e. Twitch Chat Statuses (VIP, Mod) determining Eminence.
     */
    getAuthorEminence() {
        return __awaiter(this, void 0, void 0, function* () {
            // First, we'll check if this user's ID is found in the core configuration of the bot for this client.
            // Get the user roles configurations for the Guild where this message took place.
            const clientUserEminences = this.configurations.bot.client.userEminences;
            if (this.authorID in clientUserEminences) {
                return Eminence_1.Eminence[clientUserEminences[this.authorID]];
            }
            // First, we'll check if this user's ID is found in the core configuration of the bot.
            // Get the user roles configurations for the Guild where this message took place.
            const channelUserEminences = this.configurations.client.channels[this.resonance.channel.id].userEminences;
            if (this.authorID in channelUserEminences) {
                return Eminence_1.Eminence[channelUserEminences[this.authorID]];
            }
            // If nothing is found, we'll assume this user's eminence is None.
            return Eminence_1.Eminence.None;
        });
    }
    /**
     * Send cooldown notification in twitch.
     *
     * In Twitch, we send a whisper to the person in question.
     *
     * @inheritDoc
     */
    sendCooldownNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            // Send a whisper directly to the author.
            yield this.resonance.send(this.resonance.author, "That command is on cooldown. :) Please wait!");
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
exports.TwitchCommandAuthorizer = TwitchCommandAuthorizer;
