/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a model that regroups information about a command that was interpreted from a message.
 *
 * The order will contain arguments as well as the resonance it originates from.
 *
 * Orders are sent for approval before they carry out the command.
 */
export default class Order {

  /**
   * Order constructor.
   *
   * @param {Command|Lavenza.Command} command
   *   The command that must be executed with this order.
   * @param {Array} args
   *   The arguments sent with the order.
   * @param {Object} config
   *   The configuration of the bot & command fetched from the database, for the bot that called this.
   * @param {Resonance} resonance
   *   The resonance that this order originates from.
   */
  constructor(command, args, rawContent, config, resonance) {
    this.command = command;
    this.args = args;
    this.rawContent = rawContent;
    this.config = config;
    this.resonance = resonance;
  }

  /**
   * Execute this order's command.
   */
  execute() {
    this.command.execute(this, this.resonance);
  }

  /**
   * Execute this order's help function.
   */
  help() {
    this.command.help(this, this.resonance);
  }

}