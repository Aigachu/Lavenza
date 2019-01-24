/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * A wonderful listener!
 */
export default class WonderfulListenerExample extends Lavenza.Listener {

  /**
   * This is the function that listens to messages and acts upon them.
   *
   * @inheritDoc
   */
  static async listen(resonance) {

    // Say wonderful!
    this.sayWonderfulToo(resonance);

  }

  /**
   * If we hear 'wonderful', we say Wonderful! <3.
   *
   * @param {Resonance} resonance
   *   The resonance heard by the listener.
   */
  static sayWonderfulToo(resonance) {

    // If we hear 'wonderful', we say Wonderful! <3.
    if (resonance.content === 'wonderful') {
      resonance.message.reply('Wonderful! <3');
    }

  }
}