/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import { EventEmitter } from "events";

// Imports.
import { Bot } from "../Bot/Bot";
import { ClientChannel } from "../Client/ClientChannel";
import { ClientType } from "../Client/ClientType";
import { ClientUser } from "../Client/ClientUser";
import { Sojiro } from "../Confidant/Sojiro";
import { Resonance } from "../Resonance/Resonance";
import { AbstractObject } from "../Types";

import { PromptException } from "./Exception/PromptException";
import { PromptExceptionType } from "./Exception/PromptExceptionType";
import { PromptInfo } from "./PromptInfo";
import { PromptType } from "./PromptType";
import Timeout = NodeJS.Timeout;

/**
 * Provides a base class for Prompts.
 *
 * Prompts can be set for a bot to await input from a user. Using the received input, it can then act upon it.
 */
export abstract class Prompt {

  /**
   * The type of Prompt this is.
   */
  public type: PromptType = PromptType.Text;

  /**
   * The Bot handling the prompt.
   */
  public resonance: Resonance;

  /**
   * The Bot handling the prompt.
   */
  public bot: Bot;

  /**
   * Message to send with the prompt.
   */
  public message: string;

  /**
   * The client this prompt expects to get a response in.
   */
  public clientType: ClientType;

  /**
   * The user that is being prompted for a response.
   */
  public user: ClientUser;

  /**
   * The communication channel where this prompt should be resolved.
   */
  public channel: ClientChannel;

  /**
   * The time limit to answer this prompt in seconds.
   */
  public timeLimit: number = 10;

  /**
   * Function containing actions to undertake when the prompt is answered.
   */
  public onResponse: (resonance: Resonance, prompt: Prompt) => Promise<string | AbstractObject>;

  /**
   * Function containing actions to undertake if an invalid answer is given for the prompt.
   */
  public onError: (error: Error) => Promise<void>;

  /**
   * Event Emitter.
   */
  public ee: EventEmitter = new EventEmitter();

  /**
   * Timeout that will handle the lifespan of the prompt.
   */
  public timer: Timeout;

  /**
   * Field to hold the number of times this prompt has failed through error.
   */
  public resetCount: number = 0;

  /**
   * Prompt constructor.
   *
   * @param promptInfo
   *   Object containing relevant information about this prompt.
   */
  public constructor(promptInfo: PromptInfo) {
    this.type = promptInfo.type || PromptType.Text;
    this.resonance = promptInfo.resonance;
    this.bot = promptInfo.bot;
    this.message = promptInfo.message;
    this.user = promptInfo.user;
    this.channel = promptInfo.channel;
    this.clientType = promptInfo.clientType;
    this.timeLimit = promptInfo.timeLimit || 10;
    this.onResponse = promptInfo.onResponse;
    this.onError = promptInfo.onError;
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
    if (resonance.client.type !== this.clientType) {
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
  public await(): Promise<string | AbstractObject> {
    // Send message if we have to.
    if (this.message) {
      this.resonance.send(this.channel, this.message).catch(() => {
        return;
      });
    }

    // We manage the Promise here.
    return new Promise((resolve, reject) => {
      // Set the bomb. We'll destroy the prompt if it takes too long to execute.
      this.timer = setTimeout(
        async () => {
          // Check if the prompt still exists after the time has elapsed.
          if (this.bot.prompts.includes(this)) {
            // If the lifespan depletes, we remove the prompt.
            await this.disable();
            const exception = new PromptException(PromptExceptionType.NO_RESPONSE, "No response was provided in the time given. Firing error handler.");
            await this.onError(exception);
            reject();
          }
        },
        this.timeLimit * 1000);

      // If we get a response, we clear the bomb and return early.
      this.ee.on("prompt-response", async (resonance: Resonance) => {
        // Clear timeouts and event listeners since we got a response.
        await this.clearTimer();
        await this.clearListeners();

        // Fire the callback if any.
        if (this.onResponse) {
          // If the response returns something other than undefined, we can resolve with it.
          const onResponseResult = await this.onResponse(resonance, this);
          if (onResponseResult) {
            resolve(onResponseResult);
          }
        }

        await this.disable();

        // Depending on the type, we want to return different values.
        switch (this.type) {
          // For text Prompts, we simply return the text entered by the user.
          case PromptType.Text: {
            resolve(resonance.content);
            break;
          }

          // By default, we don't return anything.
          default: {
            resolve();
          }
        }
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
  public async reset({error = ""}: AbstractObject): Promise<string | AbstractObject> {
    if (this.resetCount === 2) {
      await this.error(PromptExceptionType.MAX_RESET_EXCEEDED);

      return;
    }
    if (!Sojiro.isEmpty(error)) {
      await this.error(error);
    }
    this.resetCount += 1;

    return this.await();
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
    if (this.onError) {
      const exception = new PromptException(type);
      await this.onError(exception);
    }
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
