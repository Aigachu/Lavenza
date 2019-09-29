/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as EventEmitter from "events";

// Imports.
import { Igor } from "../../Confidant/Igor";
import { Sojiro } from "../../Confidant/Sojiro";
import { AbstractObject } from "../../Types";
import { Bot } from "../Bot";
import { ClientUser } from "../Client/ClientUser";
import { Resonance } from "../Resonance/Resonance";

import { PromptException } from "./Exception/PromptException";
import { PromptExceptionType } from "./Exception/PromptExceptionType";
import Timeout = NodeJS.Timeout;

/**
 * Provides a base class for Prompts.
 *
 * Prompts can be set for a bot to await input from a user. Using the received input, it can then act upon it.
 */
export abstract class Prompt {

  /**
   * The user that is being prompted for a response.
   */
  public user: ClientUser;

  /**
   * The communication line for this prompt.
   */
  public line: unknown;

  /**
   * The resonance containing the message tied to this prompt.
   */
  public resonance: Resonance;

  /**
   * The time limit to answer this prompt.
   */
  public lifespan: number;

  /**
   * The user that sent the message invoking this prompt.
   */
  public requester: unknown;

  /**
   * Function containing actions to undertake when the prompt is answered.
   */
  public onResponse: (resonance: Resonance, prompt: Prompt) => Promise<void>;

  /**
   * Function containing actions to undertake if an invalid answer is given for the prompt.
   */
  public onError: (error: Error) => Promise<void>;

  /**
   * The Bot handling all of this.
   */
  public bot: Bot;

  /**
   * Event Emitter.
   */
  public ee: EventEmitter;

  /**
   * Timeout that will handle the lifespan of the prompt.
   */
  public timer: Timeout;

  /**
   * Field to hold the number of times this prompt has failed through error.
   */
  public resetCount: number;

  /**
   * Prompt constructor.
   *
   * @param user
   *   User that is being prompted.
   * @param line
   *   The communication line for this prompt. Basically, where we want the interaction to happen.
   * @param resonance
   *   The Resonance tied to this prompt.
   * @param lifespan
   *   The lifespan of this Prompt.
   *   If the bot doesn't receive an answer in time, we cancel the prompt.
   *   10 seconds is the average time a white boy waits for a reply from a girl he's flirting with after sending her a
   *   message. You want to triple that normally. You're aiming for a slightly more patient white boy. LMAO!
   * @param onResponse
   *   The callback function that runs once a response has been heard.
   * @param onError
   *   The callback function that runs once a failure occurs. Failure includes not getting a response.
   * @param bot
   *   The Bot this prompt is being created for.
   */
  protected constructor(
    user: ClientUser,
    line: unknown,
    resonance: Resonance,
    lifespan: number,
    onResponse: (resonance: Resonance, prompt: Prompt) => Promise<void>,
    onError: (error: PromptException) => Promise<void>,
    bot: Bot,
  ) {
    this.user = user;
    this.line = line;
    this.resonance = resonance;
    this.lifespan = lifespan;
    this.requester = resonance.author;
    this.onResponse = onResponse;
    this.onError = onError;
    this.bot = bot;
    this.ee = new EventEmitter();
    this.timer = undefined;
    this.resetCount = 0;
  }

  /**
   * Prompts have their own listen functions.
   *
   * Checks the condition with a received resonance, and resolves the Prompt
   * if conditions are matched.
   *
   * @param resonance
   *   The resonance that was heard by the Prompt.
   */
  public async listen(resonance: Resonance): Promise<void> {
    // If the resonance that was just heard is not from the same client, we do nothing.
    if (resonance.client.type !== this.resonance.client.type) {
      return;
    }

    // We check the condition defined in this prompt. If it passes, we resolve it.
    if (await this.condition(resonance)) {
      // Emit the event that will alert the Prompt that it should be resolved.
      await this.ee.emit("prompt-response", resonance);
    }
  }

  /**
   * Await the resolution of the prompt.
   *
   * If the prompt doesn't get resolved by the user within the lifespan, it will
   * cancel itself. Otherwise, after resolution, we clear the awaiting status.
   *
   * @returns
   *   Resolution of the prompt, or an error.
   */
  public await(): Promise<void> {
    // We manage the Promise here.
    return new Promise((resolve, reject) => {
      // Set the bomb. We'll destroy the prompt if it takes too long to execute.
      this.timer = setTimeout(async () => {
        // Check if the prompt still exists after the time has elapsed.
        if (this.bot.prompts.includes(this)) {
          // If the lifespan depletes, we remove the prompt.
          await this.disable();
          const exception = new PromptException(PromptExceptionType.NO_RESPONSE, "No response was provided in the time given. Firing error handler.");
          await this.onError(exception);
          reject();
        }
      },                      this.lifespan * 1000);

      // If we get a response, we clear the bomb and return early.
      this.ee.on("prompt-response", async (resonance) => {
        // Clear timeouts and event listeners since we got a response.
        await this.clearTimer();
        await this.clearListeners();

        // Fire the callback.
        await this.onResponse(resonance, this)
          .catch(async (e) => {
            const exception = new PromptException(PromptExceptionType.MISC, e);
            await this.onError(exception);
          });

        await this.disable();
        resolve();
      });
    });
  }

  // tslint:disable-next-line:comment-format
  // noinspection JSUnusedGlobalSymbols
  /**
   * Resets the prompt to listen for another message.
   *
   * This can be useful in situations where you want to try reading the input again.
   *
   * @param error
   *   Details of the error that occurred causing the prompt to reset.
   *
   * @returns
   *   Resolution of the prompt (newly reset), or an error.
   */
  public async reset({error = ""}: AbstractObject): Promise<void> {
    if (this.resetCount === 2) {
      await this.error(PromptExceptionType.MAX_RESET_EXCEEDED);

      return;
    }
    if (!Sojiro.isEmpty(error)) {
      await this.error(error);
    }
    this.resetCount += 1;
    await this.await()
      .catch(Igor.pocket);
  }

  /**
   * Disable this prompt.
   */
  public async disable(): Promise<void> {
    await this.clearTimer();
    await this.clearListeners();
    await this.bot.removePrompt(this);
  }

  /**
   * Send an error to the error handler for this prompt.
   *
   * @param type
   *   Type of PromptException to fire.
   */
  public async error(type: PromptExceptionType): Promise<void> {
    const exception = new PromptException(type);
    await this.onError(exception);
  }

  /**
   * Method defining the conditions for this prompt to be resolved.
   *
   * This is an abstract method.
   */
  protected abstract async condition(resonance: Resonance): Promise<boolean>;

  /**
   * Clear the timer attached to this prompt.
   */
  private async clearTimer(): Promise<void> {
    await clearTimeout(this.timer);
  }

  /**
   * Clear all event listeners in this prompt's event emitter.
   */
  private async clearListeners(): Promise<void> {
    await this.ee.removeAllListeners();
  }

}
