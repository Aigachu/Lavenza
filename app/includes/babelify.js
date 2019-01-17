/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * @file babelify.js
 *   Handles compiling the code to natural Javascript using Babel.
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * This file is used to run the application.
 *
 * Why are we using this instead of running 'summon.js' by itself?
 *
 * We're being a little elitist in our code and getting a head start at writing everything in ES6.
 *
 * NodeJS is not quite ready for ES6 yet...So we have to run this code here that will compile all of our ES6 code into
 * CommonJS code.
 *
 * That's it!
 */

// Load CLI arguments.
let argv = require('minimist')(process.argv.slice(2));

// Babelify if the argument is given.
if ('babel' in argv) {
  // Transpile all imported code following this line with babel and use 'env' (aka ES6) preset.
  require('babel-register')({
    presets: [ ["env", { "targets": { "node": "current" } }] ]
  });

  // Require Babel Polyfill.
  require("babel-polyfill");
}