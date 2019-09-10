"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Load Environment Variables from .env file at the root of the project.
const dotenv_1 = require("dotenv");
dotenv_1.default.load();
// Configure colors for console.
// Set console color themes.
/** @see https://www.npmjs.com/package/colors */
const Colors = require("colors");
Colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    success: 'cyan',
    data: 'grey',
    help: 'cyan',
    status: 'blue',
    warning: 'yellow',
    debug: 'blue',
    error: 'red'
});
// Lavenza's core.
// This class is the main handler of the application.
// There is a clear defined order as to how things are ran in the application. The Core properly outlines this order.
const Core_1 = require("./Lavenza/Core/Core");
// Confidants.
// They're included up here because we need to access them for helper functions below.
const Akechi_1 = require("./Lavenza/Confidant/Akechi");
const Igor_1 = require("./Lavenza/Confidant/Igor");
const Kawakami_1 = require("./Lavenza/Confidant/Kawakami");
const Makoto_1 = require("./Lavenza/Confidant/Makoto");
const Morgana_1 = require("./Lavenza/Confidant/Morgana");
const Sojiro_1 = require("./Lavenza/Confidant/Sojiro");
const Yoshida_1 = require("./Lavenza/Confidant/Yoshida");
// Managers.
// These classes will manage big parts of the application that are integral.
const BotManager_1 = require("./Lavenza/Bot/BotManager");
const TalentManager_1 = require("./Lavenza/Talent/TalentManager");
// Services.
// Services are similar to Confidants, but are much more intricate.
// Shoutouts to Nier!
const Gestalt_1 = require("./Lavenza/Gestalt/Gestalt");
// Classes & Models.
// These are classes that are extended or used across the application. We import them here once.
// They are linked in the global variable for easy access to outside applications.
const Command_1 = require("./Lavenza/Bot/Command/Command");
const CommandClientHandler_1 = require("./Lavenza/Bot/Command/CommandClientHandler");
const Talent_1 = require("./Lavenza/Talent/Talent");
const Listener_1 = require("./Lavenza/Bot/Listener/Listener");
const Resonance_1 = require("./Lavenza/Bot/Resonance/Resonance");
// Enums.
const ClientType_1 = require("./Lavenza/Bot/Client/ClientType");
const PromptExceptionType_1 = require("./Lavenza/Bot/Prompt/Exception/PromptExceptionType");
// Define the Heart of the module.
// This is the object that is later set as a global.
exports.default = {
    // Lavenza's core and shortcut to initialization functions.
    Core: Core_1.default,
    init: Core_1.default.init,
    ignite: Core_1.default.ignite,
    // Confidants.
    // Re-usable functionality is managed in what I'm calling Confidants for this project. Shoutouts to Persona 5!
    // Each confidant has a specific use. See each of their files for more deets.
    // Adding them here for ease of access in other applications.
    Akechi: Akechi_1.default,
    Igor: Igor_1.default,
    Kawakami: Kawakami_1.default,
    Makoto: Makoto_1.default,
    Morgana: Morgana_1.default,
    Sojiro: Sojiro_1.default,
    Yoshida: Yoshida_1.default,
    // Managers.
    // These classes will manage big parts of the application that are integral.
    BotManager: BotManager_1.default,
    TalentManager: TalentManager_1.default,
    // Services.
    Gestalt: Gestalt_1.default,
    // Classes & Models.
    Command: Command_1.default,
    CommandClientHandler: CommandClientHandler_1.default,
    Talent: Talent_1.default,
    Listener: Listener_1.default,
    Resonance: Resonance_1.default,
    // Enums.
    ClientTypes: ClientType_1.default,
    PromptExceptionTypes: PromptExceptionType_1.default,
    // Function shortcuts from Confidants.
    __: Yoshida_1.default.translate,
    log: Morgana_1.default.log,
    success: Morgana_1.default.success,
    error: Morgana_1.default.error,
    warn: Morgana_1.default.warn,
    status: Morgana_1.default.status,
    throw: Igor_1.default.throw,
    stop: Igor_1.default.stop,
    continue: Igor_1.default.continue,
    pocket: Igor_1.default.pocket,
    isEmpty: Sojiro_1.default.isEmpty,
    getRandomElementFromArray: Sojiro_1.default.getRandomElementFromArray,
    removeFromArray: Sojiro_1.default.removeFromArray,
    wait: Sojiro_1.default.wait,
    bold: Kawakami_1.default.bold,
    italics: Kawakami_1.default.italics,
    code: Kawakami_1.default.code,
    personalize: Yoshida_1.default.getPersonalization,
};
