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
const Akechi_1 = require("../Confidant/Akechi");
const Gestalt_1 = require("../Gestalt/Gestalt");
const Sojiro_1 = require("../Confidant/Sojiro");
const Morgana_1 = require("../Confidant/Morgana");
const Igor_1 = require("../Confidant/Igor");
/**
 * Provides a base class for 'Talents'.
 *
 * 'Talents', in the context of this application, are bundles of functionality that can be granted to any given bot.
 *
 * Think of talents as..."Plugins" from Wordpress, or "Modules" from Drupal, or "Packages" from Laravel.
 *
 * The idea here is that bot features are coded in their own folders and contexts. The power here comes from the flexibility we have
 * since talents can be granted to multiple bots, and talents can be tracked in separate repositories if needed. Also,
 * they can easily be toggled on and off. Decoupling the features from the bots seemed like a good move.
 */
class Talent {
    /**
     * Perform build tasks.
     *
     * Each talent will call this function once to set their properties.
     *
     * @param config The configuration used to build the Talent. Provided from a 'config.yml' file found in the Talent's folder.
     */
    build(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize fields.
            this.machineName = path.basename(config.directory); // Here we get the name of the directory and set it as the ID.
            this.config = config;
            this.directory = config.directory;
            this.databases = {};
            this.commands = {};
            this.commandAliases = {};
            this.listeners = [];
            // Set the path to the talent's global database.
            this.databases.global = `/talents/${this.machineName}`;
            // Await the process of loading commands.
            yield this.loadCommands();
            // Await the process of loading listeners.
            yield this.loadListeners();
        });
    }
    /**
     * The Gestalt function is used to setup database tables for a given object.
     *
     * In this case, these are the database setup tasks for Talents.
     *
     * You can see the result of these calls in the database.
     */
    gestalt() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize the database collection for this talent if it doesn't already exist.
            yield Gestalt_1.default.createCollection(`/talents/${this.machineName}`);
        });
    }
    /**
     * Perform any initialization tasks for the Talent, in the context of a given bot.
     *
     * These initialization tasks happen after clients are loaded and authenticated for the bot.
     *
     * @param bot The bot to perform initializations for.
     */
    initialize(bot) {
        return __awaiter(this, void 0, void 0, function* () {
            // Set the path to the talent's bot specific database.
            this.databases[bot.id] = `/bots/${bot.id}/talents/${this.machineName}`;
        });
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * Get the active configuration from the database for this Talent, in the context of a Bot.
     *
     * Bots can override talent configurations for themselves. As a result, in the database, we must store configurations
     * specific to this talent in the bot's database table.
     *
     * @param bot
     *   The bot context for the configuration we want to fetch. Each bot can have different configuration overrides
     *   for talents.
     *
     * @returns
     *   The active database configuration for the talent configuration, specific to a given Bot.
     */
    getActiveConfigForBot(bot) {
        return __awaiter(this, void 0, void 0, function* () {
            // Await Gestalt's API call to get the configuration from the storage.
            return yield Gestalt_1.default.get(`/bots/${bot.id}/talents/${this.machineName}/config`);
        });
    }
    /**
     * Auto-Load all commands from the 'hooks/Commands' folder nested in the Talent's directory.
     *
     * Commands can't necessarily be added alone. They must be bundled in a Talent. This function fetches them all from
     * the 'Commands' folder.
     */
    loadCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            // Determine the path to this Talent's commands.
            // Each command has its own directory. We'll get the list here.
            let commandDirectoriesPath = `${this.directory}/hooks/Commands`;
            // If this directory doesn't exist, we simply return.
            if (!(yield Akechi_1.default.directoryExists(commandDirectoriesPath))) {
                return;
            }
            let commandDirectories = yield Akechi_1.default.getDirectoriesFrom(commandDirectoriesPath);
            // We'll throw an error for this function if the 'Commands' directory doesn't exist or is empty.
            // This error should be caught and handled above.
            if (Sojiro_1.default.isEmpty(commandDirectories)) {
                // await Lavenza.warn('No commands were found for the {{talent}} talent. This might not be normal!', {talent: this.id});
                return;
            }
            // We'll now act on each command directory found.
            yield Promise.all(commandDirectories.map((directory) => __awaiter(this, void 0, void 0, function* () {
                // The name of the command will be the directory name.
                let name = path.basename(directory);
                // The ID of the command will be its name in lowercase.
                let id = name.toLowerCase();
                // Get the config file for the command.
                // Each command should have a file with the format 'COMMAND_NAME.config.yml'.
                let configFilePath = `${directory}/config.yml`;
                let config = yield Akechi_1.default.readYamlFile(configFilePath).catch(Igor_1.default.continue);
                // Stop if the configuration is empty or wasn't found.
                // We can't load the command without configurations.
                // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
                if (Sojiro_1.default.isEmpty(config)) {
                    yield Morgana_1.default.warn('Configuration file could not be loaded for the {{command}} command in the {{talent}} talent.', { command: name, talent: this.machineName });
                    return;
                }
                // Set directory to the configuration. It's nice to have quick access to the command folder from within the command.
                config.directory = directory;
                // If the configuration exists, we can process by loading the class of the Command.
                // If the class doesn't exist (this could be caused by the configuration being wrong), we stop.
                let command = require(`${directory}/${config.class}`)['default'];
                if (Sojiro_1.default.isEmpty(command)) {
                    yield Morgana_1.default.warn('Class could not be loaded for the {{command}} command in the {{talent}} talent.', { command: name, talent: this.machineName });
                    return;
                }
                command = new command(id, directory);
                // Now let's successfully register the command to the Talent.
                // Commands have build tasks too and are also singletons. We'll run them here.
                yield command.build(config, this);
                // Set the command to this Talent.
                this.commands[config.key] = command;
                // Set command aliases.
                config['aliases'].forEach(alias => {
                    this.commandAliases[alias] = command.config.key;
                });
            })));
        });
    }
    /**
     * Auto-Load all listeners from the 'hooks/Listeners' folder nested in the Talent's directory.
     *
     * Listeners are other entities that are used to...Pretty much LISTEN to messages received by clients.
     * Listeners then decide what to do with these messages they hear.
     *
     * Each Talent can have Listeners defined as well.
     */
    loadListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            // The 'Listeners' folder will simply have a collection of Class files. We'll get the list here.
            // We'll ge the tentative path first.
            let listenerClassesPath = `${this.directory}/hooks/Listeners`;
            // If this directory doesn't exist, we simply return.
            if (!(yield Akechi_1.default.directoryExists(listenerClassesPath))) {
                return;
            }
            // Get the list of listener classes at the path.
            let listenerClasses = yield Akechi_1.default.getFilesFrom(listenerClassesPath);
            // Filter the obtained list to exclude Typescript files.
            listenerClasses = listenerClasses.filter((path) => !path.endsWith('.ts'));
            // We'll throw an error for this function if the 'Listeners' directory doesn't exist or is empty.
            // This error should be caught and handled above.
            if (Sojiro_1.default.isEmpty(listenerClasses)) {
                // await Lavenza.warn('No listeners were found for the {{talent}} talent. This might not be normal!', {talent: this.id});
                return;
            }
            // Await the loading of all listener classes.
            yield Promise.all(listenerClasses.map((listenerClass) => __awaiter(this, void 0, void 0, function* () {
                // We will simply require the file here.
                let listener = require(listenerClass)['default'];
                listener = new listener();
                // Run listener build tasks.
                // We only do this to assign the talent to the listener. That way, the listener can access the Talent.
                yield listener.build(this);
                // If the require fails or the result is empty, we stop.
                if (Sojiro_1.default.isEmpty(listener)) {
                    yield Morgana_1.default.warn('A Listener class could not be loaded in the {{talent}} talent.', { talent: this.machineName });
                    return;
                }
                // If everything goes smoothly, we register the listener to the Talent.
                this.listeners.push(listener);
            })));
        });
    }
}
exports.default = Talent;
