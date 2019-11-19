/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { DiscordResonance } from "../../../../../lib/Lavenza/Client/Discord/DiscordResonance";
import { Command } from "../../../../commander/src/Command/Command";
import { Instruction } from "../../../../commander/src/Instruction/Instruction";

/**
 * UserPic command.
 *
 * Used to send a bigger version of a user's avatar to a discord channel.
 */
export class UserPic extends Command {

  /**
   * Execute command.
   *
   * @inheritDoc
   */
  public async execute(instruction: Instruction, resonance: DiscordResonance): Promise<void> {
    // Trim the given tag from the command.
    instruction.content = instruction.content.trim()
      .replace("<@", "")
      .replace("!", "")
      .replace(">", "");

    // Find the member in the current guild.
    const guildMember = resonance.message.guild.members.find((member) => member.id === instruction.content);

    // If a member isn't found, the input may be wrong.
    if (guildMember === null) {
      await resonance.__reply("Hmm...Did you make a mistake? I couldn't get a pic with the input you provided... :(");

      return;
    }

    // Send the user's avatar to the channel.
    await resonance.message.channel.send(guildMember.user.avatarURL);
  }

}
