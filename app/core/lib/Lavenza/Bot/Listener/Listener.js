/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a base class for Listeners.
 *
 * Listeners receive a 'Resonance' from a Bot and can act upon what they hear.
 *
 * They are basically entry points for extended functionality when wanting to tell a Bot what to do upon hearing
 * a message from any given client.
 */
module.exports = class Listener {

  /**
   * Perform build tasks.
   *
   * Since Listeners will be singletons, there is no constructor. Listeners can call this function once to set
   * their properties.
   *
   * @param {Lavenza.Talent} talent
   *   The talent that this listener belongs to, if any. Core listeners most likely won't have a talent.
   *
   * @returns {Promise.<void>}
   */
  static async build(talent) {
    this.talent = talent;
  }

  /**
   * Main function of all listeners used to listen to a Resonance.
   *
   * All logic for what to do upon hearing a Resonance should be added in this function. It's the entry point.
   *
   * Each child class should have its own listen() implementation. This base class implementation will urge you to
   * make one.
   *
   * @param {Resonance }resonance
   *   The Resonance to listen to.
   */
  static async listen(resonance) {
    await Lavenza.log(`(${resonance.bot.id}) - Message heard from {${resonance.client.type}} client: "${resonance.content}"`);
  }

};