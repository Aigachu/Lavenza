/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */

// Confidants.
const Futaba = require('./Futaba');

/**
 * Provides a class that handles input/output to the console & errors.
 *
 * My thought process? Well Morgana talks a lot in P5. So I named my console
 * manager after him. Clever right?
 *
 * Honestly I just needed an excuse to use their names in my code. I love it.
 */
class Morgana {

  /**
   * Send output to the console.
   *
   * This uses Futaba to manage text with Dictionaries.
   *
   * You can also send a completely custom string. Futaba will simply return
   * the string as is if a corresponding ID isn't found in any dictionaries.
   *
   * @see ./Futaba
   *
   * @param text
   *   The text to send to the console, or in some/most cases the ID of the
   *   string to send. If an ID is sent, text will be fetched from Dictionaries.
   * @param placeholders
   *   If an array of strings is set here, it will be used to replace any
   *   placeholders in the text provided above. Futaba has more information on
   *   this, so peek at her code for more info!
   * @param format
   *   Customize console formatting.
   */
  static io(text, placeholders = []) {

    // Output the text, interpreted by Futaba, to the console.
    console.log(Futaba.interpret(text, placeholders));
  }

  /**
   * Shortcut function to send a success message to the console.
   *
   * The SUCCESS key in the Dictionary has many options. It chooses one of them
   * randomly.
   */
  static success() {
    console.log(Futaba.interpret('SUCCESS').info);
  }

  /**
   * Throws a status to the console.
   *
   * @param text
   *   Text to send to the console.
   * @param placeholders
   *   If an array of strings is set here, it will be used to replace any
   *   placeholders in the text provided above. Futaba has more information on
   *   this, so peek at her code for more info!
   */
  static status(text, placeholders = []) {
    console.log(Futaba.interpret(text, placeholders).status);
  }

  /**
   * Throws an error to the console.
   *
   * If an error level higher than 2 is provided, the application will exit.
   *
   * @param level
   *   Error level of the error being thrown.
   * @param text
   *   Text to send to the console.
   * @param placeholders
   *   If an array of strings is set here, it will be used to replace any
   *   placeholders in the text provided above. Futaba has more information on
   *   this, so peek at her code for more info!
   */
  static error(level, text, placeholders = []) {

    // Send appropriate error message using the level.
    console.log(Futaba.interpret('ERROR_LEVEL_' + level).error);
    // Send error details.
    console.log(Futaba.interpret(text, placeholders).error);

    // If the error level is higher than 2, we must exit the application.
    // Let's try to avoid this, shall we?
    if (level > 2) {
      this.io('DECLARE_EXIT');
      process.exit(1);
    }
  }

}

module.exports = Morgana;
