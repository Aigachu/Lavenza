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
   * @returns {Promise<Order>}
   */
  static async interpret(resonance) {

    // Attempt to get a command from the content.
    let order = await this.getCommand(resonance);

    // If no command is found, we have nothing to do.
    if (!order) {
      return undefined;
    }

    // Otherwise, craft Order and send it back to the listener.
    return order;
  }

  /**
   * Get a command from a message.
   *
   * This command accepts the raw content, the bot and the client to make some checks.
   *
   * The checks and analysis will determine if a command exists in the resonance.
   *
   * @param {Resonance} resonance
   *   The resonance received from the listener.
   *
   * @returns {*}
   *   Returns data about a command if there is a command. Returns false otherwise.
   */
  static async getCommand(resonance) {

    // Initialize some variables.
    let content = resonance.content;
    let bot = resonance.bot;
    let client = resonance.client;

    // Split content with spaces.
    // i.e. If the input is '! ping hello', then we get ['!', 'ping', 'hello'].
    let splitContent = content.split(' ');

    // Get the active bot configuration from the database.
    let botConfig = await bot.getActiveConfig();

    // Get command prefix.
    // If there is a command prefix override for this client, we will set it. If not, we grab the default.
    let cprefix = await bot.getCommandPrefix(resonance);

    // If the content doesn't start with the command prefix, it's not a command.
    if (!splitContent[0].startsWith(cprefix)) {
      return false
    }

    // At this point we know it's a command. We'll need to find out which command was called.
    // First, we'll format the string accordingly if needed.
    // If a user enters a command attached to the prefix, we separate them here.
    if (splitContent[0].length !== cprefix.length) {
      splitContent = content.replace(cprefix, cprefix + ' ').split(' ');
    }

    // Attempt to fetch the command from the bot.
    let command = bot.getCommand(splitContent[1].toLowerCase());

    // If the command doesn't exist, we'll stop here.
    if (!command) {
      await Lavenza.warn('No command found in message...');
      return false;
    }

    // Now we do one final check to see if this command is allowed to be used in this client.
    // We check the command configuration for this.
    if (!command.allowedInClient(client.type)) {
      await Lavenza.warn('Command found, but not allowed in client. Returning.');
      return false;
    }

    // Next, we'll build the arguments as well, using minimist.
    let args = minimist(splitContent.slice(2));

    // Get the command configuration and build the configuration object for this order.
    // We want to send the bot config and the command config back with the Order.
    let commandConfig = await command.getActiveConfigForBot(bot);
    let config = {
      bot: botConfig,
      command: commandConfig
    };

    // Return our crafted Order.
    return new Lavenza.Order(command, args, splitContent.slice(2).join(' '), config, resonance);

  }

}