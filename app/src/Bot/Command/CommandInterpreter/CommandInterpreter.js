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
    /** @catch Stop execution. */
    let order = await this.getCommand(resonance.content, resonance.bot, resonance.client, resonance).catch(Lavenza.stop);

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
   * @param {string} content
   *   Raw content obtained from the resonance.
   * @param {Bot} bot
   *   Bot that heard the message.
   * @param {*} client
   *   Client that sent the message.
   * @param {Resonance} resonance
   *   The resonance received from the listener.
   *
   * @returns {*}
   *   Returns data about a command if there is a command. Returns false otherwise.
   */
  static async getCommand(content, bot, client, resonance) {

    // Split content with spaces.
    // i.e. If the input is '! ping hello', then we get ['!', 'ping', 'hello'].
    let splitContent = content.split(' ');

    // Get the active bot configuration from the database.
    /** @catch Stop execution. */
    let botConfig = await bot.getActiveConfig().catch(Lavenza.stop);

    // Get command prefix.
    // If there is a command prefix override for this client, we will set it. If not, we grab the default.
    let cprefix = await bot.getCommandPrefix(resonance).catch(Lavenza.stop);

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
      Lavenza.warn('No command found');
      return false;
    }

    // Now we do one final check to see if this command is allowed to be used in this client.
    // We check the command configuration for this.
    if (!command.allowedInClient(client.type)) {
      Lavenza.warn('Command found, but not allowed in client. Returning.');
      return false;
    }

    // Next, we'll build the arguments as well, using minimist.
    let args = minimist(splitContent.slice(2));

    // Get the command configuration and build the configuration object for this order.
    // We want to send the bot config and the command config back with the Order.
    let commandConfig = await command.getActiveConfigForBot(bot).catch(Lavenza.stop);
    let config = {
      bot: botConfig,
      command: commandConfig
    };

    // Return our crafted Order.
    return new Lavenza.Order(command, args, splitContent.slice(2).join(' '), config, resonance);

  }

}