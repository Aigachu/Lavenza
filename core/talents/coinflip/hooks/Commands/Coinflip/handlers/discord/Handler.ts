/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { ClientUser } from "../../../../../../../lib/Lavenza/Bot/Client/ClientUser";
import { DiscordResonance } from "../../../../../../../lib/Lavenza/Bot/Client/Discord/DiscordResonance";
import { CommandClientHandler } from "../../../../../../../lib/Lavenza/Bot/Command/CommandClientHandler";
import { AbstractObject } from "../../../../../../../lib/Lavenza/Types";

/**
 * A simple client handler.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
export class Handler extends CommandClientHandler {

  /**
   * Resonance that triggered the command.
   */
  public resonance: DiscordResonance;

  /**
   * Execute handler tasks.
   *
   * @inheritDoc
   */
  public async execute(data: AbstractObject = {}): Promise<void> {
    // Do nothing.
  }

  /**
   * Fetch Discord user of the opponent being challenged for a guess game.
   *
   * @param data
   *   Data being sent to this handler.
   */
  public async getOpponent(data: AbstractObject): Promise<ClientUser> {
    let input = data.userInput;
    input = input.replace("<@", "");
    input = input.replace("!", "");
    input = input.replace(">", "");
    const opponent = this.resonance.guild.members.find((member) => member.id === input);

    return opponent.user || undefined;
  }

}
