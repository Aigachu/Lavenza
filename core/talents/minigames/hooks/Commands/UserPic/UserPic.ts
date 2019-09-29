/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { DiscordResonance } from "../../../../../lib/Lavenza/Bot/Client/Discord/DiscordResonance";
import { Command } from "../../../../../lib/Lavenza/Bot/Command/Command";

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
  public async execute(resonance: DiscordResonance): Promise<void> {
    // Trim the given tag from the command.
    resonance.instruction.content = resonance.instruction.content.trim()
      .replace("<@", "")
      .replace("!", "")
      .replace(">", "");

    // Find the member in the current guild.
    const guildMember = resonance.message.guild.members.find((member) => member.id === resonance.instruction.content);

    // If a member isn't found, the input may be wrong.
    if (guildMember === null) {
      await resonance.__reply("Hmm...Did you make a mistake? I couldn't get a pic with the input you provided... :(");

      return;
    }

    // Send the user's avatar to the channel.
    await resonance.message.channel.send(guildMember.user.avatarURL);
  }

}
