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
const tmi = require("tmi.js");
// Imports.
const Igor_1 = require("../../../Confidant/Igor");
const Morgana_1 = require("../../../Confidant/Morgana");
const Sojiro_1 = require("../../../Confidant/Sojiro");
const Gestalt_1 = require("../../../Gestalt/Gestalt");
const Client_1 = require("../Client");
const ClientType_1 = require("../ClientType");
const TwitchChannel_1 = require("./Entity/TwitchChannel");
const TwitchMessage_1 = require("./Entity/TwitchMessage");
const TwitchUser_1 = require("./Entity/TwitchUser");
const TwitchCommandAuthorizer_1 = require("./TwitchCommandAuthorizer");
const TwitchPrompt_1 = require("./TwitchPrompt");
const TwitchResonance_1 = require("./TwitchResonance");
/**
 * Provides a class for Twitch Clients managed in Lavenza.
 *
 * This class extends tmi.js. Much love to their work and developers!
 *
 * @see https://www.npmjs.com/package/twitch
 */
class TwitchClient extends Client_1.Client {
    /**
     * @inheritDoc
     */
    constructor(bot, config) {
        super(bot, config);
        /**
         * The type of client.
         *
         * @inheritDoc
         */
        this.type = ClientType_1.ClientType.Twitch;
    }
    /**
     * Bridge a connection to Twitch.
     *
     * We'll use TMI here!
     *
     * @inheritDoc
     */
    bridge() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connector = new tmi.Client({
                channels: this.config.channels,
                identity: {
                    password: this.bot.env.TWITCH_OAUTH_TOKEN,
                    username: this.config.username,
                },
            });
        });
    }
    /**
     * Run build tasks to prepare any necessary functions.
     *
     * Treat this as a proper constructor.
     */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            // Event: When the client connects to Twitch and is ready.
            this.connector.on("connected", () => __awaiter(this, void 0, void 0, function* () {
                // Send a message confirming our connection to Twitch.
                yield Morgana_1.Morgana.success("Twitch client successfully connected for {{bot}}!", { bot: this.bot.id });
                // We sync the client configurations.
                const channels = yield Gestalt_1.Gestalt.sync({}, `/bots/${this.bot.id}/clients/${this.type}/channels`);
                // Generate configuration for each channel.
                yield Promise.all(this.config.channels.map((channel) => __awaiter(this, void 0, void 0, function* () {
                    // For all guilds, we initialize this default configuration.
                    const baseChannelConfig = {
                        commandPrefix: this.bot.config.commandPrefix,
                        name: channel,
                        userEminences: {},
                    };
                    if (!(channel in channels)) {
                        channels[channel] = baseChannelConfig;
                    }
                    yield Gestalt_1.Gestalt.update(`/bots/${this.bot.id}/clients/${this.type}/channels`, channels);
                })));
            }));
            // Event: When the twitch client receives a message.
            this.connector.on("message", (target, context, message, self) => {
                // Ignore messages from this bot.
                if (self) {
                    return;
                }
                // Build the author information.
                const author = new TwitchUser_1.TwitchUser(context.username, context.username, context["display-name"]);
                // Build channel information.
                const channel = new TwitchChannel_1.TwitchChannel(target, target.replace("#", ""), context["message-type"]);
                // Have bot listen to this.
                this.resonate(new TwitchMessage_1.TwitchMessage(message, author, channel, context))
                    .catch(Igor_1.Igor.stop);
            });
        });
    }
    /**
     * Authenticate the client. (Connect to Twitch)
     */
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            // Simply call TMI's connect function.
            yield this.connector.connect();
        });
    }
    /**
     * Disconnect from Twitch.
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            // Simply call TMI's disconnect function.
            yield this.connector.disconnect();
            yield Morgana_1.Morgana.warn("Twitch client disconnected for {{bot}}.", { bot: this.bot.id });
        });
    }
    /**
     * Bootstrap database folders for Twitch client.
     *
     * @inheritDoc
     */
    gestalt() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize i18n contexts, creating them if they don't exist.
            // Translations are manageable through all of these contexts.
            yield Gestalt_1.Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/channels`);
            yield Gestalt_1.Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/users`);
        });
    }
    /**
     * Send help dialog through Twitch.
     *
     * @TODO - A couple of ideas here.
     *    1. Having help text be determine per command, and having the default behavior being the current behaviour.
     *    2. Making it possible to customize help text per command at will.
     *    3. Linking to online documentation whenever needed (Since Twitch and surely other clients can't format text...)
     *
     * @inheritDoc
     */
    help(command, resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            yield resonance.send(resonance.author, "Sadly, command help text is currently not available for Twitch.");
        });
    }
    /**
     * Twitch client's resonance builder.
     *
     * @inheritDoc
     */
    buildResonance(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new TwitchResonance_1.TwitchResonance(message.content, message, this.bot, this);
        });
    }
    /**
     * Twitch's prompt builder.
     *
     * @inheritDoc
     */
    buildPrompt(user, line, resonance, lifespan, onResponse, onError) {
        return __awaiter(this, void 0, void 0, function* () {
            return new TwitchPrompt_1.TwitchPrompt(user, line, resonance, lifespan, onResponse, onError, this.bot);
        });
    }
    /**
     * Twitch's Command Authorizer builder.
     *
     * @inheritDoc
     */
    buildCommandAuthorizer(command, resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            return new TwitchCommandAuthorizer_1.TwitchCommandAuthorizer(command, resonance);
        });
    }
    /**
     * Fetch a Twitch user's information.
     *
     * @inheritDoc
     */
    getUser(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                displayName: identifier,
                id: identifier,
                username: identifier,
            };
        });
    }
    /**
     * Get active Twitch configurations for this bot.
     *
     * @inheritDoc
     */
    getActiveConfigurations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Gestalt_1.Gestalt.get(`/bots/${this.bot.id}/clients/${this.type}`);
        });
    }
    /**
     * Get command prefix, taking into consideration that Twitch context.
     *
     * A custom command prefix can be set per channel.
     *
     * @inheritDoc
     */
    getCommandPrefix(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get client specific configurations.
            const clientConfig = yield this.getActiveConfigurations();
            if (resonance.message.channel && clientConfig.channels[resonance.message.channel.id]) {
                return clientConfig.channels[resonance.message.channel.id].commandPrefix || undefined;
            }
        });
    }
    /**
     * A little utility function to order the bot to type for a set amount of seconds in a given channel.
     *
     * @param seconds
     *   Amount of seconds to type for.
     * @param channel
     *   The Twitch channel to type in. Not necessary since it doesn't change anything.
     */
    typeFor(seconds, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Sojiro_1.Sojiro.wait(seconds);
        });
    }
}
exports.TwitchClient = TwitchClient;
