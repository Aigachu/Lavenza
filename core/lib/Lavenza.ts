/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as Colors from "colors";
import * as DotEnv from "dotenv";

// Imports.
import { BotManager } from "./Lavenza/Bot/BotManager";
import { ClientType } from "./Lavenza/Bot/Client/ClientType";
import { Command } from "./Lavenza/Bot/Command/Command";
import { CommandClientHandler } from "./Lavenza/Bot/Command/CommandClientHandler";
import { Listener } from "./Lavenza/Bot/Listener/Listener";
import { PromptExceptionType } from "./Lavenza/Bot/Prompt/Exception/PromptExceptionType";
import { Resonance } from "./Lavenza/Bot/Resonance/Resonance";
import { Akechi } from "./Lavenza/Confidant/Akechi";
import { Igor } from "./Lavenza/Confidant/Igor";
import { Kawakami } from "./Lavenza/Confidant/Kawakami";
import { Morgana } from "./Lavenza/Confidant/Morgana";
import { Sojiro } from "./Lavenza/Confidant/Sojiro";
import { Yoshida } from "./Lavenza/Confidant/Yoshida";
import { Core } from "./Lavenza/Core/Core";
import { Gestalt } from "./Lavenza/Gestalt/Gestalt";
import { Talent } from "./Lavenza/Talent/Talent";
import { TalentManager } from "./Lavenza/Talent/TalentManager";

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
const heart: {} = {

  // Lavenza's core.
  // This class is the main handler of the application.
  // There is a clear defined order as to how things are ran in the application. The Core properly outlines this order.
  Core,
  initialize: Core.initialize,
  summon: Core.summon,

  // Confidants.
  // Re-usable functionality is managed in what I'm calling Confidants for this project. Shoutouts to Persona 5!
  // Each confidant has a specific use. See each of their files for more deets.
  // Adding them here for ease of access in other applications.
  Akechi,
  Igor,
  Kawakami,
  Morgana,
  Sojiro,
  Yoshida,

  // Managers.
  // These classes will manage big parts of the application that are integral.
  BotManager,
  TalentManager,

  // Services.
  // Services are similar to Confidants, but are much more intricate.
  // Shoutouts to Nier!
  Gestalt,

  // Classes & Models.
  // These are classes that are extended or used across the application. We import them here once.
  // They are linked in the global variable for easy access to outside applications.
  Command,
  CommandClientHandler,
  Listener,
  Resonance,
  Talent,

  // Enums.
  ClientType,
  PromptExceptionType,

  // Function shortcuts from Confidants.
  __: Yoshida.translate,
  bold: Kawakami.bold,
  code: Kawakami.code,
  continue: Igor.continue,
  error: Morgana.error,
  getRandomElementFromArray: Sojiro.getRandomElementFromArray,
  isEmpty: Sojiro.isEmpty,
  italics: Kawakami.italics,
  log: Morgana.log,
  personalize: Yoshida.personalize,
  pocket: Igor.pocket,
  removeFromArray: Sojiro.removeFromArray,
  status: Morgana.status,
  stop: Igor.stop,
  success: Morgana.success,
  throw: Igor.throw,
  wait: Sojiro.wait,
  warn: Morgana.warn,
};

module.exports = heart;
