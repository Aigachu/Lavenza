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
const Morgana_1 = require("../Confidant/Morgana");
const Sojiro_1 = require("../Confidant/Sojiro");
const Igor_1 = require("../Confidant/Igor");
const Bot_1 = require("./Bot");
const Core_1 = require("../Core/Core");
const Gestalt_1 = require("../Gestalt/Gestalt");
/**
 * Provides a Manager for Bots.
 *
 * This class manages the registering and instantiation of bots.
 *
 * Bots are configured in the 'bots' folder at the root of the application.
 *
 */
class BotManager {
    // noinspection JSUnusedLocalSymbols
    /**
     * This is a static class. The constructor will never be used.
     */
    constructor() {
    }
    /**
     * Preparation handler for the BotManager.
     *
     * Registers all bots and fires all of *their* preparation handlers.
     */
    static build() {
        return __awaiter(this, void 0, void 0, function* () {
            // Await registration of all bots from the application files.
            // Upon error in registration, stop the application.
            yield BotManager.registerAllBotsInDirectory();
            // We'll run preparation handlers for all bots as this should only be done once.
            yield BotManager.prepareAllBots();
            // Some more flavor.
            yield Morgana_1.Morgana.success("Bot Manager preparations complete!");
        });
    }
    /**
     * Perform bootstrapping tasks for Database for all bots.
     */
    static gestalt() {
        return __awaiter(this, void 0, void 0, function* () {
            // Some flavor.
            yield Morgana_1.Morgana.status("Running Gestalt bootstrap process for the Bot Manager...");
            // Creation of the Bots collection.
            yield Gestalt_1.Gestalt.createCollection('/bots');
            // Run Gestalt handlers for each Bot.
            yield Promise.all(Object.keys(BotManager.bots).map((botId) => __awaiter(this, void 0, void 0, function* () {
                let bot = yield BotManager.getBot(botId);
                yield bot.gestalt();
            })));
            // Some flavor.
            yield Morgana_1.Morgana.status("Gestalt bootstrap process complete for the Bot Manager!");
        });
    }
    /**
     * Retrieve a Bot from the Manager.
     *
     * @param id
     *   ID of the bot we want to retrieve.
     */
    static getBot(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return BotManager.bots[id];
        });
    }
    /**
     * Execution handler for the BotManager.
     *
     * Deploy only the "Master" bot.
     */
    static run() {
        return __awaiter(this, void 0, void 0, function* () {
            // Boot master bot that will manage all other bots in the codebase.
            yield BotManager.bootMasterBot();
            // Some more flavor.
            yield Morgana_1.Morgana.success("Booted the master bot, {{bot}}!", { bot: Core_1.Core.settings.master });
            // Boot auto-boot bots.
            // Some bots are set up for auto-booting. We'll handle those too.
            yield BotManager.bootAutoBoots();
        });
    }
    /**
     * Activates the Master Bot for your application.
     */
    static bootMasterBot() {
        return __awaiter(this, void 0, void 0, function* () {
            // Await deployment of the master bot.
            yield BotManager.boot(Core_1.Core.settings.master);
        });
    }
    /**
     * Boots all bots set up in the 'autoboot' array of the settings.
     */
    static bootAutoBoots() {
        return __awaiter(this, void 0, void 0, function* () {
            // If the autoboot array is empty, we don't do anything here.
            if (Sojiro_1.Sojiro.isEmpty(Core_1.Core.settings.autoboot)) {
                yield Morgana_1.Morgana.warn(`No bots set up for autobooting. Continuing!`);
                return;
            }
            // Boot all bots set up in autobooting.
            yield Promise.all(Core_1.Core.settings.autoboot.map((botId) => __awaiter(this, void 0, void 0, function* () {
                yield BotManager.boot(botId);
                yield Morgana_1.Morgana.success("Successfully Auto-Booted {{bot}}!", { bot: botId });
            })));
        });
    }
    /**
     * Run deployment handlers for all bots loaded in the Manager.
     *
     * @param botId
     *    The ID of the bot to deploy.
     */
    static boot(botId) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the bot isn't found, we can't boot it.
            if (Sojiro_1.Sojiro.isEmpty(BotManager.bots[botId])) {
                yield Morgana_1.Morgana.warn(`Tried to boot an non-existent bot: {{botId}}. Gracefully continuing the program.`, { botId: botId });
                return;
            }
            // Await deployment handlers for a single bot.
            let bot = yield BotManager.getBot(botId);
            yield bot.deploy();
        });
    }
    /**
     * Shutdown a bot.
     *
     * @param botId
     *   ID of the Bot to shutdown.
     */
    static shutdown(botId) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the bot isn't found, we can't shut it down.
            if (Sojiro_1.Sojiro.isEmpty(BotManager.bots[botId])) {
                yield Morgana_1.Morgana.warn(`Tried to shutdown an non-existent bot: {{botId}}. Gracefully continuing the program.`, { botId: botId });
                return;
            }
            let bot = yield BotManager.getBot(botId);
            yield bot.shutdown();
        });
    }
    /**
     * Run preparation handlers for a single bot loaded in the Manager.
     *
     * @param botId
     *    The ID of the bot to prepare.
     */
    static prepareBot(botId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Await preparation handler for a single bot.
            let bot = yield BotManager.getBot(botId);
            yield bot.prepare();
        });
    }
    /**
     * Run preparation handlers for all bots loaded in the Manager.
     */
    static prepareAllBots() {
        return __awaiter(this, void 0, void 0, function* () {
            // Await preparation handlers for all bots.
            yield Promise.all(Object.keys(BotManager.bots).map((botId) => __awaiter(this, void 0, void 0, function* () {
                // Await preparation handler for a single bot.
                yield BotManager.prepareBot(botId);
            })));
        });
    }
    /**
     * Run registration and instantiate a bot.
     *
     * This will automatically load a 'config.yml' file in every bot's directory.
     *
     * @param botId
     *    The ID of the bot to register.
     * @param directory
     *    Path to the directory where this bot's files are located.
     */
    static registerBot(botId, directory = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the directory isn't provided, we'll get it ourselves.
            if (directory === undefined) {
                directory = Core_1.Core.paths.bots + '/' + botId;
            }
            // If the bot name is part of the ignored bot list, return now.
            if (botId in BotManager.ignoredBots) {
                return;
            }
            // Get the config file for the bot.
            let configFilePath = directory + '/' + 'config.yml';
            let config = yield Akechi_1.Akechi.readYamlFile(configFilePath).catch(Igor_1.Igor.continue);
            // If the configuration is empty, stop here.
            // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
            if (Sojiro_1.Sojiro.isEmpty(config)) {
                yield Morgana_1.Morgana.warn('Configuration file could not be loaded for following bot: {{bot}}', { bot: botId });
                return;
            }
            // Set directory to the configuration. It's nice to have quick access to the bot folder from within the bot.
            config.directory = directory;
            // If the 'active' flag of the config is set and is not 'true', we don't activate this bot.
            if (config.active !== undefined && config.active === false) {
                yield Morgana_1.Morgana.warn('The {{bot}} bot has been set to inactive. It will not be registered.', { bot: botId });
                return;
            }
            // Instantiate and set the bot to the collection.
            let bot = new Bot_1.Bot(botId, config);
            if (bot.id === Core_1.Core.settings.master) {
                bot.isMaster = true;
            }
            Object.assign(BotManager.bots, { [botId]: bot });
            // Print a success message.
            yield Morgana_1.Morgana.success('The {{bot}} bot has successfully been registered!', { bot: botId });
        });
    }
    /**
     * Registration function for the bots.
     *
     * Bots are instantiated through configuration files located in the 'bots' folder at the root of the application.
     * Check that folder out for more information.
     *
     * This function crawls that folder and instantiates the bots with their configuration files.
     */
    static registerAllBotsInDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all bot directories from the 'bots' folder at the root of the application.
            let botDirectories = yield Akechi_1.Akechi.getDirectoriesFrom(Core_1.Core.paths.bots);
            // If for some reason, bot directories could not be loaded, we stop the app.
            if (botDirectories === undefined) {
                yield Igor_1.Igor.throw("Other than the 'example' folder, no bot folders seem to exist in /app/bots. The whole point of this app is to run bots, so create one!");
            }
            // Loop through all directories we need to.
            yield Promise.all(botDirectories.map((directory) => __awaiter(this, void 0, void 0, function* () {
                // Get the bot name. This is in fact the name of the directory.
                let name = path.basename(directory);
                // Register the bot.
                yield BotManager.registerBot(name);
            })));
            // Array does not exist, is not an array, or is empty.
            if (Sojiro_1.Sojiro.isEmpty(BotManager.bots)) {
                yield Igor_1.Igor.throw("No bots were registered after the preparation phase. As a result, there is nothing to run.");
            }
        });
    }
}
exports.BotManager = BotManager;
/**
 * Store ignored bot names.
 * We use this to prevent loading unneeded bot folders, like the example one.
 */
BotManager.ignoredBots = {
    example: 'example',
};
/**
 * Store a list of all bots in the application.
 */
BotManager.bots = {};
