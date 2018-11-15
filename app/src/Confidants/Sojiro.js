/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */

/**
 * Provides a class that handles input/output to the console & errors.
 *
 * So Sojiro basically housed us and provided us with the essentials to live.
 *
 * Here, he's providing us with the utilities to make our life easier.
 *
 * Thanks Daddy Sojiro!
 */
class Sojiro {

  /**
   * Utility function to return a random element from a given array.
   *
   * Self-Explanatory.
   *
   * @param array
   *   Array to get random element from.
   * @returns {*}
   *   Returns a random element.
   */
  static getRandomElementFromArray(array) {
    return array[Math.floor(Math.random()*array.length)];
  }

  static isEmpty(variable) {
    if (Array.isArray(variable)) {
      return variable.length < 1;
    }

    if (variable.constructor === Object) {
      return Packages._.isEmpty(variable);
    }

    return (variable === undefined || variable === null || !variable.length);
  }

}

module.exports = Sojiro;
