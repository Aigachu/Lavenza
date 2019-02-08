/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * A simple Discord client handler for the Pong command.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
export default class Handler extends Lavenza.CommandClientHandler {

  /**
   * Parse Reminder and return all relevant information.
   *
   * @param {Object} data
   *   Data given through the command's call of its handlers() function.
   *
   * @returns {Promise<void>}
   */
  async parseReminder(data = {}) {
    // Get the initial parsing done by the parse-reminder package.
    let parse = data.info;

    // Now depending on what we receive in there, we may need to touch and cleanup the data a little.
    switch (parse.who) {
      // If the "who" value is equal to "me"...
      case 'me': {
        // Instead of just returning "me", we'll get the ID of the user that sent the message.
        parse.who = `<@${this.resonance.message.author.id}>`;
        break;
      }

      // If the "who" value is equal to "here"...
      case 'here': {
        // Instead of just returning "me", we'll get the ID of the user that sent the message.
        parse.who = `@here`;
        break;
      }

      // If the "who" value is equal to "here"...
      case 'everyone': {
        // Instead of just returning "me", we'll get the ID of the user that sent the message.
        parse.who = `@everyone`;
        break;
      }
    }

    return data.info;
  }

}