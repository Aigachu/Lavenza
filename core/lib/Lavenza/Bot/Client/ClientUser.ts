/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provide an interface that user objects obtained from a client application must follow.
 */
export interface ClientUser {

  /**
   * Unique identifier of the user in the client.
   */
  id: string;

  /**
   * Reader-friendly username of the user.
   */
  username: string;

}
