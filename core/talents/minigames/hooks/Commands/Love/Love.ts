/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Command } from "../../../../../lib/Lavenza/Bot/Command/Command";
import { Resonance } from "../../../../../lib/Lavenza/Bot/Resonance/Resonance";

/**
 * Love command!
 *
 * Test your love for something...Or someone... ;)
 */
export class Love extends Command {

  /**
   * Execute command.
   *
   * @inheritDoc
   */
  public async execute(resonance: Resonance): Promise<void> {
    // Get the thing the caller is getting love percentage for.
    // Lol Aiga naming your variable 'thing' really? xD
    const thing = resonance.instruction.content;

    // Calculate the percent.
    // It's completely random.
    // @TODO - Make it calculate a percent using an algorithm, so the result is always the same.
    const percent = `${Math.floor(Math.random() * 100)}%`;

    // Invoke Client Handlers to determine what to do in each client.
    /** @see ./handlers */
    await this.fireClientHandlers(resonance, {
      percent,
      thing,
      },
    );
  }

}
