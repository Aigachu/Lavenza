"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 *
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
const arp = require("app-root-path");
const path = require("path");
const prompts = require("prompts");
// Imports.
const BotManager_1 = require("../Bot/BotManager");
const Akechi_1 = require("../Confidant/Akechi");
const Igor_1 = require("../Confidant/Igor");
const Morgana_1 = require("../Confidant/Morgana");
const Sojiro_1 = require("../Confidant/Sojiro");
const Yoshida_1 = require("../Confidant/Yoshida");
const Gestalt_1 = require("../Gestalt/Gestalt");
const TalentManager_1 = require("../Talent/TalentManager");
/**
 * Provides class for the Core of the Lavenza application.
 *
 * Most of the Core business and bootstrapping happens here, though specified features will be
 * properly divided into respective classes. We're going for full-blown OOP here.
 * Let's try to make, and KEEP, this clean now!
 *
 * Lavenza hates dirty code. ;)
 */
class Core {
    /**
     * Initialize Lavenza's configurations with the specified path.
     *
     * With the provided path, we will tell the rest of the code where to look for important files. Projects that
     * inherit Lavenza will need to create relevant files that are needed to use the framework.
     *
     * By default, we get the path to the entrypoint script of the module that called Lavenza.
     */
    static initialize(root = path.dirname(require.main.filename)) {
        return __awaiter(this, void 0, void 0, function* () {
            // Some flavor text for the console.
            yield Morgana_1.Morgana.success(`Initializing (v${Core.version})...`);
            // Path to the Lavenzafile.
            const pathToLavenzafile = `${root}/.lavenza.yml`;
            // Variable to store the path to the framework installation in the module that is calling Lavenza.
            let pathToLavenzaInstallation;
            // Check if the .lavenza.yml file exists at this path.
            if (yield Akechi_1.Akechi.fileExists(`${root}/.lavenza.yml`)) {
                // Set settings values to the class.
                Core.settings = (yield Akechi_1.Akechi.readYamlFile(pathToLavenzafile));
                pathToLavenzaInstallation = `${root}/${Core.settings.root}`;
            }
            else {
                yield Morgana_1.Morgana.warn(`A Lavenzafile could not be located at "${root}". Use the "lavenza init" command to initialize the base config file and set this up.`);
                process.exit(1);
            }
            // So first, we want to check if the provided path exists.
            // We're already going to start making use of our Confidants here! Woo!
            if (!Akechi_1.Akechi.isDirectory(pathToLavenzaInstallation)) {
                yield Morgana_1.Morgana.warn(`The path configured (${pathToLavenzaInstallation}) doesn't lead to a valid Lavenza installation directory.`);
                // Start a prompt to see if user would like to generate a basic Desk.
                yield Morgana_1.Morgana.warn("Would you like to generate an installation at this path?");
                const { confirmation } = yield prompts({
                    initial: true,
                    message: "Yes or no (Y/N) ?",
                    name: "confirmation",
                    type: "confirm",
                });
                // If they agree, copy the basic desk to their desired location.
                if (confirmation) {
                    yield Akechi_1.Akechi.copyFiles(`${arp.path}/templates/installation`, pathToLavenzaInstallation);
                    yield Morgana_1.Morgana.success("An installation has been generated at the provided path. You may configure it and try running Lavenza again!");
                }
                yield Morgana_1.Morgana.error("Until an installation is properly configured, Lavenza will not run properly. Please refer to the guides in the README to configure Lavenza.");
                process.exit(1);
            }
            // Using the provided path, we set the relevant paths to the Core.
            yield Core.setPaths(pathToLavenzaInstallation);
            // Initialize Yoshida's translation options since we'll be using them throughout the application.
            yield Yoshida_1.Yoshida.initializeI18N();
            // If a master isn't set, we shouldn't continue. A master bot must set.
            if (Sojiro_1.Sojiro.isEmpty(Core.settings.config.bots.master)) {
                yield Morgana_1.Morgana.error("There is no master bot set in your Lavenzafile. A master bot must be set so the application knows which bot manages everything!");
                process.exit(1);
            }
            // If a master bot is set but doesn't exist, we shouldn't continue either.
            if (!(yield Akechi_1.Akechi.directoryExists(`${Core.paths.bots}/${Core.settings.config.bots.master}`))) {
                yield Morgana_1.Morgana.error(`The configured master bot (${Core.settings.config.bots.master}) does not exist. Run "lavenza init" or "lavenza generate bot" to fix this.`);
                yield Morgana_1.Morgana.error("It is highly recommended to run \"lavenza init\" to make sure that everything is configured correctly!");
                process.exit(1);
            }
            // Return the core so we can chain functions.
            return Core;
        });
    }
    /**
     * PERSONA!
     *
     * This function starts the application. It runs all of the preparations, then runs the application afterwards.
     *
     * All tasks done in the PREPARATION phase are in the build() function.
     *
     * All tasks done in the EXECUTION phase are in the run() function.
     */
    static summon() {
        return __awaiter(this, void 0, void 0, function* () {
            // If settings aren't set, it means that initialization was bypassed. We can't allow that.
            if (Sojiro_1.Sojiro.isEmpty(Core.settings)) {
                return;
            }
            /*
             * Fire necessary preparations.
             * The application can end here if we hit an error in the build() function.
             */
            yield Core.build()
                .catch(Igor_1.Igor.stop);
            /*
             * If preparations go through without problems, go for run tasks.
             * Run tasks should be done only after all prep is complete.
             */
            yield Core.run()
                .catch(Igor_1.Igor.stop);
            // Some more flavor text.
            yield Morgana_1.Morgana.success("Lavenza should now be running! Scroll up in the logs to see if any errors occurred and handle them as needed. :)");
        });
    }
    /**
     * Run all build tasks.
     *
     * This involves reading and parsing bot files, talent files and command files. Database preparations and instances
     * are also prepared here.
     */
    static build() {
        return __awaiter(this, void 0, void 0, function* () {
            // Some more flavor text.
            yield Morgana_1.Morgana.status("Commencing preparatory tasks!");
            /*
             * Run build handler for the Gestalt service.
             * We need to set up the database first and foremost.
             */
            yield Gestalt_1.Gestalt.build();
            /**
             * Run build functions for the Talent Manager.
             * This will load all talents from the 'talents' folder and prepare them accordingly.
             */
            yield TalentManager_1.TalentManager.build();
            /**
             * Run build functions for the Bot Manager.
             * This will load all bots and prepare their data before they connect to their clients.
             * Each bot may undergo tasks specific to Talents they have.
             */
            yield BotManager_1.BotManager.build();
            /*
             * Run bootstrap handler for Gestalt.
             * Creates & verifies database tables/files.
             */
            yield Gestalt_1.Gestalt.bootstrap();
            // Some more flavor.
            yield Morgana_1.Morgana.success("Preparations complete.");
        });
    }
    /**
     * Application Run phase.
     *
     * All execution tasks are ran here.
     */
    static run() {
        return __awaiter(this, void 0, void 0, function* () {
            // Some more flavor.
            yield Morgana_1.Morgana.status("Commencing execution phase!");
            // Deploy bots from the BotManager.
            // All bots set to run will be online after this executes.
            yield BotManager_1.BotManager.run();
        });
    }
    /**
     * Setup paths and assign them to the Core.
     *
     * @param rootPath
     *   The provided root path to base ourselves on.
     */
    static setPaths(rootPath) {
        return __awaiter(this, void 0, void 0, function* () {
            Core.paths = {
                bots: `${rootPath}/bots`,
                database: `${rootPath}/database`,
                root: rootPath,
                talents: {
                    core: `${arp.path}/core/talents`,
                    custom: `${rootPath}/talents`,
                },
            };
        });
    }
}
exports.Core = Core;
/**
 * Stores Lavenza's version.
 * The version number is obtained from the 'package.json' file at the root of the project.
 */
Core.version = require(`${arp.path}/package`).version;
