/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */

// Get all globals that are used across the application.
// We wanna manage all of them in one place for organization!
require('./Util/Globals');

// Get extensions.
// We manage all extensions to core prototypes in this file.
require('./Util/Extensions');

// Includes for various namespaces & objects.
const BotBunker = require('./Bot/BotBunker');

// Confidants.
const Morgana = require('./Confidants/Morgana');

/**
 * Provides class for the core of the Lavenza application.
 *
 * Most of the core business happens here, though specified features will be
 * properly divided into respective classes. We're going for full-blown OOP
 * here. Let's try to make, and KEEP, this clean now!
 *
 * Lavenza hates dirty code. ;)
 */
class Lavenza {

  // Lavenza's Version.
  // Remember to increment this you bean!
  static get version() {
    return '0.0.1';
  }

  /**
   * Function that starts it all!
   *
   * That's why it's called ignite...
   *
   * This function simply handles all preparation and launching, though as you
   * can probably see, there isn't much going on here...
   *
   * We simply like to remain clean and continue to separate things properly.
   */
  static ignite() {

    Packages.colors.setTheme({
      custom: [],
    });

    // Some flavor text for the console.
    Morgana.status('INITIALIZING', [this.version]);

    // Fire necessary preparations.
    // The application can end here if we hit an error in the prep function.
    this.prepare();

    // If preparations go through without problems, go for run tasks.
    // Run tasks should be done only after all prep is complete.
    this.run();

  }

  /**
   * Run all necessary software.
   */
  static run() {

  }

  /**
   * Make all necessary preparations before the application can run properly.
   *
   * This function should return a promise to make for some proper synchronous
   * execution. We don't want Lavenza doing run() before/while this executes.
   */
  static prepare() {

    // Some more flavor.
    Morgana.status('BEGINNING_PREP');

    // Run Bot Bunker deploy functions.
    BotBunker.prepare();

  }

}

module.exports = Lavenza;
