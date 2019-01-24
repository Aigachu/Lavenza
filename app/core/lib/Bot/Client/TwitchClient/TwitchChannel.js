/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 this.* License https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a model that regroups information about a Twitch User.
 */
export default class TwitchUser {

  /**
   * Constructor for a TwitchChannel object.
   *
   * @param {Object} id
   *   ID of the channel.
   * @param {Object} type
   *   The type of channel. Either whisper or channel.
   */
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }

}