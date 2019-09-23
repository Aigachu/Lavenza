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
// const TMIClient = require('tmi.js').Client;
const TwitchUser_1 = require("./TwitchUser");
const TwitchChannel_1 = require("./TwitchChannel");
const ClientType_1 = require("../ClientType");
const Morgana_1 = require("../../../Confidant/Morgana");
const Igor_1 = require("../../../Confidant/Igor");
const Gestalt_1 = require("../../../Gestalt/Gestalt");
const Sojiro_1 = require("../../../Confidant/Sojiro");
// Manually require TMI Client since it doesn't work with imports.
const TMIClient = require('tmi.js').client;
/**
 * Provides a class for Twitch Clients managed in Lavenza.
 *
 * This class extends tmi.js. Much love to their work and developers!
 *
 * @see https://www.npmjs.com/package/twitch
 */
class TwitchClient extends TMIClient {
    /**
     * TwitchClient constructor.
     *
     * @param config
     *   Configuration object to create the client with, fetched from the bot's configuration file.
     * @param bot
     *   Bot that this client is linked to.
     */
    constructor(config, bot) {
        // Call the constructor of the Discord Client parent Class.
        super({
            identity: {
                username: config.username,
                password: bot.env.TWITCH_OAUTH_TOKEN,
            },
            channels: config.channels
        });
        /**
         * @inheritDoc
         */
        this.type = ClientType_1.default.Twitch;
        // Assign the bot to the current client.
        this.bot = bot;
        // Assign configurations to the client.
        this.config = config;
        // Event: When the client connects to Twitch and is ready.
        this.on('connected', () => __awaiter(this, void 0, void 0, function* () {
            // Send a message confirming our connection to Twitch.
            yield Morgana_1.default.success('Twitch client successfully connected for {{bot}}!', { bot: this.bot.id });
            // We sync the client configurations.
            let channels = yield Gestalt_1.default.sync({}, `/bots/${this.bot.id}/clients/${this.type}/channels`);
            // Generate configuration for each channel.
            yield Promise.all(this.config.channels.map((channel) => __awaiter(this, void 0, void 0, function* () {
                // For all guilds, we initialize this default configuration.
                let baseChannelConfig = {
                    name: channel,
                    commandPrefix: this.bot.config.commandPrefix,
                    userEminences: {},
                };
                if (!(channel in channels)) {
                    channels[channel] = baseChannelConfig;
                }
                yield Gestalt_1.default.update(`/bots/${this.bot.id}/clients/${this.type}/channels`, channels);
            })));
        }));
        // Event: When the twitch client receives a message.
        this.on('message', (target, context, message, self) => {
            // Ignore messages from this bot.
            if (self) {
                return;
            }
            // Relevant information will be built and stored like so.
            // It is built to be organized like Discord.JS organizes it. Seems to be our best bet to keep things clean!
            let msgData = {
                author: new TwitchUser_1.default(context['username'], context['username'], context['display-name']),
                content: message,
                context: context,
                channel: new TwitchChannel_1.default(target, target.replace('#', ''), context['message-type'])
            };
            this.bot.listen(msgData, this).catch(Igor_1.default.stop);
        });
    }
    /**
     * @inheritDoc
     */
    getActiveConfigurations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Gestalt_1.default.get(`/bots/${this.bot.id}/clients/${this.type}`);
        });
    }
    /**
     * @inheritDoc
     */
    gestalt() {
        return __awaiter(this, void 0, void 0, function* () {
            // Make sure database collection exists for this client for the given bot.
            yield Gestalt_1.default.createCollection(`/bots/${this.bot.id}/clients/${this.type}`);
            // Make sure database collection exists for permissions in this client.
            yield Gestalt_1.default.createCollection(`/bots/${this.bot.id}/clients/${this.type}`);
            // Initialize i18n database collection for this client if it doesn't already exist.
            yield Gestalt_1.default.createCollection(`/i18n/${this.bot.id}/clients/${this.type}`);
            // Initialize i18n contexts, creating them if they don't exist.
            // Translations are manageable through all of these contexts.
            yield Gestalt_1.default.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/channels`);
            yield Gestalt_1.default.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/users`);
        });
    }
    /**
     * Authenticate the client. (Connect to Twitch)
     */
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            // Simply call TMI's connect function.
            yield this.connect();
        });
    }
    /**
     * Disconnect from Twitch.
     */
    disconnect() {
        const _super = Object.create(null, {
            disconnect: { get: () => super.disconnect }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Simply call TMI's disconnect function.
            yield _super.disconnect.call(this);
            yield Morgana_1.default.warn('Twitch client disconnected for {{bot}}.', { bot: this.bot.id });
        });
    }
    /**
     * A little utility function to order the bot to type for a set amount of seconds in a given channel.
     *
     * @TODO - Do something about that dumb 'method can be static' message.
     *
     * @param seconds
     *   Amount of seconds to type for.
     * @param channel
     *   The Twitch channel to type in.
     */
    typeFor(seconds, channel = null) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Sojiro_1.default.wait(seconds);
        });
    }
}
exports.default = TwitchClient;
