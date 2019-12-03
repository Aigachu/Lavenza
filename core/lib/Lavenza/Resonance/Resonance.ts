/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../Bot/Bot";
import { Client } from "../Client/Client";
import { ClientChannel } from "../Client/ClientChannel";
import { ClientFactory } from "../Client/ClientFactory";
import { ClientMessage } from "../Client/ClientMessage";
import { ClientUser } from "../Client/ClientUser";
import { Igor } from "../Confidant/Igor";
import { Sojiro } from "../Confidant/Sojiro";
import { Yoshida } from "../Confidant/Yoshida";
import { PromptInfo } from "../Prompt/PromptInfo";
import { AbstractObject } from "../Types";

/**
 * Provides a model that regroups information about a message received from a client.
 *
 * I love the name. But yes, this is a model to house a collection of useful information about a message a bot
 * receives.
 *
 * To manage different types of clients, this abstract class acts as a parent class to child classes that are more
 * client specific. This being said, child classes make good use of functions and properties in this class.
 */
export abstract class Resonance {

  /**
   * The raw content of the message that was heard.
   */
  public content: string;

  /**
   * Message object obtained from the client.
   */
  public message: ClientMessage;

  /**
   * The Bot that heard the message.
   */
  public bot: Bot;

  /**
   * The client where this message was heard.
   */
  public client: Client;

  /**
   * The author of the message that was heard.
   */
  public author: ClientUser;

  /**
   * The location where this message was heard. Type relative to the client.
   */
  public channel: ClientChannel;

  /**
   * The origin of the message in the form of data from the client.
   */
  public origin: unknown;

  /**
   * The locale describing the language the message was said in.
   * The locale is determined by user settings and is set to EN by default is nothing is configured.
   */
  public locale: string;

  /**
   * Whether the message was private or not. Depending on the privacy, it will be either 'public' or 'private'.
   */
  public private: string;

  /**
   * Resonance constructor.
   *
   * @param content
   *   The raw string content of the message received. This is deciphered by the bot.
   * @param message
   *   The message object received, unmodified. This is useful, since different clients might send different kinds of
   *   messages. It's always nice to have the original message.
   * @param bot
   *   The bot that heard this resonance.
   * @param client
   *   The client that sent the original message.
   */
  protected constructor(content: string, message: ClientMessage, bot: Bot, client: Client) {
    this.content = content;
    this.message = message;
    this.bot = bot;
    this.client = client;
  }

  /**
   * Perform build tasks for a Resonance.
   *
   * This function runs shortly after a resonance is constructed. Consider this an asynchronous constructor.
   */
  public async build(): Promise<void> {
    this.origin = await this.resolveOrigin();
    this.locale = await this.getLocale();
    this.private = await this.resolvePrivacy();
  }

  /**
   * Returns whether or not this Resonance was heard in a private channel.
   *
   * @returns
   *   Returns true if the Resonance was heard in a private channel. Returns false otherwise.
   */
  public async isPrivate(): Promise<boolean> {
    return this.private === "public";
  }

  /**
   * Set up a prompt to a specified user.
   *
   * @param promptInfo
   *   Info used to build the prompt object.
   */
  public async prompt(promptInfo: PromptInfo): Promise<string | AbstractObject> {
    // Set prompt user info tied to this resonance if we must.
    if (!promptInfo.user) {
      promptInfo.user = this.author;
    }

    // Set prompt channel info tied to this resonance if we must.
    if (!promptInfo.channel) {
      promptInfo.channel = this.channel;
    }

    // Set prompt channel info tied to this resonance if we must.
    if (!promptInfo.clientType) {
      promptInfo.clientType = this.client.type;
    }

    // Set prompt bot.
    promptInfo.bot = this.bot;

    // Set resonance.
    promptInfo.resonance = this;

    // Build the prompt.
    const prompt = await ClientFactory.buildPrompt(promptInfo);

    // Set the prompt to the bot.
    this.bot.prompts.push(prompt);

    // Await resolution of the prompt.
    return prompt.await();
  }

  /**
   * Reply to the current resonance.
   *
   * This will send a formatted reply to the Resonance, replying directly to the message that was heard.
   *
   * @param content
   *   Content to send back.
   * @param personalizationTag
   *   Tag for text personalizations, if needed. This will use Yoshida to get personalizations for the current bot.
   *
   * @returns
   *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
   *   act upon it if needed.
   */
  public async reply(content: string, personalizationTag: string = ""): Promise<unknown> {
    // Basically call the send method, but we already know the destination.
    return this.send(this.origin, content, personalizationTag);
  }

  /**
   * Reply to the current resonance, with a translating the string.
   *
   * This will send a formatted reply to the Resonance, replying directly to the message that was heard.
   *
   * We make this function flexible, similar to how i18n.__() works. It will allow multiple definitions for function
   * calls and act depending on what types of parameters are given.
   *
   * @param parameters
   *   Parameters to parse from the call.
   *
   * @returns
   *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
   *   act upon it if needed.
   */
  public async __reply(...parameters: unknown[]): Promise<unknown> {
    // Parse the parameters obtained.
    const params = await Yoshida.parseI18NParams(parameters);

    // Basically call the send method, but we already know the destination.
    return this.__send(this.origin, {phrase: params.phrase, locale: params.locale, tag: params.tag}, params.replacers, "PARSED")
      .catch(Igor.stop);
  }

