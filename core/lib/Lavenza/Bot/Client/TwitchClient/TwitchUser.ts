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
   * The ID of the twitch user.
   *
   * A twitch ID is a long, unreadable string.
   */
  public id: any;

  /**
   * The display name of the user.
   */
  public displayName: any;

  /**
   * The account username of the user.
   */
  public username: any;

  /**
   * Constructor for a TwitchUser object.
   *
   * @param id
   *   Twitch ID of the user.
   * @param username
   *   Username of the user.
   * @param displayName
   *   Display name of the user.
   */
  constructor(id: string, username: string, displayName: string) {
    this.id = id;
    this.username = username;
    this.displayName = displayName;
  }

  /**
   * Return a string representation of a TwitchUser.
   *
   * @returns
   *   Simply returns the display name of the user when used in string context.
   */
  toString(): string {
    return this.displayName;
  }

}