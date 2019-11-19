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
    // Build the response, translated.
    const response = await Yoshida.translate("8ball says: {{response}}", {response: data.answer}, this.resonance.locale);

    // Wait for the amount of time defined.
    await Sojiro.wait(data.delay);

    // Send the reply to the user.
    await this.resonance.reply(response);
  }

}
