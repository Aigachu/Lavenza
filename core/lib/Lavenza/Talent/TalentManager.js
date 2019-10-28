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
const fs = require("fs");
// Imports.
const Akechi_1 = require("../Confidant/Akechi");
const Igor_1 = require("../Confidant/Igor");
const Morgana_1 = require("../Confidant/Morgana");
const Sojiro_1 = require("../Confidant/Sojiro");
const Core_1 = require("../Core/Core");
const Gestalt_1 = require("../Gestalt/Gestalt");
/**
 * Provides a Manager for Talents.
 *
 * This is a STATIC CLASS and will never be instantiated.
 *
 * 'Talents', in the context of this application, are bundles of functionality that can be granted to any bot.
 *
 * Think of talents as..."Plugins" from Wordpress, or "Modules" from Drupal, or "Packages" from Laravel.
 *
 * The idea here is that bot features are coded in their own folders. The power here comes from the flexibility we have
 * since talents can be granted to multiple bots, and talents can be tracked in separate repositories if needed. Also,
 * they can easily be toggled on and off.
 *
 * Decoupling the features from the bots seemed like a good move.
 *
 * This Manager will load necessary talents, and make them available in the bots.
 */
class TalentManager {
    /**
     * Build handler for the TalentManager.
     *
     * This function will run all necessary preparations for this manager before it can be used.
     */
    // @TODO - Following Can be be removed if we add something to this build function and use it.
    // tslint:disable-next-line:no-async-without-await
    static build() {
        return __awaiter(this, void 0, void 0, function* () {
            // Do nothing...For now!
        });
    }
    /**
     * Perform bootstrapping tasks for Database for all talents.
     */
    static gestalt() {
        return __awaiter(this, void 0, void 0, function* () {
            // Some flavor.
            yield Morgana_1.Morgana.status("Running Gestalt bootstrap process for the Talent Manager...");
            // Creation of the Talents collection.
            yield Gestalt_1.Gestalt.createCollection("/talents");
            // Run Gestalt handlers for each Talent.
            yield Promise.all(Object.keys(TalentManager.talents)
                .map((machineName) => __awaiter(this, void 0, void 0, function* () {
                const talent = yield TalentManager.getTalent(machineName);
                yield talent.gestalt();
            })));
            // Some flavor.
            yield Morgana_1.Morgana.status("Gestalt bootstrap process complete for the Talent Manager!");
        });
    }
    /**
     * Retrieve a Talent from the manager.
     *
     * @param machineName
     *   Machine name of the Talent we want to retrieve.
     *
     * @return
     *   The Talent Class of the requested talent.
     */
    static getTalent(machineName) {
        return __awaiter(this, void 0, void 0, function* () {
            return TalentManager.talents[machineName];
        });
    }
    /**
     * Load a single talent into the TalentManager.
     *
     * With the given directory path, we parse the 'config.yml' file and load the Talent class.
     *
     * @param name
     *   The identifier of the talent that we want to load. As per standards, it shares the name of the directory of the
     *   Talent that will be loaded.
     */
    static loadTalent(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the talent exists and return the path if it does.
            const talentDirectoryPath = yield TalentManager.getTalentPath(name);
            // If this directory doesn't exist, we end right off the bat.
            if (!talentDirectoryPath) {
                yield Igor_1.Igor.throw("Attempted to load {{talent}} talent, but it does not exist.", { talent: name });
            }
            // Get the info file for the talent.
            const configFilePath = `${talentDirectoryPath}/config.yml`;
            const config = yield Akechi_1.Akechi.readYamlFile(configFilePath)
                .catch(Igor_1.Igor.continue);
            // If the info is empty, we gotta stop here. They are mandatory.
            if (Sojiro_1.Sojiro.isEmpty(config)) {
                yield Igor_1.Igor.throw("Configuration file could not be located for the {{talent}} talent.", { talent: name });
            }
            // Set the directory to the info. It's useful information to have in the Talent itself!
            config.directory = talentDirectoryPath;
            // Require the class and instantiate the Talent.
            let talent = yield Promise.resolve().then(() => require(`${talentDirectoryPath}/${config.class}`));
            talent = new talent[config.class]();
            // If the talent could not be loaded somehow, we end here.
            if (!talent) {
                yield Igor_1.Igor.throw("An error occurred when requiring the {{talent}} talent's class. Verify the Talent's info file.", { talent: name });
            }
            // Await building of the talent.
            // Talents have build tasks too that must be done asynchronously. We'll run them here.
            yield talent.build(config);
            // Register the talent to the Manager for future use.
            TalentManager.talents[name] = talent;
        });
    }
    /**
     * Get the path to a Talent's folder given a unique key.
     *
     * This function will check the core talents directory first, and then check the custom talents directory afterwards.
     *
     * @param name
     *   The name of the talent. This name is the unique identifier of the Talent, and all in lowercase.
     *   As per standards, it will also be the name of the directory of this Talent.
     *
     * @returns
     *   The path to the talent if found, undefined otherwise.
     */
    static getTalentPath(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Talents can either be provided by the Core framework, or custom-made.
            // First we check if this talent exists in the core directory.
            // Compute the path to the talent, should it exist in the core directory.
            const pathToCoreTalent = `${Core_1.Core.paths.talents.core}/${name}`;
            // If this directory exists, we can return with the path to it.
            if (fs.existsSync(pathToCoreTalent)) {
                return pathToCoreTalent;
            }
            // If we reach here, this means the talent was not found in the core directory.
            // Compute the path to the talent, should it exist in the custom directory.
            const pathToCustomTalent = `${Core_1.Core.paths.talents.custom}/${name}`;
            // If this directory exists, we can return with the path to it.
            if (fs.existsSync(pathToCustomTalent)) {
                return pathToCustomTalent;
            }
            // If the talent was not found, we return undefined.
            return undefined;
        });
    }
}
exports.TalentManager = TalentManager;
/**
 * Object to store the list of talents in the application.
 */
TalentManager.talents = {};
