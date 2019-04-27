/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.

/**
 * A wonderful listener!
 */
export default class CleverListener extends Lavenza.Listener {

  /**
   * This is the function that listens to messages and acts upon them.
   *
   * @inheritDoc
   */
  static async listen(resonance) {

    // Say something clever! A 1% chance to do so.
    // We only bought 15K API calls for now...We don't want this to happen too often.
    if (Math.random() < 0.01)
      await this.saySomethingClever(resonance);

  }

  /**
   * Say something clever using CleverBot's API.
   *
   * @param {Resonance} resonance
   *   The resonance heard by the listener.
   */
  static async saySomethingClever(resonance) {
    try {
      let response = await this.talent.cleverbot.query(resonance.content);
      await resonance.reply(response['output']);
    } catch(e) {
      Lavenza.warn(`Error occurred when querying CleverBot API. This is likely due to special characters being in the message heard in the listener. Must find a solution for this.`);
    }
  }

}