/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a class that handles input/output to the console & errors.
 *
 * Another name for this could be the LoggerManager.
 *
 * My thought process? Well Morgana talks a lot in P5. So I named my console
 * manager after him. Clever right? Haha!
 *
 * Honestly I just needed an excuse to use their names in my code. And I love it.
 */
export default class Morgana {

  /**
   * Send output to the console.
   *
   * When passed text, this function uses Futaba to manage text with
   * the Dictionary.
   *
   * You can also send a completely custom string. Futaba will simply return
   * the string 'as is' if a corresponding ID isn't found in any dictionaries.
   *
   * @see ./Futaba
   *
   * @param {string} message
   *   The text to send to the console, or in some/most cases the ID of the
   *   string to send. If an ID is sent, text will be fetched from Dictionaries.
   * @param {Array} placeholder_values
   *   If an array of strings is set here, it will be used to replace any
   *   placeholders in the text provided above. Futaba has more information on
   *   this, so peek at her code for more info!
   * @param {string} type
   *   Type of console log to print.
   */
  static log(message, {placeholder_values, type} = {}) {

    // Fetch output interpretation by Futaba.
    let output = Lavenza.Futaba.interpret(message, placeholder_values);

    // Depending on the type, we send different types of outputs.
    switch (type) {

      // Status messages.
      case 'status':
        console.log(output.status);
        break;

      // Warning messages.
      case 'warning':
        console.log(output.warning);
        break;

      // Success messages.
      case 'success':
        console.log(output.success);
        break;

      // Error messages.
      case 'error':
        // Send default error message.
        console.log(Lavenza.Futaba.interpret('ERROR').error);
        console.log(output.error);
        break;

      // By default, do a regular log.
      default:
        console.log(output);
        break;
    }
  }

  /**
   * Shortcut function to send a success message.
   * @inheritDoc
   */
  static success(message, placeholder_values = []) {

    // If the message is not set, we'll fetch the default success message.
    message = message || 'SUCCESS';
    this.log(message, {placeholder_values: placeholder_values, type: 'success'});

  }

  /**
   * Shortcut function to set a status message.
   * @inheritDoc
   */
  static status(message, placeholder_values = []) {
    this.log(message, {placeholder_values: placeholder_values, type: 'status'});
  }

  /**
   * Shortcut function to set a warning message.
   * @inheritDoc
   */
  static warn(message, placeholder_values = []) {
    this.log(message, {placeholder_values: placeholder_values, type: 'warning'});
  }

  /**
   * Shortcut function to set a error message.
   * @inheritDoc
   */
  static error(message, placeholder_values = []) {

    // If the message is not set, we'll fetch the default error message.
    message = message || 'ERROR';
    this.log(message, {placeholder_values: placeholder_values, type: 'error'});

  }

}
