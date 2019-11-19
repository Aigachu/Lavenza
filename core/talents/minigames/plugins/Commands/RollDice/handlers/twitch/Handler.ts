/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { CommandClientHandler } from "../../../../../../commander/src/Command/CommandClientHandler";
import { Sojiro } from "../../../../../../../lib/Lavenza/Confidant/Sojiro";
import { Yoshida } from "../../../../../../../lib/Lavenza/Confidant/Yoshida";
import { AbstractObject } from "../../../../../../../lib/Lavenza/Types";

/**
 * A simple client handler.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
export class Handler extends CommandClientHandler {

  /**
   * Execute this handler's tasks.
   *
   * @inheritDoc
   */
  public async execute(data: AbstractObject = {}): Promise<void> {
    // Build the response.
    const response = await Yoshida.translate(
      "{{author}}, the result of your roll is: {{roll}}!",
      {
        author: this.resonance.author.username,
        roll: data.roll,
      },
      this.resonance.locale,
    );

    // Await the delay patiently...
    await Sojiro.wait(data.delay);

    // Send the response.
    await this.resonance.reply(response);
  }

}
