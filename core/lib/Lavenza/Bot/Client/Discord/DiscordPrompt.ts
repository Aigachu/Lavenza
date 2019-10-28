/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Channel, DMChannel, GroupDMChannel, TextChannel, User } from "discord.js";

import { Bot } from "../../Bot";
import { Prompt } from "../../Prompt/Prompt";

import { DiscordResonance } from "./DiscordResonance";

/**
 * Provides a class for Prompts set in Discord.
 */
export class DiscordPrompt extends Prompt {

  /**
   * The user that is being prompted for a response.
   */
  public user: User;

  /**
   * The communication line for this prompt.
   */
  public line: Channel | TextChannel | DMChannel | GroupDMChannel;

  /**
   * Resonance to use to create this prompt.
   *
   * @inheritDoc
   */
  public resonance: DiscordResonance;

  /**
   * @inheritDoc
   */
  public constructor(
    user: User,
    line: Channel | TextChannel | DMChannel | GroupDMChannel,
    resonance: DiscordResonance,
    lifespan: number,
    onResponse: (resonance: DiscordResonance, prompt: DiscordPrompt) => Promise<void>,
    onError: (error: Error) => Promise<void>,
    bot: Bot,
  ) {
    super(user, line, resonance, lifespan, onResponse, onError, bot);
  }

  /**
   * Set condition for discord prompts.
   *
   * @inheritDoc
   */
  protected async condition(resonance: DiscordResonance): Promise<boolean> {
    // In Discord, we wait for the next message that comes from the author, in the configured 'line'.
    return resonance.message.channel.id === this.line.id && resonance.message.author.id === this.user.id;
  }

}
