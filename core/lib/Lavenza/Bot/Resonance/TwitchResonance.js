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
const Resonance_1 = require("./Resonance");
const TwitchUser_1 = require("../Client/TwitchClient/TwitchUser");
const TwitchChannel_1 = require("../Client/TwitchClient/TwitchChannel");
const Gestalt_1 = require("../../Gestalt/Gestalt");
const Igor_1 = require("../../Confidant/Igor");
const Sojiro_1 = require("../../Confidant/Sojiro");
/**
 * Provides specific Resonance properties for messages coming from Discord.
 */
class TwitchResonance extends Resonance_1.Resonance {
    /**
     * DiscordResonance constructor.
     * @inheritDoc
     */
    constructor(content, message, bot, client) {
        // Run parent constructor.
        super(content, message, bot, client);
        // For Twitch, we'll set some useful information to the class.
        this.author = message.author;
        this.channel = message.channel;
    }
    /**
     * Resolve language to translate content to for this resonance.
     *
     * In Discord, there are three ways to configure the language:
     *  - Guild (Server) Locale - Setting a language per guild.
     *  - Channel Locale - Setting a language per channel.
     *  - User - Setting a language per user.
     *
     * Here, we want to query Gestalt to check if configurations are set for this resonance's environment.
     *
     * If no configurations are set, we simply take the default language set for the bot.
     *
     * @inheritDoc
     */
    getLocale() {
        return __awaiter(this, void 0, void 0, function* () {
            // First, we check if configurations exist for this user.
            let i18nUserConfig = yield Gestalt_1.Gestalt.get(`/i18n/${this.bot.id}/clients/twitch/users`).catch(Igor_1.Igor.stop);
            // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
            if (i18nUserConfig[this.author.id] && i18nUserConfig[this.author.id].locale && i18nUserConfig[this.author.id].locale !== 'default') {
                return i18nUserConfig[this.author.id].locale;
            }
            // Second, we check if configurations exist for this channel.
            let i18nChannelConfig = yield Gestalt_1.Gestalt.get(`/i18n/${this.bot.id}/clients/twitch/channels`).catch(Igor_1.Igor.stop);
            // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
            if (i18nChannelConfig[this.author.id] && i18nChannelConfig[this.author.id].locale && i18nChannelConfig[this.author.id].locale !== 'default') {
                return i18nChannelConfig[this.channel.id].locale;
            }
            // Return the parameters.
            let config = yield this.bot.getActiveConfig();
            return config.locale;
        });
    }
    /**
     * Send a message to a destination in Discord.
     *
     * @inheritDoc
     */
    doSend(bot, destination, content) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the destination is a channel, and it's a private whisper channel, we use TMI's whisper function instead.
            if (destination instanceof TwitchChannel_1.TwitchChannel && destination.type === 'whisper') {
                return yield this.client.whisper(destination.id, content);
            }
            // If the destination is a user, then we send a whisper as well.
            if (destination instanceof TwitchUser_1.TwitchUser) {
                return yield this.client.whisper(destination.username, content);
            }
            // If the destination is a string and doesn't start with '#', we send it through a whisper.
            if (typeof destination === 'string' && !destination.startsWith('#')) {
                return yield this.client.whisper(destination, content);
            }
            // If the destination is a string and starts with '#', we send it to the channel.
            if (typeof destination === 'string' && !destination.startsWith('#')) {
                return yield this.client.say(destination, content);
            }
            // Otherwise, we just send it to the destination, assuming it's simply the name of a channel.
            return yield this.client.say(destination.id, content);
        });
    }
    /**
     * Emulate the bot typing for a given amount of seconds.
     *
     * In the case of Twitch, we simply wait for the amount of seconds, as Twitch doesn't have typing notifiers.
     *
     * @inheritDoc
     */
    typeFor(seconds, destination = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            return Sojiro_1.Sojiro.wait(seconds);
        });
    }
    /**
     * Get origin of the resonance.
     *
     * In the case of Discord, we get the channel the message originates from.
     *
     * @inheritDoc
     */
    resolveOrigin() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.message.channel;
        });
    }
    /**
     * Get privacy of the resonance.
     *
     * In the case of Twitch, we get the type of message that was sent.
     *
     * @inheritDoc
     */
    resolvePrivacy() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.message.channel.type === "whisper" ? 'private' : 'public';
        });
    }
}
exports.TwitchResonance = TwitchResonance;
