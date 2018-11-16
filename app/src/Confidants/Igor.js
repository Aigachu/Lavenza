/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */

// Confidants
const Morgana = require('./Morgana');

/**
 * Provides a class that handles input/output to the console & errors.
 *
 * When you die, you're brought back by Igor...
 *
 * He handles errors in the application.
 */
class Igor {

  static continue(error) {
    Morgana.status(error.message);
    return true;
  }

  static stop(error) {
    Morgana.error(error.message);
    process.exit(1);
  }

}

module.exports = Igor;
