/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import _ from 'underscore';
import i18n from "i18n";

/**
 * Provides a class that handles input/output to the console & errors.
 *
 * Another name for this could be the HelperManager.
 *
 * So Sojiro basically housed us and provided us with the essentials to live in Persona 5.
 *
 * Here, he's providing us with the utilities to make our life easier.
 *
 * Thanks Daddy Sojiro!
 */
export default class Sojiro {

  /**
   * Parse parameters passed to a function that takes an i18n format.
   *
   * Functions that involve sending text to places usually take on similar formats and must parse their parameters
   * in a specific way. These functions should be flexible enough to allow for many different ways to use them.
   *
   * @param {Array} parameters
   *   Parameters to parse from the i18n __ call. Parameters can be passed to __ in different ways.
   *   The idea is that whatever is passed her needs to properly be sent to the __ function in the i18n module. You can
   *   either send only text, send texts with replacements, send text with replacements and a specific locale or send
   *   text without replacements but with a specific locale.
   *
   *   Let's be real, I just want to avoid passing 'undefined' as a parameter, and I also want to avoid having to
   *   deconstruct my parameters into objects every time I translate a string.
   *
   *   Examples below.
   *   i.e. __({phrase: "Hello {{name}}", locale: "en"}, {name: 'Kyle'}
   *   i.e. __("Hello {{name}}", {name: 'Kyle'}, 'en')
   *   i.e. __("Hello", 'en')
   *   i.e. __("Hello")
   *
   * @return {*}
   *   Object containing all information necessary to translate a string.
   */
  static async parseI18NParams(parameters) {

    // If for some reason we receive parameters that are already parsed, simply return them.
    // @TODO - Not sure how to feel about this one. We'll most likely refactor this in the future.
    if ('PARSED' in parameters) {
      return parameters;
    }

    // Declare our variable to be returned.
    let parsed = {
      phrase: undefined,
      locale: undefined,
      replacers: undefined,
      tag: undefined,
    };

    // If no parameters are passed, we can't really do much.
    if (parameters === undefined) {
      return undefined;
    }

    // If it's called with an object as the parameter.
    // i.e. __({phrase: "Hello {{name}}", locale: "en", tag: "PING_RESPONSE"}, {name: 'Kyle'}
    if (typeof parameters[0] === 'object') {

      // Parse parameters.
      parsed.phrase = parameters[0].phrase;
      parsed.locale = parameters[0].locale;
      parsed.replacers = parameters[1] || undefined;
      parsed.tag = parameters[0].tag;

      return parsed;
    }

    // If it's called with a string as the parameter.
    // i.e. __("Hello {{name}}", {name: 'Kyle'}, 'en', 'PING_RESPONSE')
    // i.e. __("Hello", 'en', 'PING_RESPONSE')
    if (typeof parameters[0] === 'string') {

      // Parse parameters.
      parsed.phrase = parameters[0];

      // If a second parameter is set and is not undefined.
      if (parameters[1] !== undefined) {
        // If the second parameter is a string, we're expecting to get the locale directly.
        // i.e. __("Hello", 'en')
        // i.e. __("Hello", 'en', 'PING_RESPONSE')
        if (typeof parameters[1] === 'string') {
          // Tags can't be less than 4 characters. So if the string here is less than 4 characters, it's a locale.
          if (!parameters[1].startsWith('::')) {
            parsed.locale = parameters[1];
            parsed.tag = parameters[2] || undefined;
          }
          // Otherwise, we're gonna assume that the string provided is indeed a tag.
          else {
            parsed.locale = undefined;
            parsed.tag = parameters[1];
          }
        }
        // Otherwise, the replacers are most likely set in the second parameter as an object, and the locale in the
        // third. If there's a tag, it'll be in the fourth.
        // i.e. __("Hello {{name}}", {name: 'Kyle'}, 'en')
        // i.e. __("Hello {{name}}", {name: 'Kyle'}, 'en', 'PING_RESPONSE')
        else {
          parsed.replacers = parameters[1];
          if (parameters[2] !== undefined) {
            if (typeof parameters[2] === 'string') {
              // Tags can't be less than 4 characters. So if the string here is less than 4 characters, it's a locale.
              if (!parameters[2].startsWith('::')) {
                parsed.locale = parameters[2];
                parsed.tag = parameters[3] || undefined;
              }
              // Otherwise, we're gonna assume that the string provided is indeed a tag.
              else {
                parsed.locale = undefined;
                parsed.tag = parameters[2];
              }
            }
          } else {
            parsed.locale = parameters[2] || 'en';
            parsed.tag = parameters[3] || undefined;
          }
        }
      }
      // This can occur when replacers are forcefully set to 'undefined'. See Morgana.js.
      else {
        // If a locale is set but replacers are set to null,
        if (parameters[2] !== undefined) {
          parsed.locale = parameters[2];
          parsed.tag = parameters[3] || undefined;
        }
      }

      return parsed;
    }

    // Technically we shouldn't reach here.
    return undefined;

  }

  /**
   * Checks if the given text is considered an approval or confirmation.
   *
   * @param {string} text
   *   The given text to check.
   *
   * @returns {boolean}
   *   Returns TRUE if it's considered an approval. Returns FALSE otherwise.
   */
  static isConfirmation(text) {

    // Clean punctuation.
    text = text.replace('?', '');
    text = text.replace('!', '');
    text = text.replace('.', '');
    text = text.replace(',', '');

    let confirmationWords = [
      'yes',
      'affirmative',
      'y',
      'yus',
      'sure',
      'okay',
      'ok',
      'alright'
    ];

    let splitText = text.split(' ');

    for (let word of splitText) {
      if (confirmationWords.includes(word.toLowerCase())) {
        return true;
      }
    }

    return false;

  }

  /**
   * Utility function to return a random element from a given array.
   *
   * Self-Explanatory.
   *
   * @param {Array} array
   *   Array to get random element from.
   *
   * @returns {*}
   *   Returns a random element.
   */
  static getRandomElementFromArray(array) {
    return array[Math.floor(Math.random()*array.length)];
  }

  /**
   * Utility function to remove a targeted element from an array.
   *
   * @param {Array} array
   *   Array to remove an element from.
   * @param {*} element
   *   Element to be removed.
   */
  static removeFromArray(array, element) {
    return array.filter(e => e !== element);
  }

  /**
   * Utility function to check if a variable is empty.
   *
   * @param {*} variable
   *   Variable to check.
   *
   * @returns {boolean}
   *   Evaluates to true if empty, false otherwise.
   */
  static isEmpty(variable) {

    // So underscore is cool and all...
    // BUT any FUNCTION passed to its isEmpty() function evaluates to TRUE for...I don't know what reason.
    // Here we handle this case.
    if (typeof variable === 'function') {
      return false;
    }

    // If it's not a function, underscore SHOULD cover the rest of the cases.
    return _.isEmpty(variable);

  }

  /**
   * Utility function to wait a given amount of time.
   *
   * @param {int} seconds The amount of seconds to wait for.
   *
   * @returns {Promise<any>}
   *   Returns a Promise you can use to chain code execution.
   */
  static wait(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

}