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
   * When passed text, this function uses Futaba to manage text with
   * Dictionaries.
   *
   * You can also send a completely custom string. Futaba will simply return
   * the string as is if a corresponding ID isn't found in any dictionaries.
   *
   * @see ./Futaba
   *
   * @param message
   *   The text to send to the console, or in some/most cases the ID of the
   *   string to send. If an ID is sent, text will be fetched from Dictionaries.
   * @param placeholder_values
   *   If an array of strings is set here, it will be used to replace any
   *   placeholders in the text provided above. Futaba has more information on
   *   this, so peek at her code for more info!
   * @param type
   *   Type of console log to print.
   */
  static log(message, {placeholder_values, type} = {}) {

    // Fetch output interpretation by Futaba.
    let output = Futaba.interpret(message, placeholder_values);

    switch (type) {

      case 'status':
        console.log(output.status);
        break;

      case 'success':
        console.log(Futaba.interpret('SUCCESS').info);
        break;

      case 'error':
        console.log(Futaba.interpret('ERROR').error);
        console.log(output.error);
        break;

      default:
        console.log(output);
        break;
    }
  }

  /**
   * Shortcut to set a success message.
   * @inheritdoc
   */
  static success(message = 'SUCCESS', placeholder_values = []) {
    this.log(message, {placeholder_values: placeholder_values, type: 'success'});
  }

  /**
   * Shortcut to set a status message.
   * @inheritdoc
   */
  static status(message, placeholder_values = []) {
    this.log(message, {placeholder_values: placeholder_values, type: 'status'});
  }

  /**
   * Shortcut to set a error message.
   * @inheritdoc
   */
  static error(message = 'ERROR', placeholder_values = []) {
    this.log(message, {placeholder_values: placeholder_values, type: 'error'});
  }

}

module.exports = Morgana;
