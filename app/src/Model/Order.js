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
   * @param {Command} command
   *   The command that must be executed with this order.
   * @param {Array} arguments
   *   The arguments sent with the order.
   * @param {Resonance} resonance
   *   The resonance that this order originates from.
   */
  constructor(command, arguments, resonance) {
    this.command = command;
    this.arguments = arguments;
    this.resonance = resonance;
  }

  /**
   * Execute this order's command.
   */
  execute() {
    this.command.execute(this, this.resonance);
  }

}