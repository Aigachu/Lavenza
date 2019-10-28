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
// Modules
const discord_js_1 = require("discord.js");
// Imports.
const Igor_1 = require("../../../Confidant/Igor");
const Morgana_1 = require("../../../Confidant/Morgana");
const Sojiro_1 = require("../../../Confidant/Sojiro");
const Yoshida_1 = require("../../../Confidant/Yoshida");
const Gestalt_1 = require("../../../Gestalt/Gestalt");
const Client_1 = require("../Client");
const ClientType_1 = require("../ClientType");
const DiscordCommandAuthorizer_1 = require("./DiscordCommandAuthorizer");
const DiscordPrompt_1 = require("./DiscordPrompt");
const DiscordResonance_1 = require("./DiscordResonance");
/**
 * Provides a class for Discord Clients managed in Lavenza.
 *
 * This class extends hydrabolt's wonderful discord.js package. Couldn't do this
 * without em. Much love!
 *
 * @see https://discord.js.org/#/
 */
class DiscordClient extends Client_1.Client {
    constructor() {
        super(...arguments);
        /**
         * The type of client.
         *
         * @inheritDoc
         */
        this.type = ClientType_1.ClientType.Discord;
    }
    /**
     * Bridge a connection to Discord.
     *
     * We'll use Discord.JS here! Thank you hydrabolt. :)
     *
     * @inheritDoc
     */
    bridge() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connector = new discord_js_1.Client();
        });
    }
    /**
     * Run build tasks to prepare any necessary functions.
     *
     * Treat this as a proper constructor.
     */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            // Event: When the client connects to Discord and is ready.
            this.connector.on("ready", () => __awaiter(this, void 0, void 0, function* () {
                yield Morgana_1.Morgana.success("Discord client successfully connected for {{bot}}!", { bot: this.bot.id });
                // We start by syncing the guild configurations.
                const guilds = yield Gestalt_1.Gestalt.sync({}, `/bots/${this.bot.id}/clients/${this.type}/guilds`);
                // Set up initial guild configurations.
                yield Promise.all(this.connector.guilds.map((guild) => __awaiter(this, void 0, void 0, function* () {
                    const baseGuildConfig = {
                        commandPrefix: yield this.bot.config.commandPrefix,
                        name: guild.name,
                        userEminences: {},
                    };
                    if (!(guild.id in guilds)) {
                        guilds[guild.id] = baseGuildConfig;
                    }
                    yield Gestalt_1.Gestalt.update(`/bots/${this.bot.id}/clients/${this.type}/guilds`, guilds);
                })));
                // Set game text.
                this.connector.user.setActivity(this.config.activity)
                    .catch(console.error);
            }));
            // Event: When the discord client connects to a new guild.
            this.connector.on("guildCreate", (guild) => __awaiter(this, void 0, void 0, function* () {
                // We start by syncing the guild configurations.
                const guilds = yield Gestalt_1.Gestalt.sync({}, `/bots/${this.bot.id}/clients/${this.type}/guilds`);
                const baseGuildConfig = {
                    commandPrefix: yield this.bot.config.commandPrefix,
                    name: guild.name,
                    userEminences: {},
                };
                if (!(guild.id in guilds)) {
                    guilds[guild.id] = baseGuildConfig;
                }
                yield Gestalt_1.Gestalt.update(`/bots/${this.bot.id}/clients/${this.type}/guilds`, guilds);
            }));
            // Event: When the discord client receives a message.
            this.connector.on("message", (message) => {
                // We ignore messages from any bot.
                if (message.author.bot === true) {
                    return;
                }
                // Resonate to the Bot.
                this.resonate(message)
                    .catch(Igor_1.Igor.stop);
            });
            // Event: When the clients disconnects from Discord.
            this.connector.on("disconnected", () => __awaiter(this, void 0, void 0, function* () {
                yield Morgana_1.Morgana.status("Discord client for {{bot}} has disconnected.", { bot: this.bot.id });
            }));
            // Event: When the clients disconnects from Discord.
            this.connector.on("error", () => __awaiter(this, void 0, void 0, function* () {
                yield Morgana_1.Morgana.error("Error has occurred for {{bot}}'s client...", { bot: this.bot.id });
            }));
        });
    }
    /**
     * Authenticate the client. (Login to Discord)
     *
     * @inheritDoc
     */
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the token.
            const token = this.bot.env.DISCORD_TOKEN;
            // If the token isn't found, we throw an error.
            if (token === undefined) {
                yield Igor_1.Igor.throw("Discord application token is missing for {{bot}}. Make sure the token is set in the .env file in the bot's folder. See the example bot folder for more details.", { bot: this.bot.id });
            }
            // Await the login in of this client.
            yield this.connector.login(token)
                .catch(() => __awaiter(this, void 0, void 0, function* () {
                yield Igor_1.Igor.throw("Failed to authenticate Discord client for {{bot}}.", { bot: this.bot.id });
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
            yield this.connector.destroy();
            yield Morgana_1.Morgana.warn("Discord client disconnected for {{bot}}.", { bot: this.bot.id });
        });
    }
    /**
     * Bootstrap database folders for Discord client.
     *
     * @inheritDoc
     */
    gestalt() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize i18n contexts, creating them if they don't exist.
            // Translations are manageable through all of these contexts.
            yield Gestalt_1.Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/guilds`);
            yield Gestalt_1.Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/channels`);
            yield Gestalt_1.Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/users`);
        });
    }
    /**
     * Send a pretty help dialog.
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
            // Get configuration.
            const config = yield command.getActiveConfigForBot(resonance.bot);
            const parameterConfig = yield command.getActiveParameterConfig(resonance.bot);
            // Start building the usage text by getting the command prefix.
            let usageText = `\`${yield resonance.bot.getCommandPrefix(resonance)}${config.key}`;
            // If there is input defined for this command, we will add them to the help text.
            if (parameterConfig.input) {
                parameterConfig.input.requests.every((request) => {
                    usageText += ` {${request.replace(" ", "_")
                        .toLowerCase()}}\`\n`;
                });
            }
            else {
                usageText += "`\n";
            }
            // If there are aliases defined for this command, add all usage examples to the help text.
            if (config.aliases) {
                const original = usageText;
                config.aliases.every((alias) => {
                    usageText += original.replace(`${config.key}`, alias);
                    return true;
                });
            }
            // Set the usage section.
            const fields = [
                {
                    name: yield Yoshida_1.Yoshida.translate("Usage", resonance.locale),
                    text: usageText,
                },
            ];
            // If there are options defined for this command, we add a section for options.
            if (parameterConfig.options) {
                let optionsList = "";
                yield Promise.all(parameterConfig.options.map((option) => __awaiter(this, void 0, void 0, function* () {
                    const description = yield Yoshida_1.Yoshida.translate(option.description, resonance.locale);
                    const name = yield Yoshida_1.Yoshida.translate(option.name, resonance.locale);
                    optionsList += `**${name}** \`-${option.key} {${option.expects.replace(" ", "_")
                        .toLowerCase()}}\` - ${description}\n\n`;
                })));
                fields.push({
                    name: yield Yoshida_1.Yoshida.translate("Options", resonance.locale),
                    text: optionsList,
                });
            }
            // If there are flags defi-...You get the idea.
            if (parameterConfig.flags) {
                let flagsList = "";
                yield Promise.all(parameterConfig.flags.map((flag) => __awaiter(this, void 0, void 0, function* () {
                    const description = yield Yoshida_1.Yoshida.translate(flag.description, resonance.locale);
                    const name = yield Yoshida_1.Yoshida.translate(flag.name, resonance.locale);
                    flagsList += `**${name}** \`-${flag.key}\` - ${description}\n\n`;
                })));
                fields.push({
                    name: yield Yoshida_1.Yoshida.translate("Flags", resonance.locale),
                    text: flagsList,
                });
            }
            // Finally, send the embed.
            yield this.sendEmbed(resonance.message.channel, {
                description: yield Yoshida_1.Yoshida.translate(`${config.description}`, resonance.locale),
                fields,
                header: {
                    icon: this.connector.user.avatarURL,
                    text: yield Yoshida_1.Yoshida.translate("{{bot}} Guide", { bot: resonance.bot.config.name }, resonance.locale),
                },
                thumbnail: this.connector.user.avatarURL,
                title: yield Yoshida_1.Yoshida.translate(`${config.name}`, resonance.locale),
            });
        });
    }
    /**
     * Discord client's resonance builder.
     *
     * @inheritDoc
     */
    buildResonance(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DiscordResonance_1.DiscordResonance(message.content, message, this.bot, this);
        });
    }
    /**
     * Discord client's prompt builder.
     *
     * @inheritDoc
     */
    buildPrompt(user, line, resonance, lifespan, onResponse, onError) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DiscordPrompt_1.DiscordPrompt(user, line, resonance, lifespan, onResponse, onError, this.bot);
        });
    }
    /**
     * Discord's Command Authorizer builder.
     *
     * @inheritDoc
     */
    buildCommandAuthorizer(command, resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            return new DiscordCommandAuthorizer_1.DiscordCommandAuthorizer(command, resonance);
        });
    }
    /**
     * Fetch a Discord user's information.
     *
     * @inheritDoc
     */
    getUser(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connector.fetchUser(identifier);
        });
    }
    /**
     * Get active Discord configurations for this bot.
     *
     * @inheritDoc
     */
    getActiveConfigurations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Gestalt_1.Gestalt.get(`/bots/${this.bot.id}/clients/${this.type}`);
        });
    }
    /**
     * Get command prefix, taking into consideration the Discord context.
     *
     * A custom command prefix can be set per Guild.
     *
     * @inheritDoc
     */
    getCommandPrefix(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get client specific configurations.
            const clientConfig = yield this.getActiveConfigurations();
            if (resonance.message.guild && clientConfig.guilds[resonance.message.guild.id]) {
                return clientConfig.guilds[resonance.message.guild.id].commandPrefix || undefined;
            }
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
    // tslint:disable-next-line:comment-format
    // noinspection JSUnusedGlobalSymbols
    /**
     * Send a cute error message to a destination.
     *
     * @param destination
     *   Destination, normally a channel or a user.
     * @param text
     *   Message of the error.
     * @param type
     *   Type of error. Can be warning, status or error.
     * @param code
     *   Error code.
     *
     * @returns
     *   The message that was sent as an error.
     */
    sendError(destination, { text = "", type = "", code = 404, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize some variables.
            let message = "";
            let color = "";
            let image;
            // Determine code.
            switch (code) {
                case 401:
                    message = "Unauthorized.";
                    break;
                default:
                    message = "An error has occurred.";
            }
            // Determine color.
            switch (type) {
                case "warning":
                    color = "0xf4d742";
                    image = {
                        attachment: new discord_js_1.Attachment("./core/assets/warning.png", "warning.png"),
                        name: "warning.png",
                    };
                    break;
                default:
                    color = "0xa5201d";
                    image = {
                        attachment: new discord_js_1.Attachment("./core/assets/error.png", "error.png"),
                        name: "error.png",
                    };
            }
            // Send the embed.
            return yield this.sendEmbed(destination, {
                attachments: [
                    image.attachment,
                ],
                color,
                description: text,
                header: {
                    icon: `attachment://${image.name}`,
                    text: `${code}: ${message}`,
                },
                timestamp: true,
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
     * @param title
     *   The title of the rich embed.
     * @param description
     *   The description of the rich embed.
     * @param header
     *   Object that should contain the *text* of the header and the *icon* if applicable.
     * @param url
     *   URL of the rich embed.
     * @param color
     *   Color of the left border of the rich embed.
     * @param image
     *   Main image of the rich embed. Usually an attachment reference.
     * @param thumbnail
     *   Main thumbnail of the rich embed. Usually an attachment reference.
     * @param fields
     *   Fields of the rich embed.
     * @param footer
     *   Object that should contain the *text* of the footer and the *icon* if applicable.
     * @param attachments
     *   Array of attachments to attach to the embed.
     * @param timestamp
     *   Controls whether or not we want to add a timestamp of the current time.
     *
     * @returns
     *   The message that was sent as an embed.
     */
    sendEmbed(destination, { title = "", description = "", header = {}, url = "", color = "", image = "", thumbnail = "", fields = [], footer = {}, attachments = [], timestamp = false, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the embed instance.
            const embed = new discord_js_1.RichEmbed();
            // Manage default values.
            const colorHex = color || "0x1C1CF0";
            // Set default values.
            embed.setColor(colorHex);
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
                embed.setAuthor(header.text, header.icon);
            }
            // Set Footer if any.
            if (footer) {
                embed.setFooter(footer.text, footer.icon);
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
                fields.every((field) => {
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
            return destination.send(embed);
        });
    }
}
exports.DiscordClient = DiscordClient;
