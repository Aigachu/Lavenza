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
const Colors = require("colors");
const DotEnv = require("dotenv");
const path = require("path");
// Imports.
const BotManager_1 = require("./Lavenza/Bot/BotManager");
exports.BotManager = BotManager_1.BotManager;
const ClientType_1 = require("./Lavenza/Bot/Client/ClientType");
exports.ClientType = ClientType_1.ClientType;
const Command_1 = require("./Lavenza/Bot/Command/Command");
exports.Command = Command_1.Command;
const CommandClientHandler_1 = require("./Lavenza/Bot/Command/CommandClientHandler");
exports.CommandClientHandler = CommandClientHandler_1.CommandClientHandler;
const Listener_1 = require("./Lavenza/Bot/Listener/Listener");
exports.Listener = Listener_1.Listener;
const PromptExceptionType_1 = require("./Lavenza/Bot/Prompt/Exception/PromptExceptionType");
exports.PromptExceptionType = PromptExceptionType_1.PromptExceptionType;
const Resonance_1 = require("./Lavenza/Bot/Resonance/Resonance");
exports.Resonance = Resonance_1.Resonance;
const Akechi_1 = require("./Lavenza/Confidant/Akechi");
exports.Akechi = Akechi_1.Akechi;
const Igor_1 = require("./Lavenza/Confidant/Igor");
exports.Igor = Igor_1.Igor;
const Kawakami_1 = require("./Lavenza/Confidant/Kawakami");
exports.Kawakami = Kawakami_1.Kawakami;
const Morgana_1 = require("./Lavenza/Confidant/Morgana");
exports.Morgana = Morgana_1.Morgana;
const Sojiro_1 = require("./Lavenza/Confidant/Sojiro");
exports.Sojiro = Sojiro_1.Sojiro;
const Yoshida_1 = require("./Lavenza/Confidant/Yoshida");
exports.Yoshida = Yoshida_1.Yoshida;
const Core_1 = require("./Lavenza/Core/Core");
exports.Core = Core_1.Core;
const Gestalt_1 = require("./Lavenza/Gestalt/Gestalt");
exports.Gestalt = Gestalt_1.Gestalt;
const Talent_1 = require("./Lavenza/Talent/Talent");
exports.Talent = Talent_1.Talent;
const TalentManager_1 = require("./Lavenza/Talent/TalentManager");
exports.TalentManager = TalentManager_1.TalentManager;
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
// Utility functions.
exports.initialize = (root = path.dirname(require.main.filename)) => __awaiter(void 0, void 0, void 0, function* () { return Core_1.Core.initialize(root); });
exports.summon = () => __awaiter(void 0, void 0, void 0, function* () { return Core_1.Core.summon(); });
exports.__ = (...parameters) => __awaiter(void 0, void 0, void 0, function* () { return Yoshida_1.Yoshida.translate(parameters); });
