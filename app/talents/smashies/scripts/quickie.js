/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * This is a little script I made because there was no way I was going to manually download 600 pictures of the smash
 * cast.
 *
 * Thank you, Warchamp, for having these pics neatly organized on your web app!
 */

// Transpile all imported code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
  presets: [ ["env", { "targets": { "node": "current" } }] ]
});

// Require Babel Polyfill.
require("babel-polyfill");

let https = require('https');
let fs = require('fs');
let path = require('path');
let Akechi = require("../../../src/Confidants/Akechi").default;

Akechi.getDirectoriesFrom('./').then(result => {
  console.log(result);
  result.every(character => {
    let lowercase = character.toLowerCase();

    for (let i = 0; i < 8; i++) {
      let request = https.get(`https://apps.warchamp7.com/smash/rosterUlt/ult/chara_1_${lowercase}_0${i}.png`, function(response) {
        if (response) {
          if (!fs.existsSync(`./${character}/chara_1_${lowercase}_0${i}.png`)) {
            let file = fs.createWriteStream(`./${character}/chara_1_${lowercase}_0${i}.png`);
            // console.log(`https://apps.warchamp7.com/smash/rosterUlt/ult/chara_1_${lowercase}_0${i}.png`);
            response.pipe(file);
          }
        }
      });
    }

    return true;
  });
});

