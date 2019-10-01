"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Modules.
const Colors = require("colors");
const DotEnv = require("dotenv");
// Imports.
const BotManager_1 = require("./Lavenza/Bot/BotManager");
const ClientType_1 = require("./Lavenza/Bot/Client/ClientType");
const Command_1 = require("./Lavenza/Bot/Command/Command");
const CommandClientHandler_1 = require("./Lavenza/Bot/Command/CommandClientHandler");
const Listener_1 = require("./Lavenza/Bot/Listener/Listener");
const PromptExceptionType_1 = require("./Lavenza/Bot/Prompt/Exception/PromptExceptionType");
const Resonance_1 = require("./Lavenza/Bot/Resonance/Resonance");
const Akechi_1 = require("./Lavenza/Confidant/Akechi");
const Igor_1 = require("./Lavenza/Confidant/Igor");
const Kawakami_1 = require("./Lavenza/Confidant/Kawakami");
const Morgana_1 = require("./Lavenza/Confidant/Morgana");
const Sojiro_1 = require("./Lavenza/Confidant/Sojiro");
const Yoshida_1 = require("./Lavenza/Confidant/Yoshida");
const Core_1 = require("./Lavenza/Core/Core");
const Gestalt_1 = require("./Lavenza/Gestalt/Gestalt");
const Talent_1 = require("./Lavenza/Talent/Talent");
const TalentManager_1 = require("./Lavenza/Talent/TalentManager");
// Load Environment Variables from .env file at the root of the project.
DotEnv.load();
// Configure colors for console.
// Set console color themes.
/** @see https://www.npmjs.com/package/colors */
Colors.setTheme({
    data: "grey",
    debug: "blue",
    error: "red",
    help: "cyan",
    input: "grey",
    prompt: "grey",
    silly: "rainbow",
    status: "blue",
    success: "cyan",
    verbose: "cyan",
    warning: "yellow",
});
// Enums.
// Define the Heart of the module.
// This is the object that is later set as a global.
const heart = {
    // Lavenza's core.
    // This class is the main handler of the application.
    // There is a clear defined order as to how things are ran in the application. The Core properly outlines this order.
    Core: Core_1.Core,
    initialize: Core_1.Core.initialize,
    summon: Core_1.Core.summon,
    // Confidants.
    // Re-usable functionality is managed in what I'm calling Confidants for this project. Shoutouts to Persona 5!
    // Each confidant has a specific use. See each of their files for more deets.
    // Adding them here for ease of access in other applications.
    Akechi: Akechi_1.Akechi,
    Igor: Igor_1.Igor,
    Kawakami: Kawakami_1.Kawakami,
    Morgana: Morgana_1.Morgana,
    Sojiro: Sojiro_1.Sojiro,
    Yoshida: Yoshida_1.Yoshida,
    // Managers.
    // These classes will manage big parts of the application that are integral.
    BotManager: BotManager_1.BotManager,
    TalentManager: TalentManager_1.TalentManager,
    // Services.
    // Services are similar to Confidants, but are much more intricate.
    // Shoutouts to Nier!
    Gestalt: Gestalt_1.Gestalt,
    // Classes & Models.
    // These are classes that are extended or used across the application. We import them here once.
    // They are linked in the global variable for easy access to outside applications.
    Command: Command_1.Command,
    CommandClientHandler: CommandClientHandler_1.CommandClientHandler,
    Listener: Listener_1.Listener,
    Resonance: Resonance_1.Resonance,
    Talent: Talent_1.Talent,
    // Enums.
    ClientType: ClientType_1.ClientType,
    PromptExceptionType: PromptExceptionType_1.PromptExceptionType,
    // Function shortcuts from Confidants.
    __: Yoshida_1.Yoshida.translate,
    bold: Kawakami_1.Kawakami.bold,
    code: Kawakami_1.Kawakami.code,
    continue: Igor_1.Igor.continue,
    error: Morgana_1.Morgana.error,
    getRandomElementFromArray: Sojiro_1.Sojiro.getRandomElementFromArray,
    isEmpty: Sojiro_1.Sojiro.isEmpty,
    italics: Kawakami_1.Kawakami.italics,
    log: Morgana_1.Morgana.log,
    personalize: Yoshida_1.Yoshida.personalize,
    pocket: Igor_1.Igor.pocket,
    removeFromArray: Sojiro_1.Sojiro.removeFromArray,
    status: Morgana_1.Morgana.status,
    stop: Igor_1.Igor.stop,
    success: Morgana_1.Morgana.success,
    throw: Igor_1.Igor.throw,
    wait: Sojiro_1.Sojiro.wait,
    warn: Morgana_1.Morgana.warn,
};
module.exports = heart;
