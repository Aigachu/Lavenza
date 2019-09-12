/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Load Environment Variables from .env file at the root of the project.
import * as DotEnv from 'dotenv';
DotEnv.load();

// Configure colors for console.
// Set console color themes.
/** @see https://www.npmjs.com/package/colors */
import * as Colors from 'colors';
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
import Core from './Lavenza/Core/Core';

// Confidants.
// They're included up here because we need to access them for helper functions below.
import Akechi from './Lavenza/Confidant/Akechi';
import Igor from './Lavenza/Confidant/Igor';
import Kawakami from './Lavenza/Confidant/Kawakami';
import Makoto from './Lavenza/Confidant/Makoto';
import Morgana from './Lavenza/Confidant/Morgana';
import Sojiro from './Lavenza/Confidant/Sojiro';
import Yoshida from './Lavenza/Confidant/Yoshida';

// Managers.
// These classes will manage big parts of the application that are integral.
import BotManager from './Lavenza/Bot/BotManager';
import TalentManager from './Lavenza/Talent/TalentManager';

// Services.
// Services are similar to Confidants, but are much more intricate.
// Shoutouts to Nier!
import Gestalt from './Lavenza/Gestalt/Gestalt';

// Classes & Models.
// These are classes that are extended or used across the application. We import them here once.
// They are linked in the global variable for easy access to outside applications.
import Command from './Lavenza/Bot/Command/Command';
import CommandClientHandler from './Lavenza/Bot/Command/CommandClientHandler';
import Talent from './Lavenza/Talent/Talent';
import Listener from './Lavenza/Bot/Listener/Listener';
import Resonance from './Lavenza/Bot/Resonance/Resonance';

// Enums.
import ClientType from './Lavenza/Bot/Client/ClientType';
import PromptExceptionTypes from './Lavenza/Bot/Prompt/Exception/PromptExceptionType';

// Define the Heart of the module.
// This is the object that is later set as a global.
const Heart = {
  // Lavenza's core and shortcut to initialization functions.
  Core: Core,
  initialize: Core.initialize,
  summon: Core.summon,

  // Confidants.
  // Re-usable functionality is managed in what I'm calling Confidants for this project. Shoutouts to Persona 5!
  // Each confidant has a specific use. See each of their files for more deets.
  // Adding them here for ease of access in other applications.
  Akechi: Akechi,
  Igor: Igor,
  Kawakami: Kawakami,
  Makoto: Makoto,
  Morgana: Morgana,
  Sojiro: Sojiro,
  Yoshida: Yoshida,

  // Managers.
  // These classes will manage big parts of the application that are integral.
  BotManager: BotManager,
  TalentManager: TalentManager,

  // Services.
  Gestalt: Gestalt,

  // Classes & Models.
  Command: Command,
  CommandClientHandler: CommandClientHandler,
  Talent: Talent,
  Listener: Listener,
  Resonance: Resonance,

  // Enums.
  ClientTypes: ClientType,
  PromptExceptionTypes: PromptExceptionTypes,

  // Function shortcuts from Confidants.
  __: Yoshida.translate,
  log: Morgana.log,
  success: Morgana.success,
  error: Morgana.error,
  warn: Morgana.warn,
  status: Morgana.status,
  throw: Igor.throw,
  stop: Igor.stop,
  continue: Igor.continue,
  pocket: Igor.pocket,
  isEmpty: Sojiro.isEmpty,
  getRandomElementFromArray: Sojiro.getRandomElementFromArray,
  removeFromArray: Sojiro.removeFromArray,
  wait: Sojiro.wait,
  bold: Kawakami.bold,
  italics: Kawakami.italics,
  code: Kawakami.code,
  personalize: Yoshida.getPersonalization,
};

module.exports = Heart;