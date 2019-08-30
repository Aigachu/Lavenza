/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Load Environment Variables from .env file at the root of the project.
require('dotenv').load();

// Configure colors for console.
// Set console color themes.
/** @see https://www.npmjs.com/package/colors */
require('colors').setTheme({
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

// Confidants.
// They're included up here because we need to access them for helper functions below.
const Akechi = require('./Lavenza/Confidants/Akechi');
const Igor = require('./Lavenza/Confidants/Igor');
const Kawakami = require('./Lavenza/Confidants/Kawakami');
const Makoto = require('./Lavenza/Confidants/Makoto');
const Morgana = require('./Lavenza/Confidants/Morgana');
const Sojiro = require('./Lavenza/Confidants/Sojiro');
const Yoshida = require('./Lavenza/Confidants/Yoshida');

// Define the Heart of the module.
// This is the object that is later set as a global.
module.exports = {

  // Lavenza's core.
  // This class is the main handler of the application.
  // There is a clear defined order as to how things are ran in the application. The Core properly outlines this order.
  Core: require('./Lavenza/Core/Core'),

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
  BotManager: require('./Lavenza/Bot/BotManager'),
  TalentManager: require('./Lavenza/Talent/TalentManager'),

  // Services.
  // Services are similar to Confidants, but are much more intricate.
  // Shoutouts to Nier!
  Gestalt: require('./Lavenza/Gestalt/Gestalt'),

  // Classes & Models.
  // These are classes that are extended or used across the application. We import them here once.
  // They are linked in the global variable for easy access to outside applications.
  Command: require('./Lavenza/Bot/Command/Command'),
  CommandClientHandler: require('./Lavenza/Bot/Command/CommandClientHandler'),
  Talent: require('./Lavenza/Talent/Talent'),
  Listener: require('./Lavenza/Bot/Listener/Listener'),
  Resonance: require('./Lavenza/Bot/Resonance/Resonance'),
  Order: require('./Lavenza/Bot/Order/Order'),

  // Enums.
  ClientTypes: require('./Lavenza/Bot/Client/ClientTypes'),
  PromptExceptionTypes: require('./Lavenza/Bot/Prompt/Exception/PromptExceptionTypes'),

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