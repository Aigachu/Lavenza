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
    // 2% chance of saying something clever.
    if (Math.random() < 0.02) {
      await this.saySomethingClever(resonance);
    }

  }

  /**
   * Say something clever using CleverBot's API.
   *
   * @param {Resonance} resonance
   *   The resonance heard by the listener.
   */
  static async saySomethingClever(resonance) {
    try {
      if (resonance.client.type === Lavenza.ClientTypes.Discord)
        resonance.client.typeFor(5, resonance.message.channel).catch(Lavenza.continue);
      let response = await this.talent.cleverbot.query(resonance.content);
      let author = '';
      // If we're on discord, the author should be a tag. Otherwise, we just get the username.
      if (resonance.client.type === Lavenza.ClientTypes.Discord) {
        author = `<@${resonance.message.author.id}>`;
      } else {
        author = resonance.author.username;
      }

      await resonance.__reply(`{{author}}, {{response}}`, {
        author: author,
        response: response['output'],
      });
    } catch(e) {
      Lavenza.warn(`Error occurred when querying CleverBot API. This is likely due to special characters being in the message heard in the listener. Must find a solution for this.`);
    }
  }

}