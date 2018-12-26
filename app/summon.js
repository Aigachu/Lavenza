/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 *
 * {Preface}
 * Hi! The name's Aigachu. You may or may not know me. But that's unimportant.
 *
 * I've made many bots over the last few years. Many of which were dirty, code
 * wise. This project is sort of a...Battle. A personal battle to make a clean,
 * fun application. Hopefully I can look back at this code in
 * a few years and not cringe or fight back puke. But chances are I will!
 *
 * My goal with this project is to make bot development easy and scalable.
 * I also want to be proud of a project and see it to the end for once...
 *
 * Let's see how far I get with this one!
 *
 * A few months ago, I decided I wanted to make my best Discord bot in PHP. This
 * quickly changed as I realized that PHP would probably not be the best
 * solution if I planned on making bots that would be compatible with a bunch of
 * different platforms.
 *
 * In any case...I don't even know why I'm writing a preface. Enjoy the code!
 */

// Includes Babelify.
// This file will use Babel to compile all of our ES6 code into code that NodeJS can run properly.
// Since we want a head start on ES6, we use this.
require('./includes/babelify');

// Load CLI arguments.
let argv = require('minimist')(process.argv.slice(2));

// If the bots are added in the arguments, we get them here.e
let bots = undefined;
if ('bot' in argv) {
  bots = [argv['bot']];
}

// Load Lavenza module.
/** @see ./src/Heart.js */
const Lavenza = require('./').Heart.Core;

// Ignite Lavenza...Let's get this going!
Lavenza.ignite(bots).then(() => {
  console.log('Lavenza is now running!'.status);
}).catch(error => {
  console.error(error);
});
