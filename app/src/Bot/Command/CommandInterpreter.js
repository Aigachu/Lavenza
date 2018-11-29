/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import minimist from 'minimist';

export default class CommandInterpreter {
  static interpret(content, message, bot, client) {

    // Attempt to get a command from the content.
    let result = this.getCommand(content, bot, client);

    // First, we check if this is a command.
    // To do this, we'll use a function to check if the content has the format of a command.
    if (!result) {
      return false;
    }

    return result;
  }

  static getCommand(content, bot, client) {

    // Split content with spaces.
    let splitContent = content.split(' ');

    // If the content starts with the command prefix, it's a command.
    if (!splitContent[0].startsWith(client.command_prefix)) {
      return false
    }

    // At this point we know it's a command. We'll need to find out which command was called.
    // First, we'll format the string accordingly if needed.
    // If a user enters a command attached to the prefix, we separate them.
    if (splitContent[0].length !== client.command_prefix.length) {
      splitContent = content.replace(client.command_prefix, client.command_prefix + ' ').split(' ');
    }

    let command = bot.getCommand(splitContent[1]);

    // If the command doesn't exist, we'll stop here.
    if (!command) {
      return false;
    }

    // Now we do one final check to see if this command is allowed to be used in this client.
    // We check the command configuration for this.
    if (!command.allowedInClient(client.type)) {
      return false;
    }

    // Next, we'll build the input as well.
    let args = minimist(splitContent);

    // Return our findings.
    return {
      command: command,
      args: args
    };
  }
}