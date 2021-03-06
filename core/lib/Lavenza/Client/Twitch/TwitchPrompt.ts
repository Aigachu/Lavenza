/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Prompt } from "../../Prompt/Prompt";

import { TwitchChannel } from "./Entity/TwitchChannel";
import { TwitchUser } from "./Entity/TwitchUser";
import { TwitchResonance } from "./TwitchResonance";

/**
 * Provides a class for Prompts set in Discord.
 */
export class TwitchPrompt extends Prompt {

  /**
   * Resonance to use to create this prompt.
   *
   * @inheritDoc
   */
  public resonance: TwitchResonance;

  /**
   * The user that is being prompted for a response.
   */
  public user: TwitchUser;

  /**
   * The communication channel for this prompt.
   */
  public channel: TwitchChannel;

  /**
   * Set condition for twitch prompts.
   *
   * @inheritDoc
   */
  protected async condition(resonance: TwitchResonance): Promise<boolean> {
    // In Twitch, we wait for the next message that comes from the same user.
    return resonance.message.channel.id === this.channel.id && resonance.message.author.id === this.user.id;
  }

}
