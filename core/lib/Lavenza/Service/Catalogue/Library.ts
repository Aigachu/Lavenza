/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides an interface for libraries.
 *
 * Catalogues are a repository of items, and they are organized into Libraries.
 *
 * For example, if we're storing a catalogue of Food, then we can separate the catalogue into many libraries such as:
 *  - Meats
 *  - Fruits
 *  - Veggies
 *  - Shitty Food
 *
 * Each Library will have a defined unique ID, an a array of all items stored in them.
 */
export interface Library<T> {

  /**
   * The ID of this library.
   */
  id: string;

  /**
   * The objects that are in this library.
   */
  objects: T[];

}
