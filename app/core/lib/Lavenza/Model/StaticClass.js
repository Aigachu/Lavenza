/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
const Igor = require('../Confidants/Igor');

module.exports = class StaticClass {
  /**
   * @inheritDoc
   */
  constructor() {
    Igor.throw(`${this.constructor.class} is a STATIC CLASS and should never be instantiated.`).then(() => {
      // Do nothing.
    });
  }
};