/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { ClientChannel } from "./ClientChannel";
import { ClientUser } from "./ClientUser";

/**
 * Provide an interface that message objects obtained from a client application must follow.
 */
export interface ClientMessage {

  /**
   * Unique identifier of the channel where this message was heard.
   *
   * Not all clients have "channels". We may need to refactor this down the line.
   */
  channel: ClientChannel;

  /**
   * The author of the message.
   */
  author: ClientUser;

}