  /**
   * Send a message to a destination using information from the resonance.
   *
   * This will send a formatted message to it's destination.
   *
   * This function acts as a shortcut to sending messages back to a resonance.
   *
   * @param destination
   *   Destination to send this message to.
   * @param content
   *   Content to send back to the destination.
   * @param personalizationTag
   *   Tag for text personalizations, if needed. This will use Yoshida to get personalizations for the current bot.
   *
   * @returns
   *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
   *   act upon it if needed. This is useful for Discord.
   */
  public async send(destination: unknown, content: string, personalizationTag: string = ""): Promise<unknown> {
    // Store variable for any content that is altered.
    let alteredContent = content;

    // If a personalization tag is set, we want to use Yoshida to get a personalization for this bot.
    if (!Sojiro.isEmpty(personalizationTag)) {
      alteredContent = await Yoshida.personalize(alteredContent, personalizationTag, this.bot);
    }

    // If all fails, we'll simply use this instance's doSend function.
    // Which will currently crash the program.
    return this.doSend(this.bot, destination, alteredContent)
      .catch(Igor.stop);
  }

  /**
   * Send a message to a destination using information from the resonance, translating the text.
   *
   * This will send a formatted message to it's destination.
   *
   * This function acts as a shortcut to sending messages back to a resonance. It
   * will handle translation of the text as well.
   *
   * We make this function flexible, similar to how i18n.__() works. It will allow multiple definitions for function
   * calls and act depending on what types of parameters are given.
   *
   * @param destination
   *   Destination to send this message to.
   * @param parameters
   *   Parameters to parse from the call.
   *
   * @returns
   *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
   *   act upon it if needed.
   */
  public async __send(destination: unknown, ...parameters: unknown[]): Promise<unknown> {
    // Parse the parameters obtained.
    const params = await Yoshida.parseI18NParams(parameters);

    // If a locale is not set in the parameters, we need to determine what it is using the Resonance.
    if (params.locale === undefined) {
      params.locale = await this.locale;
    }

    // If a locale is STILL not defined after the above code, we set it to the default one set to the bot.
    if (params.locale === undefined) {
      params.locale = this.bot.config.locale || "en";
    }

    // If a personalization tag is set, we want to use Yoshida to get a personalization for this bot.
    if (!Sojiro.isEmpty(params.tag)) {
      params.phrase = await Yoshida.personalize(params.phrase, params.tag, this.bot)
        .catch(Igor.stop);
    }

    // Now, using the information from the parameters, we fetch necessary translations.
    const content = await Yoshida.translate({phrase: params.phrase, locale: params.locale}, params.replacers, "PARSED");

    // Invoke the regular send function.
    return this.send(destination, content);

  }

  /**
   * Emulate the bot typing for a given amount of seconds.
   *
   * Each client will have its way of handling this. We just need a proper shortcut function to simplify coding in
   * commands.
   *
   * @param seconds
   *   The amount of seconds to type or wait for.
   * @param destination
   *   Destination to type in, if needed.
   */
  public abstract async typeFor(seconds: number, destination: unknown): Promise<void>;

  /**
   * Execute the actions required to send a message to a destination.
   *
   * This is an abstract method. Each Resonance must manage sending of messages for its cases depending on its client.
   *
   * @param bot
   *   The bot sending the message.
   * @param destination
   *   Destination to send the message to.
   * @param content
   *   Content of the message to send back.
   *
   * @returns
   *   We'll receive a Promise containing the message that was sent in the reply, allowing us to
   *   act upon it if needed.
   */
  protected abstract async doSend(bot: Bot, destination: unknown, content: string): Promise<unknown>;

  /**
   * Process parameters through i18n translation specifications for this Resonance.
   *
   * This is an abstract method. Each Resonance must manage translations for its cases depending on its client.
   *
   * @returns
   *   The locale of the message that was received.
   */
  protected abstract async getLocale(): Promise<string>;

  /**
   * Determine the origin of the message.
   *
   * Depending on the client, the origin will be determined differently. The goal is to be able to easily send
   * anything back to the origin, without necessarily having to go get it.
   *
   * @return
   *   Origin of the message. Depending on the client, it could be anything.
   */
  protected abstract async resolveOrigin(): Promise<unknown>;

  /**
   * Determine whether or not this resonance was a private message to the bot.
   *
   * Depending on the client, the privacy will be determined differently. The goal is to be able to easily send
   * anything back privately if needed.
   *
   * @return
   *   Privacy of the message. Depending on the client's checks, it will return either 'public' or 'private'.
   */
  protected abstract async resolvePrivacy(): Promise<string>;

}
