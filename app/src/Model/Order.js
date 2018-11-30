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
   * @param {Lavenza.Command} command
   *   The command that must be executed with this order.
   * @param {Array} args
   *   The arguments sent with the order.
   * @param {Lavenza.Resonance} resonance
   *   The resonance that this order originates from.
   */
  constructor(command, args, resonance) {
    this.command = command;
    this.args = args;
    this.resonance = resonance;
  }

  /**
   * Execute this order's command.
   */
  execute() {
    this.command.execute(this, this.resonance);
  }

}