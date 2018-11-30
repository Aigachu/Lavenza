/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a class to manage Signatures.
 *
 * Signatures can be seen as a unique ID to refer to a particular element of the application.
 *
 * We generate signatures for easy tracking of elements that belong to a particular object.
 *
 * The best way to understand Signatures is to see them in use.
 *
 * i.e. 'bot.lavenza' or 'talent.pingpong'
 */
export default class Signature {

  /**
   * Generate a signature given a list of strings.
   *
   * @returns {string}
   *   Returns the provided strings in a '.' notation format.
   */
  static sign() {

    // Convert all arguments to array.
    let texts = [];
    for (let i = 0; i < arguments.length; ++i) texts[i] = arguments[i];

    // Initialize the string.
    let signature = '';

    // Append all the strings, separated by ".".
    let last = texts[texts.length - 1];
    texts.every(text => {
      signature += text;
      if (text !== last) {
        signature += '.';
      }
      return true;
    });

    // Return the signature from the function call.
    return signature;
  }
}