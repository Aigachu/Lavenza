/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * A simple client handler.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
export default class CommandClientHandler {

  /**
   * ClientHandler constructor.
   *
   * Provides a constructor for ClientHandlers, classes that handle tasks for Commands that are specific to a client.
   *
   * @param {Command} command
   *   Command this handler belongs to.
   * @param {Resonance} resonance
   *   Resonance that triggered the command.
   * @param {string} directory
   *   Path to this Handler's directory.
   */
  constructor(command, resonance, directory) {
    this.command = command;
    this.resonance = resonance;
    this.directory = directory;
  }


  /**
   * Execute this handler's tasks.
   *
   * @param {Object} data
   *   Data passed to the ClientHandlers executor.
   *
   * @returns {Promise<void>}
   */
  async execute(data = {}) {
    // Default execute function. Does nothing right now.
    await Lavenza.warn(`You should probably add an execute function to this handler!`);
    console.log(this.command);
  }

  /**
   * Send a basic reply.
   *
   * @param {Object} data
   *   The data containing information on the message to send.
   *
   * @returns {Promise<void>}
   */
  async basicReply(data = {}) {
    data.replacers = data.replacers || {};

    // Set up for bolding any replacers.
    if (!Lavenza.isEmpty(data.bolds)) {
      await Promise.all(data.bolds.map(async (key) => {
        if (!data.replacers[key]) {
          return;
        }
        data.replacers[key] = await Lavenza.bold(data.replacers[key]);
      }));
    }
    await this.resonance.typeFor(1, this.resonance.channel);
    await this.resonance.__reply(data.message, Object.assign({user: this.resonance.author}, data.replacers));
  }

}