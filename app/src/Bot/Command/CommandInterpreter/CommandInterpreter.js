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
  static async interpret(resonance) {
    // Attempt to get a command from the content.
    let result = await this.getCommand(resonance.content, resonance.bot, resonance.client).catch(Lavenza.stop);

    // If no command is found, we have nothing to do.
    if (!result) {
      return false;
    }

    // Craft Order and send it back.
    return new Lavenza.Order(result.command, result.args, result.config, resonance);
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
  static async getCommand(content, bot, client) {

    // Split content with spaces.
    let splitContent = content.split(' ');

    // Get the bot configuration.
    let botConfig = await bot.getActiveConfig().catch(Lavenza.stop);

    // Get command prefix.
    let cprefix = botConfig.clients[client.type].command_prefix || botConfig.command_prefix;

    // If the content starts with the command prefix, it's a command.
    if (!splitContent[0].startsWith(cprefix)) {
      // Lavenza.warn('Text does not start with command prefix. No command found');
      return false
    }

    // At this point we know it's a command. We'll need to find out which command was called.
    // First, we'll format the string accordingly if needed.
    // If a user enters a command attached to the prefix, we separate them.
    if (splitContent[0].length !== cprefix.length) {
      splitContent = content.replace(cprefix, cprefix + ' ').split(' ');
    }

    // Attempt the fetch the command from the bot.
    let command = bot.getCommand(splitContent[1].toLowerCase());

    // If the command doesn't exist, we'll stop here.
    if (!command) {
      Lavenza.warn('No command found');
      return false;
    }

    // Now we do one final check to see if this command is allowed to be used in this client.
    // We check the command configuration for this.
    if (!command.allowedInClient(client.type)) {
      Lavenza.warn('Command found, but not allowed in client. Returning.');
      return false;
    }

    // Next, we'll build the input as well.
    let args = minimist(splitContent.slice(2));

    // Get the command configuration and build the configuration object for this order.
    let commandConfig = await command.getActiveConfigForBot(bot).catch(Lavenza.stop);

    let config = {
      bot: botConfig,
      command: commandConfig
    };

    // Return our findings.`
    return {
      command: command,
      config: config,
      args: args
    };

  }

}