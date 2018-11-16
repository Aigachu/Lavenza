/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 *
 * {Preface}
 * Hi! The name's Aigachu. You may or may not know me. But that's unimportant.
 *
 * I've made many bots over the last few years. Many of which were dirty, code
 * wise. This project is sort of a...Battle. A personal battle to make a clean,
 * fun installation of a Discord bot. Hopefully I can look back at this code in
 * a few years and not cringe or fight back puke.
 *
 * My goal with this project is to make bot development easy for many services.
 * I also want to be proud of a project and see it to the end for once...
 *
 * Let's see how far I get with this one!
 *
 * A few months ago, I decided I wanted to make my best Discord bot in PHP. This
 * quickly changed as I realized that PHP would probably not be the best
 * solution if I planned on making bots that would be compatible with a bunch of
 * different platforms. Javascript (while dirty as f*ck) remains powerful and
 * maintained by way more people. Let's hope I don't regret this decision in the
 * years to come.
 *
 * In any case...I don't even know why I'm writing a preface. Enjoy the code!
 */

// Load Environment Variables.
// Instead of putting this in a later folder, I'd rather load this now.
// This may change in the future.
require('dotenv').load();

// Load Lavenza module.
const Lavenza = require('./');

// Ignite Lavenza...Let's get this going!
Lavenza.ignite().then(() => {
  console.log('Lavenza is now running!'.status);
}).catch(error => {
  console.error(error);
});
