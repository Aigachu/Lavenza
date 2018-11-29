/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Includes.
import Dictionary from '../Dictionary/Dictionary';

/**
 * Provides a class that handles Dictionary and Database management.
 *
 * Another name for this could be the TextManager.
 *
 * Futaba essentially hacks into a bunch of sh*t and interprets the whole world
 * for us in the game. Here, she'll handle database and dictionary management.
 *
 * I could call this class Medjed instead...LOL.
 */
export default class Futaba {

  /**
   * Takes a text and attempts ot search the dictionaries for it.
   *
   * If a key is found in the dictionary, the text returned will be the
   * the appropriate string in the Dictionary.
   *
   * There is also a placeholder functionality in case the string contains
   * dynamic values. In the dictionary, some strings have placeholders like
   * @1, @2, etc. These will be replaced with the values in the placeholders
   * array provided to the function.
   *
   * @see ../Dictionary/Dictionary
   *
   * @param {string} key
   *   Key to interpret and search dictionaries for.
   * @param {Array} placeholders
   *   Placeholders texts, if any, to replace any found in the string.
   * @returns {*}
   *   Final string interpreted, or returns the key if no dictionary matching
   *   was successful.
   */
  static interpret(key, placeholders = []) {

    // First thing's first, we check the Dictionary. If a key is not set, we return the text 'as is'.
    if (Dictionary[key] === undefined) {
      return key;
    }

    // We fetch the text from the Dictionary.
    let text = Dictionary[key];

    // If the text is an array, we fetch a random element from it.
    // This is fun, because you can have varying texts.
    if (Array.isArray(text)) {
      text = Lavenza.getRandomElementFromArray(text);
    }

    // Replace any placeholders.
    placeholders.forEach((placeholder, index) => {
      text = text.replace('@' + (index + 1), placeholder);
    });

    // Return the finished text.
    return text;
  }

}
