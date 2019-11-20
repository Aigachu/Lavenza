/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { CommandClientHandler, AbstractObject } from "lavenza";

/**
 * A simple Twitch client handler for the Pong command.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
export class Handler extends CommandClientHandler {

  /**
   * Execute this handler's tasks.
   *
   * @inheritDoc
   */
  public async execute(data: AbstractObject = {}): Promise<void>  {
    // Example of accessing the data that was passed in the this.fireClientHandlers() function call in the command.
    // It'all be found in the data variable.
    // In the case of this example, data.hello should be accessible here.
    console.log(data);

    // You also have access to these!
    // The command this handler is being used for.
    console.log(this.command);
    // The resonance, of course!
    console.log(this.resonance);
    // The path to the directory of this handler. Useful if you want to include even more files.
    console.log(this.directory);

    // Send an additional message when this command is used in Twitch clients.
    await this.resonance.__reply("I love Twitch! It's such a cool website. :P");
  }

  /**
   * Execute a custom method for this handler.
   *
   * @param data
   *   Data given through the command's call of its handlers() function.
   */
  public async myCustomMethod(data: AbstractObject = {}): Promise<void> {
    // Depending on if the invoker had a good day or not, customize reply.
    if (data.goodDay === true) {
      await this.resonance.__reply("Good days are awesome, right?");
    } else if (data.goodDay === false) {
      await this.resonance.__reply("Bad days suck huh...");
    } else {
      await this.resonance.__reply(">:(");
    }
  }

}
