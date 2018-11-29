/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a class that handles input/output to the console & errors.
 *
 * Another name for this could be the ErrorManager.
 *
 * When you die, you're brought back by Igor...
 *
 * He handles errors in the application.
 */
export default class Igor {

  static pocket(error) {
    // Do nothing. This quietly ignores the error.
    // If you use this, you should at least send a warning in the console describing what happened.
  }

  static continue(error) {
    Lavenza.Morgana.warn(error.message);
    return true;
  }

  static stop(error) {
    Lavenza.Morgana.error(error.message);
    console.error(error);
    process.exit(1);
  }

  static throw(error, placeholder_values = []) {
    let output = Lavenza.Futaba.interpret(error, placeholder_values);
    throw new Error(output);
  }

}