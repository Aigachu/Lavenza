/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 this.* License https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a model that regroups information about a Twitch Channel.
 *
 * @TODO - Make this an interface. (?)
 */
export default class TwitchChannel {

  /**
   * ID of the channel.
   */
  public id: string;

  /**
   * The type of channel. Either whispers or the general chat of a stream.
   */
  public type: string;

  /**
   * Constructor for a TwitchChannel object.
   *
   * @param id
   *   ID of the channel.
   * @param type @TODO - Make this an enum
   *   The type of channel. Either whisper or channel.
   */
  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }

}