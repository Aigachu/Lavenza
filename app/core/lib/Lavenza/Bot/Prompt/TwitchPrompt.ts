/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Prompt from './Prompt';
import TwitchResonance from "../Resonance/TwitchResonance";
import Bot from "../Bot";
import Resonance from "../Resonance/Resonance";

/**
 * Provides a class for Prompts set in Discord.
 */
export default class TwitchPrompt extends Prompt {

  /**
   * @inheritDoc
   */
  public resonance: TwitchResonance;

  /**
   * @inheritDoc
   */
  constructor(user: any, line: any, resonance: Resonance, lifespan: number, onResponse: Function, onError: Function, bot: Bot) {
    super(user, line, resonance, lifespan, onResponse, onError, bot);
  }

  /**
   * @inheritDoc
   */
  async condition(resonance: TwitchResonance): Promise<boolean> {
    // In Twitch, we wait for the next message that comes from the same user.
    return resonance.message.channel.id === this.line.id && resonance.message.author.id === this.user.id;
  }

}