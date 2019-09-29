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
const path = require("path");
// Imports.
const Akechi_1 = require("../../Confidant/Akechi");
const Igor_1 = require("../../Confidant/Igor");
const Morgana_1 = require("../../Confidant/Morgana");
const Sojiro_1 = require("../../Confidant/Sojiro");
const Gestalt_1 = require("../../Gestalt/Gestalt");
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
            return yield Gestalt_1.Gestalt.get(`/bots/${bot.id}/commands/${this.id}/config`);
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
            const activeConfig = yield Gestalt_1.Gestalt.get(`/bots/${bot.id}/commands/${this.id}/${clientType}`);
            if (!Sojiro_1.Sojiro.isEmpty(activeConfig)) {
                return activeConfig;
            }
            // If we don't find any configurations in the database, we'll fetch it normally and then save it.
            const config = yield this.getClientConfig(clientType);
            // Sync it to the database.
            yield Gestalt_1.Gestalt.sync(config, `/bots/${bot.id}/commands/${this.id}/${clientType}`);
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
            const pathToClientConfig = `${this.directory}/${clientType}.yml`;
            // Attempt to fetch client configuration.
            if (!(yield Akechi_1.Akechi.fileExists(pathToClientConfig))) {
                return undefined;
            }
            // Load configuration since it exists.
            return yield Akechi_1.Akechi.readYamlFile(pathToClientConfig);
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
            const activeConfig = yield Gestalt_1.Gestalt.get(`/bots/${bot.id}/commands/${this.id}/parameters`);
            if (!Sojiro_1.Sojiro.isEmpty(activeConfig)) {
                return activeConfig;
            }
            // If we don't find any configurations in the database, we'll fetch it normally and then save it.
            const config = yield this.getParameterConfig();
            // Sync it to the database.
            yield Gestalt_1.Gestalt.sync(config, `/bots/${bot.id}/commands/${this.id}/parameters`);
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
            const pathToParameterConfig = `${this.directory}/parameters.yml`;
            // Attempt to fetch client configuration.
            if (!(yield Akechi_1.Akechi.fileExists(pathToParameterConfig))) {
                return {};
            }
            // Load configuration since it exists.
            const config = yield Akechi_1.Akechi.readYamlFile(pathToParameterConfig);
            return Sojiro_1.Sojiro.isEmpty(config) ? {} : config;
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
    fireClientHandlers(resonance, data, method = "execute") {
        return __awaiter(this, void 0, void 0, function* () {
            // Set variables that we will use.
            let methodToRun = method;
            let dataToUse = data;
            // If the second provided parameter is a string, this means it's the method we want to run, and data is null.
            if (typeof data === "string") {
                methodToRun = data;
                dataToUse = {};
            }
            // If data is not set, set it to an empty object.
            if (dataToUse === undefined) {
                dataToUse = {};
            }
            // Define variable for client task handler.
            let handlerClass;
            // Define path to Handler.
            const pathToHandler = `${this.directory}/handlers/${resonance.client.type}/Handler`;
            // Try to fetch a handler for this client.
            try {
                // Automatically require the handler we want.
                handlerClass = yield Promise.resolve().then(() => require(pathToHandler));
            }
            catch (error) {
                // Log a message.
                yield Morgana_1.Morgana.warn("Command handler for {{client}} could not be loaded for the {{command}} command. If you are using the handlers() function, make sure client handlers exist for each client this command is usable in.");
                // Log the error that occurred.
                yield Morgana_1.Morgana.warn(error.message);
                // Return.
                return;
            }
            // Now we can instantiate the Handler.
            const handler = new handlerClass[path.basename(pathToHandler, ".js")](this, resonance, pathToHandler);
            // If the method set doesn't exist, we throw an error here.
            if (Sojiro_1.Sojiro.isEmpty(handler[methodToRun])) {
                yield Igor_1.Igor.throw("The {{method}} method does not exist in the {{client}} handler for your {{command}} command. Please verify your handler code!");
            }
            // Then we can execute the tasks in the Handler.
            return handler[methodToRun](dataToUse);
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
            // Fire the client's help handler.
            yield resonance.client.help(this, resonance);
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
        return __awaiter(this, void 0, void 0, function* () {
            const allowedForTalent = !Sojiro_1.Sojiro.isEmpty(this.talent.config.clients)
                && this.talent.config.clients !== "*"
                && (this.talent.config.clients.includes(clientType)
                    || this.talent.config.clients === clientType)
                || (Sojiro_1.Sojiro.isEmpty(this.talent.config.clients)
                    || this.talent.config.clients === "*");
            const allowedForCommand = !Sojiro_1.Sojiro.isEmpty(this.config.clients)
                && this.config.clients !== "*"
                && (this.config.clients.includes(clientType)
                    || this.config.clients === clientType)
                || (Sojiro_1.Sojiro.isEmpty(this.config.clients)
                    || this.config.clients === "*");
            return allowedForTalent && allowedForCommand;
        });
    }
}
exports.Command = Command;
