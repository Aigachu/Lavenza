/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * This file includes extensions to the core javascript functionality.
 *
 * I'll be honest, ideally we wanna get rid of these later. I'm not a fan of it. But for now, it's used.
 */

/**
 * Object.prototype.forEach() polyfill
 * https://gomakethings.com/looping-through-objects-with-es6/
 * @author Chris Ferdinandi
 * @license MIT
 * @see https://gomakethings.com/looping-through-objects-with-es6/
 */
if (!Object.prototype.forEach) {
  Object.defineProperty(Object.prototype, 'forEach', {
    value: function (callback, thisArg) {
      if (this == null) {
        throw new TypeError('Not an object');
      }
      for (let key in this) {
        if (this.hasOwnProperty(key)) {
          callback.call(thisArg, this[key], key, this);
        }
      }
    }
  });
}