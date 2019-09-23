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
const ClientType_1 = require("../Client/ClientType");
const Gestalt_1 = require("../../Gestalt/Gestalt");
const Sojiro_1 = require("../../Confidant/Sojiro");
const Akechi_1 = require("../../Confidant/Akechi");
const Morgana_1 = require("../../Confidant/Morgana");
const Igor_1 = require("../../Confidant/Igor");
const Yoshida_1 = require("../../Confidant/Yoshida");
/**
 * Provides a base class for Commands.
 *
 * 'Commands' are directives you can give to a bot given you write the necessary format into a chat.
 *
 * Lavenza's design vision will allow commands to be created and configured for many clients, instead of
 * solely Discord. This also means that Commands from one client can do acts on another client. This will
 * be shown / described in this class.
 *
 * This class SHOULD have many helper functions to make this dream come true.
 */
class Command {
    /**
     * Command constructor.
     *
     * @param id
     *   The ID of the command. This will be the name of the Command's directory in lowercase.
     * @param key
     *   The key of the command.
     * @param directory
     *   The path to the directory where this command was found.
     */
    constructor(id, key, directory) {
        this.id = id;
        this.key = key;
        this.directory = directory;
    }
    /**
     * Perform build tasks.
     *
     * Since Commands will be singletons, there is no constructor. Each command will call this function once to set
     * their properties.
     *
     * @param config
     *   Configuration read from the command's '.config.yml' file in the command's directory.
     * @param talent
     *   Talent that this command is a child of.
     */
    build(config, talent) {
        return __awaiter(this, void 0, void 0, function* () {
            this.talent = talent;
            this.config = config;
            this.directory = config.directory;
            this.key = config.key;
        });
    }
    /**
     * Get the active configuration from the database for this Talent, in the context of a Bot.
     *
     * @param bot
     *   The bot context for the configuration we want to fetch. Each bot can have different configuration overrides
     *   for talents.
     *
     * @returns
     *   Returns the configuration fetched from the database.
     */
    getActiveConfigForBot(bot) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Gestalt_1.default.get(`/bots/${bot.id}/commands/${this.id}/config`);
        });
    }
    /**
     * Retrieve active client configuration for a specific client in a bot.
     *
     * "Active" configuration refers to the configuration found in the database.
     *
     * @param clientType
     *   The type of client configuration to return for the bot.
     * @param bot
     *   Bot to get this configuration for.
     *
     * @returns
     *   The requested client configuration.
     */
    getActiveClientConfig(clientType, bot) {
        return __awaiter(this, void 0, void 0, function* () {
            // Attempt to get the active configuration from the database.
            let activeConfig = yield Gestalt_1.default.get(`/bots/${bot.id}/commands/${this.id}/${clientType}`);
            if (!Sojiro_1.default.isEmpty(activeConfig)) {
                return activeConfig;
            }
            // If we don't find any configurations in the database, we'll fetch it normally and then save it.
            let config = yield this.getClientConfig(clientType);
            // Sync it to the database.
            yield Gestalt_1.default.sync(config, `/bots/${bot.id}/commands/${this.id}/${clientType}`);
            // Return the configuration.
            return config;
        });
    }
    /**
     * Retrieve configuration for a specific client.
     *
     * @param clientType
     *   The type of client configuration to return for the bot.
     *
     * @returns
     *   The requested client configuration.
     */
    getClientConfig(clientType) {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine path to client configuration.
            let pathToClientConfig = `${this.directory}/${clientType}.yml`;
            // Attempt to fetch client configuration.
            if (!(yield Akechi_1.default.fileExists(pathToClientConfig))) {
                return undefined;
            }
            // Load configuration since it exists.
            return yield Akechi_1.default.readYamlFile(pathToClientConfig);
        });
    }
    /**
     * Retrieve active parameter configuration for the command in a specific bot
     *
     * "Active" configuration refers to the configuration found in the database.
     *
     * @param bot
     *   Bot to get this configuration for.
     *
     * @returns
     *   The requested parameter configuration for the given bot obtained frm the database.
     */
    getActiveParameterConfig(bot) {
        return __awaiter(this, void 0, void 0, function* () {
            // Attempt to get the active configuration from the database.
            let activeConfig = yield Gestalt_1.default.get(`/bots/${bot.id}/commands/${this.id}/parameters`);
            if (!Sojiro_1.default.isEmpty(activeConfig)) {
                return activeConfig;
            }
            // If we don't find any configurations in the database, we'll fetch it normally and then save it.
            let config = yield this.getParameterConfig();
            // Sync it to the database.
            yield Gestalt_1.default.sync(config, `/bots/${bot.id}/commands/${this.id}/parameters`);
            // Return the configuration.
            return config;
        });
    }
    /**
     * Retrieve parameter configuration for this command.
     *
     * @returns
     *   The parameter configuration obtained from the core files.
     */
    getParameterConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine path to client configuration.
            let pathToParameterConfig = `${this.directory}/parameters.yml`;
            // Attempt to fetch client configuration.
            if (!(yield Akechi_1.default.fileExists(pathToParameterConfig))) {
                return {};
            }
            // Load configuration since it exists.
            let config = yield Akechi_1.default.readYamlFile(pathToParameterConfig);
            return Sojiro_1.default.isEmpty(config) ? {} : config;
        });
    }
    /**
     * Execute client specific tasks if needed.
     *
     * Some commands are available in all clients, and as such need to be able to do different tasks depending on the
     * client they are invoked in. This function fires any custom client handlers that are defined.
     *
     * @param resonance
     *   The original resonance that invoked the command.
     * @param data
     *   Any custom data that should be used.
     * @param method
     *   The method to run on the handler. By default, it will run the execute method in the handler class.
     *
     * @returns
     *   Anything that should be returned by client handlers.
     */
    fireClientHandlers(resonance, data, method = 'execute') {
        return __awaiter(this, void 0, void 0, function* () {
            // If the second provided parameter is a string, this means it's the method we want to run, and data is null.
            if (typeof data === 'string') {
                method = data;
                data = {};
            }
            // If data is not set, set it to an empty object.
            if (data === undefined) {
                data = {};
            }
            // Define variable for client task handler.
            let HandlerClass = undefined;
            // Define path to Handler.
            let pathToHandler = `${this.directory}/handlers/${resonance.client.type}/Handler`;
            // Try to fetch a handler for this client.
            try {
                // Automatically require the handler we want.
                HandlerClass = require(pathToHandler).default;
            }
            catch (error) {
                // Log a message.
                yield Morgana_1.default.warn('Command handler for {{client}} could not be loaded for the {{command}} command. If you are using the handlers() function, make sure client handlers exist for each client this command is usable in.');
                // Log the error that occurred.
                yield Morgana_1.default.warn(error.message);
                // Return.
                return;
            }
            // Now we can instantiate the Handler.
            let Handler = new HandlerClass(this, resonance, pathToHandler);
            // If the method set doesn't exist, we throw an error here.
            if (Sojiro_1.default.isEmpty(Handler[method])) {
                yield Igor_1.default.throw(`The {{method}} method does not exist in the {{client}} handler for your {{command}} command. Please verify your handler code!`);
            }
            // Then we can execute the tasks in the Handler.
            return yield Handler[method](data);
        });
    }
    /**
     * Provides help text for the current command.
     *
     * You can access the bot through the resonance, as well as any of the bot's clients.
     *
     * @param resonance
     *   Resonance that invoked this command. All information about the client and message are here.
     */
    help(resonance) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get configuration.
            let config = yield this.getActiveConfigForBot(resonance.bot);
            let parameterConfig = yield this.getActiveParameterConfig(resonance.bot);
            // Depending on the type of client, we want the help function to act differently.
            switch (resonance.client.type) {
                // If we're in Discord, we want to send a formatted rich embed.
                case ClientType_1.default.Discord: {
                    // Start building the usage text by getting the command prefix.
                    let usageText = `\`${yield resonance.bot.getCommandPrefix(resonance)}${config.key}`;
                    // If there is input defined for this command, we will add them to the help text.
                    if (parameterConfig.input) {
                        parameterConfig.input.requests.every(request => {
                            usageText += ` {${request.replace(' ', '_').toLowerCase()}}\`\n`;
                        });
                    }
                    else {
                        usageText += `\`\n`;
                    }
                    // If there are aliases defined for this command, add all usage examples to the help text.
                    if (parameterConfig['aliases']) {
                        let original = usageText;
                        parameterConfig['aliases'].every(alias => {
                            usageText += original.replace(`${config.key}`, alias);
                            return true;
                        });
                    }
                    // Set the usage section.
                    let fields = [
                        {
                            name: yield Yoshida_1.default.translate('Usage', resonance.locale),
                            text: usageText
                        }
                    ];
                    // If there are options defined for this command, we add a section for options.
                    if (parameterConfig.options) {
                        let optionsList = '';
                        yield Promise.all(parameterConfig.options.map((option) => __awaiter(this, void 0, void 0, function* () {
                            let description = yield Yoshida_1.default.translate(option.description, resonance.locale);
                            let name = yield Yoshida_1.default.translate(option.name, resonance.locale);
                            optionsList += `**${name}** \`-${option.key} {${option['expects'].replace(' ', '_').toLowerCase()}}\` - ${description}\n\n`;
                        })));
                        fields.push({
                            name: yield Yoshida_1.default.translate('Options', resonance.locale),
                            text: optionsList
                        });
                    }
                    // If there are flags defi-...You get the idea.
                    if (parameterConfig.flags) {
                        let flagsList = '';
                        yield Promise.all(parameterConfig.flags.map((flag) => __awaiter(this, void 0, void 0, function* () {
                            let description = yield Yoshida_1.default.translate(flag.description, resonance.locale);
                            let name = yield Yoshida_1.default.translate(flag.name, resonance.locale);
                            flagsList += `**${name}** \`-${flag.key}\` - ${description}\n\n`;
                        })));
                        fields.push({
                            name: yield Yoshida_1.default.translate('Flags', resonance.locale),
                            text: flagsList
                        });
                    }
                    // Finally, send the embed.
                    yield resonance.client.sendEmbed(resonance.message.channel, {
                        title: yield Yoshida_1.default.translate(`${config.name}`, resonance.locale),
                        description: yield Yoshida_1.default.translate(`${config.description}`, resonance.locale),
                        header: {
                            text: yield Yoshida_1.default.translate('{{bot}} Guide', { bot: resonance.bot.config.name }, resonance.locale),
                            icon: resonance.client.user.avatarURL
                        },
                        fields: fields,
                        thumbnail: resonance.client.user.avatarURL
                    });
                    break;
                }
                case ClientType_1.default.Twitch: {
                    // @TODO - Implement this!
                }
            }
        });
    }
    /**
     * Determines whether or not a command is allowed to be executed for a client.
     *
     * This is managed in a command's configuration file.
     *
     * @param clientType
     *   Client that we want to check for. i.e. 'discord'.
     *
     * @returns
     *   Returns true if the command is allowed to be executed in the client. Returns false otherwise.
     */
    allowedInClient(clientType) {
        let allowedForTalent = !Sojiro_1.default.isEmpty(this.talent.config.clients) && this.talent.config.clients !== '*' && (this.talent.config.clients.includes(clientType) || this.talent.config.clients === clientType)
            || (Sojiro_1.default.isEmpty(this.talent.config.clients) || this.talent.config.clients === '*');
        let allowedForCommand = !Sojiro_1.default.isEmpty(this.config.clients) && this.config.clients !== '*' && (this.config.clients.includes(clientType) || this.config.clients === clientType)
            || (Sojiro_1.default.isEmpty(this.config.clients) || this.config.clients === '*');
        return allowedForTalent && allowedForCommand;
    }
}
exports.default = Command;
