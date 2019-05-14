/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * A simple Twitch client handler for the Pong command.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
export default class Handler extends Lavenza.CommandClientHandler {

  /**
   * Execute this handler's tasks.
   *
   * @inheritDoc
   */
  async execute(data = {}) {

    // Example of accessing the data that was passed in the this.fireClientHandlers() function call in the command.
    // It'all be found in the data variable.
    // In the case of this example, data.hello should be accessible here.
    // console.log(data);

    // You also have access to these!
    // console.log(this.command); // The command this handler is being used for.
    // console.log(this.resonance); // The resonance, of course!
    // console.log(this.directory); // The path to the directory of this handler. Useful if you want to include even more files.

    // Send an additional message when this command is used in Twitch clients.
    await this.resonance.__reply(`I love Twitch! It's such a cool website. :P`);

  }

  /**
   * Execute a custom method for this handler.
   *
   * @param {Object} data
   *   Data given through the command's call of its handlers() function.
   *
   * @returns {Promise<void>}
   */
  async myCustomMethod(data = {}) {

    // Depending on if the invoker had a good day or not, customize reply.
    if (data.goodDay === true) {
      await this.resonance.__reply(`Good days are awesome, right?`);
    } else if (data.goodDay === false) {
      await this.resonance.__reply(`Bad days suck huh...`);
    } else {
      await this.resonance.__reply(`>:(`);
    }

  }

}