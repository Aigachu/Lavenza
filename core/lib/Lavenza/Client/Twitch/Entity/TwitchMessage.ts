/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { AbstractObject } from "../../../Types";

import { TwitchChannel } from "./TwitchChannel";
import { TwitchUser } from "./TwitchUser";

/**
 * Provides a class for Twitch Messages.
 */
export class TwitchMessage {

  /**
   * Raw content of the Twitch Message.
   */
  public content: string;

  /**
   * Author of the message.
   */
  public author: TwitchUser;

  /**
   * Channel where the message was sent.
   */
  public channel: TwitchChannel;

  /**
   * Context information received about the message.
   */
  public context: AbstractObject;

  /**
   * Provides a constructor for TwitchMessages.
   */
  public constructor(content: string, author: TwitchUser, channel: TwitchChannel, context: AbstractObject) {
    this.content = content;
    this.author = author;
    this.channel = channel;
    this.context = context;
  }

}
