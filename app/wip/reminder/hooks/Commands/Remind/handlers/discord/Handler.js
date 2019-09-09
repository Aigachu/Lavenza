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

    // If the data is null, that means the library could not parse a reminder. We'll return NULL with it.
    if (data.info === null) {
      return null;
    }

    // Get the initial parsing done by the parse-reminder package.
    let parse = data.info;

    // For Discord, include the channel where this reminder was set as well as the guild.
    parse.channel = this.resonance.message.channel.id;

    // If this is being called through whispers, there is no guild.
    if (this.resonance.message.type !== 'dm' && this.resonance.message.type !== 'group') {
      parse.guild = this.resonance.message.guild.id;
    }

    // Now depending on what we receive in there, we may need to touch and cleanup the data a little.
    switch (parse.who) {
      // If the "who" value is equal to "me"...
      case 'me': {
        // Instead of just returning "me", we'll get the ID of the user that sent the message.
        parse.id = this.resonance.message.author.id;
        parse.type = 'user';
        break;
      }

      // If the "who" value is equal to "here"...
      case 'here': {
        // Instead of just returning "me", we'll get the ID of the user that sent the message.
        parse.id = this.resonance.message.channel.id;
        parse.type = 'channel';
        break;
      }

      // If the "who" value is equal to "here"...
      case 'everyone': {
        // Instead of just returning "me", we'll get the ID of the user that sent the message.
        parse.who = `@everyone`;
        parse.type = 'everyone';
        break;
      }

      // By default, do additional checks.
      default: {
        switch (parse.who.charAt(1)) {
          // If the second character is an '@', we're most likely @ing a user.
          case '@': {
            // In this case, if the third char is a '&', we're actually @ing a Role.
            if (parse.who.charAt(2) === '&') {
              parse.id = parse.who.replace('<@&', '');
              parse.id = parse.id.replace('>', '');
              parse.type = 'role';
              break;
            }

            // In this case, if the third char is a '!', we're actually @ing a member of a guild through a nickname.
            if (parse.who.charAt(2) === '!') {
              parse.id = parse.who.replace('<@!', '');
              parse.id = parse.id.replace('>', '');
              parse.type = 'user';
              break;
            }

            // By default, just parse it as a user.
            parse.id = parse.who.replace('<@', '');
            parse.id = parse.id.replace('>', '');
            parse.type = 'user';
            break;
          }

          // If the second character is an '#', then we're trying to @ a channel.
          case '#': {
            parse.id = parse.who.replace('<#', '');
            parse.id = parse.id.replace('>', '');
            parse.type = 'channel';
          }
        }
      }
    }

    // Include client information in the parsed data.
    parse.client = Lavenza.ClientTypes.Discord;

    return data.info;
  }

}