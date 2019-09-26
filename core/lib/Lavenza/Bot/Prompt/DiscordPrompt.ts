/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {Prompt} from './Prompt';
import {DiscordResonance} from "../Resonance/DiscordResonance";
import {Bot} from "../Bot";
import {Resonance} from "../Resonance/Resonance";

/**
 * Provides a class for Prompts set in Discord.
 */
export class DiscordPrompt extends Prompt {

  /**
   * @inheritDoc
   */
  public resonance: DiscordResonance;

  /**
   * @inheritDoc
   */
  constructor(user: any, line: any, resonance: Resonance, lifespan: number, onResponse: Function, onError: Function, bot: Bot) {
    super(user, line, resonance, lifespan, onResponse, onError, bot);
  }

  /**
   * @inheritDoc
   */
  protected async condition(resonance: DiscordResonance): Promise<boolean> {
    // In Discord, we wait for the next message that comes from the author, in the configured 'line'.
    return resonance.message.channel.id === this.line.id && resonance.message.author.id === this.user.id;
  }

}