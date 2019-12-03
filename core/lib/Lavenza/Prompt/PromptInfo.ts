/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../Bot/Bot";
import { ClientChannel } from "../Client/ClientChannel";
import { ClientType } from "../Client/ClientType";
import { ClientUser } from "../Client/ClientUser";
import { Resonance } from "../Resonance/Resonance";
import { AbstractObject } from "../Types";

import { PromptException } from "./Exception/PromptException";
import { Prompt } from "./Prompt";
import { PromptType } from "./PromptType";

/**
 * Prompt Information interface.
 */
export interface PromptInfo {

  /**
   * The type of Prompt this is.
   */
  type?: PromptType;

  /**
   * Resonance that triggered this prompt.
   */
  resonance?: Resonance;

  /**
   * Bot that this Prompt is assigned to.
   */
  bot?: Bot;

  /**
   * Optional message to send before expecting a prompt.
   */
  message?: string;

  /**
   * The client type this prompt expects to get a response in.
   */
  clientType?: ClientType;

  /**
   * The user that is being prompted.
   */
  user?: ClientUser;

  /**
   * The channel where this prompt should be resolved.
   */
  channel?: ClientChannel;

  /**
   * The time limit for this prompt in seconds.
   */
  timeLimit?: number;

  /**
   * Optional function that acts upon response of the prompt.
   */
  onResponse?(resonance: Resonance, prompt: Prompt): Promise<string | AbstractObject | void>;

  /**
   * Optional function that acts upon a prompt exception.
   */
  onError?(error: PromptException): Promise<void>;

}
