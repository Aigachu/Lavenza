/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a class for Twitch Messages.
 */
export class TwitchUser {

  /**
   * The unique identifier of the Twitch user.
   */
  public id: string;

  /**
   * The username of the Twitch user.
   *
   * This is most likely identical to the ID.
   */
  public username: string;

  /**
   * The display name of the Twitch user. Will have case differences from the username.
   */
  public displayName: string;

  /**
   * Provides a constructor for TwitchMessages.
   */
  public constructor(id: string, username: string, displayName: string) {
    this.id = id;
    this.username = username;
    this.displayName = displayName;
  }

  /**
   * Provide a custom toString method.
   *
   * Useful for when this class is used in template strings.
   */
  public toString(): string {
    return this.username;
  }

}
