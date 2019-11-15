/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { CommandClientHandler } from "../../../../../../../core/talents/commander/src/Command/CommandClientHandler";
import { Kawakami } from "../../../../../../../core/lib/Lavenza/Confidant/Kawakami";
import { AbstractObject } from "../../../../../../../core/lib/Lavenza/Types";

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
    // Making the text sexy.
    data.percent = await Kawakami.bold(data.percent);
    data.thing = await Kawakami.bold(data.thing);

    // Send the result message.
    await this.resonance.__reply("There is {{percent}} love between {{author}} and {{thing}}!", {percent: data.percent, author: this.resonance.author, thing: data.thing});
  }

}
