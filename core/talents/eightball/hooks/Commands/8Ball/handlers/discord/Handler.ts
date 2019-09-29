/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { CommandClientHandler } from "../../../../../../../lib/Lavenza/Bot/Command/CommandClientHandler";
import { Kawakami } from "../../../../../../../lib/Lavenza/Confidant/Kawakami";
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
    // Put some emphasis on the answer's message.
    let answerMessage = await Kawakami.bold(data.answer);
    answerMessage = await Kawakami.italics(answerMessage);

    // Build the response, translated.
    const response = await Yoshida.translate("8ball says: {{response}}", {response: answerMessage}, this.resonance.locale);

    // Start typing with the chosen answer's timeout, then send the reply to the user afterwards.
    await this.resonance.client.typeFor(data.delay, this.resonance.channel);
    await this.resonance.reply(response);
  }

}
