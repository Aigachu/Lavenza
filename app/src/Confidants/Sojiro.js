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
 * So Sojiro basically housed us and provided us with the essentials to live.
 *
 * Here, he's providing us with the utilities to make our life easier.
 *
 * Thanks Daddy Sojiro!
 */
export default class Sojiro {

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

  static removeFromArray(array, element) {
    return array.filter(e => e !== element);
  }

  static isEmpty(variable) {
    if (typeof variable === 'function') {
      return false;
    }
    return _.isEmpty(variable);
  }

}