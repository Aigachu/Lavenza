/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import minimist from 'minimist';

/**
 * Provides an Interpreter for Commands.
 *
 * This class will determine if a command has been heard by the Bot. It takes a resonance and analyzes it accordingly.
 */
export default class CommandInterpreter {

  /**
   * Interpret a Resonance, attempting to find a command in the raw content.
   *
   * @param {Resonance} resonance
   *   The Resonance that will be interpreted.
   *
   * @returns {*}
   */
  static interpret(resonance) {

    // Attempt to get a command from the content.
    let result = this.getCommand(resonance.content, resonance.bot, resonance.client);

    // If no command is found, we have nothing to do.
    if (!result) {
      return false;
    }

    // Craft Order and send it back.
    return new Lavenza.Order(result.command, result.args, resonance);
  }

  /**
   * Get a command from a message.
   *
   * This command accepts the raw content, the bot and the client to make some checks.
   *
   * The checks and analysis will determine if a command exists in the resonance.
   *
   * @param {string} content
   *   Raw content obtained from the resonance.
   * @param {Bot} bot
   *   Bot that heard the message.
   * @param {*} client
   *   Client that sent the message.
   *
   * @returns {*}
   *   Returns data about a command if there is a command. Returns false otherwise.
   */
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

    // Attempt the fetch the command from the bot.
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
    let args = minimist(splitContent.slice(2));

    // Return our findings.`
    return {
      command: command,
      args: args
    };
  }

}