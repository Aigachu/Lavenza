/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Channel, DMChannel, GroupDMChannel, TextChannel, User } from "discord.js";

import { Bot } from "../../Bot/Bot";
import { Prompt } from "../../Prompt/Prompt";

import { DiscordResonance } from "./DiscordResonance";

/**
 * Provides a class for Prompts set in Discord.
 */
export class DiscordPrompt extends Prompt {

  /**
   * Resonance to use to create this prompt.
   *
   * @inheritDoc
   */
  public resonance: DiscordResonance;

  /**
   * The user that is being prompted for a response.
   */
  public user: User;

  /**
   * The communication channel for this prompt.
   */
  public channel: Channel | TextChannel | DMChannel | GroupDMChannel;

  /**
   * Set condition for discord prompts.
   *
   * @inheritDoc
   */
  protected async condition(resonance: DiscordResonance): Promise<boolean> {
    // In Discord, we wait for the next message that comes from the author, in the configured 'line'.
    return resonance.message.channel.id === this.channel.id && resonance.message.author.id === this.user.id;
  }

}
