/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Yoshida from './Yoshida';

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
   * @param message
   *   The text to send to the console, or in some/most cases the ID of the
   *   string to send. If an ID is sent, text will be fetched from Dictionaries.
   * @param replacers
   *   If an object of strings is set here, it will be used to replace any
   *   placeholders in the text provided above.
   * @param type
   *   Type of console log to print.
   * @param locale
   *   Set the locale to determine the language.
   */
  static async log(message: string, replacers: Object = undefined, type: string = 'default', locale: string = process.env.DEFAULT_LOCALE) {
    // Fetch translations of output.
    let output = await Yoshida.translate(message, replacers, locale);

    // Depending on the type, we send different types of outputs.
    switch (type) {
      // Status messages.
      case 'status': {
        console.log(output.status);
        break;
      }

      // Warning messages.
      case 'warning': {
        console.log(output.warning);
        break;
      }

      // Success messages.
      case 'success': {
        console.log(output.success);
        break;
      }

      // Error messages.
      case 'error': {
        // Send default error message.
        console.log(output.error);
        break;
      }

      // By default, do a regular log.
      default: {
        console.log(output);
        break;
      }
    }
  }

  /**
   * Shortcut function to send a success message.
   * @inheritDoc
   */
  static async success(message: string, replacers: Object = undefined) {
    // If the message is not set, we'll fetch the default success message.
    message = message || 'SUCCESS';
    await this.log(message, replacers,'success');
  }

  /**
   * Shortcut function to set a status message.
   * @inheritDoc
   */
  static async status(message: string, replacers: Object = undefined) {
    await this.log(message, replacers, 'status');
  }

  /**
   * Shortcut function to set a warning message.
   * @inheritDoc
   */
  static async warn(message: string, replacers: Object = undefined) {
    await this.log(message, replacers, 'warning');
  }

  /**
   * Shortcut function to set a error message.
   * @inheritDoc
   */
  static async error(message: string, replacers: Object = undefined) {
    // If the message is not set, we'll fetch the default error message.
    message = message || 'ERROR';
    await this.log(message, replacers, 'error');
  }

}
