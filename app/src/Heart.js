/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * This is the entry point for the application.
 * Everything in here will be stored in an export called "Heart", and placed in a global called "Lavenza"
 * that is accessible across the application. This makes development a lot easier and prevents us from having
 * to import a lot of classes across the code.
 */

// Include extensions to Javascript.
// See the file for more deets.
import './Extensions';

// Register module alias paths.
// This allows our code to resolve paths to modules that reside in specific folders, instead of solely node_modules.
// Better organization overall.
import 'module-alias/register';

// Load Environment Variables from .env file at the root of the project.
import DotEnv from 'dotenv';
DotEnv.load();

// Modules.
import arp from 'app-root-path';
import colors from 'colors';

// Lavenza's core.
// This class is the main handler of the application.
// This is where the wonderful ignite() function is, as well as the rest of the bootstrapping.
import Core from './Core/Core';

// Confidants.
// Re-usable functionality is managed in what I'm calling Confidants for this project. Shoutouts to Persona 5!
// Each confidant has a specific use. See each of their files for more deets.
import Akechi from './Confidants/Akechi';
import Futaba from'./Confidants/Futaba';
import Igor from './Confidants/Igor';
import Morgana from './Confidants/Morgana';
import Sojiro from './Confidants/Sojiro';

// Classes & Models.
// These are classes that are extended or used across the application. We import them here once.
// They are linked in the global for easy access.
import Command from './Bot/Command/Command';
import Talent from './Talent/Talent';
import Listener from './Bot/Listener/Listener';
import Resonance from './Model/Resonance';
import Order from './Model/Order';


// Configure colors for console.
// Set console color themes.
/** @see https://www.npmjs.com/package/colors */
colors.setTheme({
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

// Utility.
let RootPath = arp.path;
let Keys = {
  // Core functionality folders name.
  CORE_FUNCTIONALITY_FOLDER_NAME: 'Core',

  // The name of the bot config file the application will search for.
  BOT_CONFIG_FILE_NAME: 'config.yml',

  // The name of the folder containing the different bots.
  BOT_FOLDER_NAME: 'bots',

  // The name of the folder containing talents.
  TALENTS_FOLDER_NAME: 'talents',
};

// Define the Heart of the module.
// This is the object that is later set as a global.
const Heart = {
  // Core Lavenza Class.
  Lavenza: Core,

  // Confidants.
  Akechi: Akechi,
  Futaba: Futaba,
  Igor: Igor,
  Morgana: Morgana,
  Sojiro: Sojiro,

  // Models.
  Command: Command,
  Talent: Talent,
  Listener: Listener,
  Resonance: Resonance,
  Order: Order,

  // Function shortcuts for Confidants.
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

  // Keys.
  Keys: Keys,

  // Shortcuts to important paths.
  Paths: {
    ROOT: RootPath,
    CORE: RootPath + '/src' + '/' + Keys.CORE_FUNCTIONALITY_FOLDER_NAME,
    BOTS: RootPath + '/' + Keys.BOT_FOLDER_NAME,
    TALENTS: {
      CORE: RootPath + '/src' + '/' + Keys.CORE_FUNCTIONALITY_FOLDER_NAME + '/' + Keys.TALENTS_FOLDER_NAME,
      CUSTOM: RootPath + '/' + Keys.TALENTS_FOLDER_NAME
    },
  },
};

// Set Lavenza in the global scope for ease of access in other files.
global['Lavenza'] = Heart;

// Exports.
export default Heart;