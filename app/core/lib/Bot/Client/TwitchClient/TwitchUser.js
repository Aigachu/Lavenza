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
   * Constructor for a TwitchUser object.
   *
   * @param {string} id
   *   Twitch ID of the user.
   * @param {username} username
   *   Username of the user.
   * @param {displayName} displayName
   *   Display name of the user.
   */
  constructor(id, username, displayName) {
    this.id = id;
    this.username = username;
    this.displayName = displayName;
  }

  /**
   * Return a string representation of a TwitchUser.
   *
   * @returns {username}
   */
  toString() {
    return this.displayName;
  }

}