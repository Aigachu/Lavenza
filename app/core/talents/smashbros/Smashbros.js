/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import RoomManager from "./src/RoomManager/RoomManager";

/**
 * Provides a class for the Smash Brothers talent.
 *
 * This Talent allows the use of commands pertaining to Smash Brothers.
 *
 * This Talent manages all commands and behaviors related to Smash. It provides a wide range of cool features to use.
 *
 * @inheritDoc
 */
export default class Smashbros extends Lavenza.Talent {

  /**
   * Builder function.
   *
   * Set statics up here, as well as other things you may need.
   *
   * @inheritDoc
   */
  static async build(config) {

    // Run default builders.
    /** @catch Stop execution. */
    await super.build(config);

    // Run Room Manager builders.
    await RoomManager.build(this);

  }

}