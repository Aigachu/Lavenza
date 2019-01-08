/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * @file summon.js
 *   Handles execution of the application.
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Includes Babelify.
// This file will use Babel to compile all of our ES6 code into code that NodeJS can run properly.
// Since we want a head start on ES6, we use this! NodeJS is not fully compatible with ES6 quite yet.
require('./includes/babelify');

// Load CLI arguments.
let argv = require('minimist')(process.argv.slice(2));

// If a bot is added in the arguments, we get it here.
let bot = undefined;
if ('bot' in argv) {
  bot = argv['bot'];
}

// Load Lavenza module's core.
/** @see ./src/Heart.js */
const Lavenza = require('./').Heart;

// Ignite Lavenza...Let's get this going!
Lavenza.Core.ignite(bot).then(() => {
  Lavenza.warn('Lavenza is now running!');
}).catch(error => {
  Lavenza.error(error);
});
