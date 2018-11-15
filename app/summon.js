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
 * A few months ago, I decided I wanted to make my best Discord bot in PHP. This
 * quickly changed as I realized that PHP would probably not be the best
 * solution if I planned on making bots that would be compatible with a bunch of
 * different platforms. Javascript (while dirty as f*ck) remains powerful and
 * maintained by way more people. Let's hope I don't regret this decision in the
 * years to come.
 *
 * In any case...I don't even know why I'm writing a preface. Enjoy the code!
 */

// Load Lavenza module.
const Lavenza = require('./');

// Ignite Lavenza...Let's get this going!
Lavenza.ignite();

// const client = new Lavenza.Clients.Discord.Client();
//
// client.on('ready', () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });
//
// client.on('message', msg => {
//   if (msg.content === 'ping') {
//     msg.reply('pong');
//   }
// });
//
// client.login('NTExOTI3ODcxNTk4NzU1ODU1.DsyCQA.aEeQGfgwPAn7Ex8aYA2pSW287DI');
