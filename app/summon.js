/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * @file summon.js
 *   Handles execution of the application.
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Compile all of our ES6 code into code that NodeJS can run properly.
// Since we want a head start on ES6, we use this! NodeJS is not fully compatible with ES6 quite yet.
// Transpile all imported code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
  presets: [ ["env", { "targets": { "node": "current" } }] ]
});

// Require Babel Polyfill.
require("babel-polyfill");

// Load Lavenza module's core.
/** @see ./src/Heart.js */
const Lavenza = require('./').Heart;

// Ignite Lavenza...Let's get this going!
Lavenza.Core.ignite().then(async () => {
  await Lavenza.warn('Lavenza is now running!');
}).catch(Lavenza.stop);
