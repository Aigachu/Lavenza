/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import _ from 'underscore';

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
    // BUT any FUNCTION passed to its isEmpty evaluates to TRUE for...I don't know what reason.
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