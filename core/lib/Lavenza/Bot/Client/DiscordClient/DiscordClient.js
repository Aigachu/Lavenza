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
const discord_js_1 = require("discord.js");
const ClientType_1 = require("../ClientType");
const Morgana_1 = require("../../../Confidant/Morgana");
const Igor_1 = require("../../../Confidant/Igor");
const Sojiro_1 = require("../../../Confidant/Sojiro");
const Gestalt_1 = require("../../../Gestalt/Gestalt");
/**
 * Provides a class for Discord Clients managed in Lavenza.
 *
 * This class extends hydrabolt's wonderful discord.js package. Couldn't do this
 * without em. Much love!
 *
 * @see https://discord.js.org/#/
 */
class DiscordClient extends discord_js_1.Client {
    /**
     * DiscordClient constructor.
     *
     * @param config
     *   Configuration object to create the client with, fetched from the bot's configuration file.
     * @param bot
     *   Bot that this client is linked to.
     */
    constructor(config, bot) {
        // Call the constructor of the Discord Client parent Class.
        super();
        /**
         * @inheritDoc
         */
        this.type = ClientType_1.ClientType.Discord;
        // Assign the bot to the current client.
        this.bot = bot;
        // Assign configurations to the client.
        this.config = config;
        // Event: When the client connects to Discord and is ready.
        this.on('ready', () => __awaiter(this, void 0, void 0, function* () {
            yield Morgana_1.Morgana.success('Discord client successfully connected for {{bot}}!', { bot: this.bot.id });
            // We start by syncing the guild configurations.
            let guilds = yield Gestalt_1.Gestalt.sync({}, `/bots/${this.bot.id}/clients/${this.type}/guilds`);
            // Set up initial guild configurations.
            yield Promise.all(this.guilds.map((guild) => __awaiter(this, void 0, void 0, function* () {
                let baseGuildConfig = {
                    name: guild.name,
                    commandPrefix: yield this.bot.config.commandPrefix,
                    userEminences: {},
                };
                if (!(guild.id in guilds)) {
                    guilds[guild.id] = baseGuildConfig;
                }
                yield Gestalt_1.Gestalt.update(`/bots/${this.bot.id}/clients/${this.type}/guilds`, guilds);
            })));
            // Set game text.
            this.user.setActivity(this.config['activity']).catch(console.error);
        }));
        // Event: When the discord client receives a message.
        this.on('message', (message) => {
            // We ignore messages from any bot.
            if (message.author.bot === true) {
                return;
            }
            this.bot.listen(message, this).catch(Igor_1.Igor.stop);
        });
        // Event: When the clients disconnects from Discord.
        this.on('disconnected', () => __awaiter(this, void 0, void 0, function* () {
            yield Morgana_1.Morgana.status('Discord client for {{bot}} has disconnected.', { bot: this.bot.id });
        }));
        // Event: When the clients disconnects from Discord.
        this.on('error', () => __awaiter(this, void 0, void 0, function* () {
            yield Morgana_1.Morgana.error("Error has occurred for {{bot}}'s client...", { bot: this.bot.id });
        }));
    }
    /**
     * @inheritDoc
     */
    getActiveConfigurations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Gestalt_1.Gestalt.get(`/bots/${this.bot.id}/clients/${this.type}`);
        });
    }
    /**
     * @inheritDoc
     */
    gestalt() {
        return __awaiter(this, void 0, void 0, function* () {
            // Make sure database collection exists for this client for the given bot.
            yield Gestalt_1.Gestalt.createCollection(`/bots/${this.bot.id}/clients/${this.type}`);
            // Make sure database collection exists for this client's general database.
            yield Gestalt_1.Gestalt.createCollection(`/bots/${this.bot.id}/clients/${this.type}`);
            // Initialize i18n database collection for this client if it doesn't already exist.
            yield Gestalt_1.Gestalt.createCollection(`/i18n/${this.bot.id}/clients/${this.type}`);
            // Initialize i18n contexts, creating them if they don't exist.
            // Translations are manageable through all of these contexts.
            yield Gestalt_1.Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/guilds`);
            yield Gestalt_1.Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/channels`);
            yield Gestalt_1.Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/users`);
        });
    }
    // noinspection JSMethodCanBeStatic
    /**
     * A little utility function to order the bot to type for a set amount of seconds in a given channel.
     *
     * @TODO - Do something about that dumb 'method can be static' message.
     *
     * @param seconds
     *   Amount of seconds to type for.
     * @param channel
     *   The Discord channel to type in.
     */
    typeFor(seconds, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            yield channel.stopTyping();
            yield channel.startTyping(1);
            yield Sojiro_1.Sojiro.wait(seconds);
            yield channel.stopTyping();
        });
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Send a cute error message to a destination.
     *
     * @param destination
     *   Destination, normally a channel or a user.
     * @param {string} text
     *   Message of the error.
     * @param {string} type
     *   Type of error. Can be warning, status or error.
     * @param {int} code
     *   Error code.
     *
     * @returns
     *   The message that was sent as an error.
     */
    sendError(destination, { text = '', type = '', code = 404 } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize some variables.
            let message = '';
            let color = '';
            let image = null;
            // Determine code.
            switch (code) {
                case 401:
                    message = 'Unauthorized.';
                    break;
                default:
                    message = 'An error has occurred.';
                    break;
            }
            // Determine color.
            switch (type) {
                case 'warning':
                    color = '0xf4d742';
                    image = {
                        attachment: new discord_js_1.Attachment('./core/assets/warning.png', 'warning.png'),
                        name: 'warning.png'
                    };
                    break;
                default:
                    color = '0xa5201d';
                    image = {
                        attachment: new discord_js_1.Attachment('./core/assets/error.png', 'error.png'),
                        name: 'error.png'
                    };
                    break;
            }
            // Send the embed.
            return yield this.sendEmbed(destination, {
                description: text,
                header: {
                    text: `${code}: ${message}`,
                    icon: `attachment://${image.name}`
                },
                color: color,
                timestamp: true,
                attachments: [
                    image.attachment
                ],
            });
        });
    }
    /**
     * Send a embed to a channel.
     *
     * @see https://leovoel.github.io/embed-visualizer/
     *
     * @param destination
     *   The destination can be a channel or a user.
     * @param {string} title
     *   The title of the rich embed.
     * @param {string} description
     *   The description of the rich embed.
     * @param {Object} header
     *   Object that should contain the *text* of the header and the *icon* if applicable.
     * @param {string} url
     *   URL of the rich embed.
     * @param {string} color
     *   Color of the left border of the rich embed.
     * @param {string} image
     *   Main image of the rich embed. Usually an attachment reference.
     * @param {string} thumbnail
     *   Main thumbnail of the rich embed. Usually an attachment reference.
     * @param {Array} fields
     *   Fields of the rich embed.
     * @param {Object} footer
     *   Object that should contain the *text* of the footer and the *icon* if applicable.
     * @param {Array<Attachment>} attachments
     *   Array of attachments to attach to the embed.
     * @param {Boolean} timestamp
     *   Controls whether or not we want to add a timestamp of the current time.
     *
     * @returns
     *   The message that was sent as an embed.
     */
    sendEmbed(destination, { title = '', description = '', header = {}, url = '', color = '', image = '', thumbnail = '', fields = [], footer = {}, attachments = [], timestamp = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the embed instance.
            let embed = new discord_js_1.RichEmbed();
            // Manage default values.
            color = color || '0x1C1CF0';
            // Set default values.
            embed.setColor(color);
            // If timestamp is set to true, set it.
            if (timestamp) {
                embed.setTimestamp(new Date());
            }
            // Set Title if any.
            if (title) {
                embed.setTitle(title);
            }
            // Set Description if any.
            if (description) {
                embed.setDescription(description);
            }
            // Set Header/Author if any.
            if (header) {
                embed.setAuthor(header['text'], header['icon']);
            }
            // Set Footer if any.
            if (footer) {
                embed.setFooter(footer['text'], footer['icon']);
            }
            // Set Thumbnail if any.
            if (thumbnail) {
                embed.setThumbnail(thumbnail);
            }
            // Set Image if any.
            if (image) {
                embed.setImage(image);
            }
            // Set fields, if any.
            if (fields) {
                fields.every(field => {
                    embed.addField(field.name, field.text);
                    return true;
                });
            }
            // Set attachments, if any.
            if (attachments) {
                embed.attachFiles(attachments);
            }
            // If url is set, we set it here.
            if (url) {
                embed.setURL(url);
            }
            // Send the embed.
            return yield destination.send(embed);
        });
    }
    /**
     * Authenticate the client. (Login to Discord)
     *
     * @inheritDoc
     */
    authenticate() {
        const _super = Object.create(null, {
            login: { get: () => super.login }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Get the token.
            let token = this.bot.env.DISCORD_TOKEN;
            // If the token isn't found, we throw an error.
            if (token === undefined) {
                yield Igor_1.Igor.throw(`Discord application token is missing for {{bot}}. Make sure the token is set in the .env file in the bot's folder. See the example bot folder for more details.`, { bot: this.bot.id });
            }
            // Await the login in of this client.
            yield _super.login.call(this, token).catch(() => __awaiter(this, void 0, void 0, function* () {
                yield Igor_1.Igor.throw('Failed to authenticate Discord client for {{bot}}.', { bot: this.bot.id });
            }));
        });
    }
    /**
     * Disconnect from Discord.
     *
     * @inheritDoc
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            // Call the destruction function to disconnect the client.
            yield this.destroy();
            yield Morgana_1.Morgana.warn('Discord client disconnected for {{bot}}.', { bot: this.bot.id });
        });
    }
}
exports.DiscordClient = DiscordClient;
