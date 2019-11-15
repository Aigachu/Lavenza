/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a class for Twitch Messages.
 */
export class TwitchChannel {

  /**
   * ID of the Twitch channel.
   *
   * Usually shares the name of a user.
   */
  public id: string;

  /**
   * Username of the user that controls this channel.
   */
  public user: string;

  /**
   * The type of Twitch channel this is.
   *
   * Either "private" or "public".
   */
  public type: string;

  /**
   * Provides a constructor for TwitchMessages.
   */
  public constructor(id: string, user: string, type: string) {
    this.id = id;
    this.user = user;
    this.type = type;
  }

}
