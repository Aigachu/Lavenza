/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Igor } from "../../../Confidant/Igor";
import { Sojiro } from "../../../Confidant/Sojiro";
import { Gestalt } from "../../../Service/Gestalt/Gestalt";
import { Bot } from "../../Bot";
import { BotConfigurations } from "../../BotConfigurations";
import { Resonance } from "../../Resonance/Resonance";

import { TwitchChannel } from "./Entity/TwitchChannel";
import { TwitchMessage } from "./Entity/TwitchMessage";
import { TwitchUser } from "./Entity/TwitchUser";
import { TwitchClient } from "./TwitchClient";

/**
 * Provides specific Resonance properties for messages coming from Discord.
 */
export class TwitchResonance extends Resonance {

  /**
   * The Channel where the message was heard.
   */
  public message: TwitchMessage;

  /**
   * The Message object obtained from the Discord Client.
   */
  public author: TwitchUser;

  /**
   * The Channel where the message was heard.
   */
  public channel: TwitchChannel;

  /**
   * The Channel where the message was heard.
   */
  public client: TwitchClient;

  /**
   * DiscordResonance constructor.
   *
   * @inheritDoc
   */
  public constructor(content: string, message: TwitchMessage, bot: Bot, client: TwitchClient) {
    // Run parent constructor.
    super(content, message, bot, client);

    // For Twitch, we'll set some useful information to the class.
    this.author = message.author;
    this.channel = message.channel;
  }

  /**
   * Resolve language to translate content to for this resonance.
   *
   * In Discord, there are three ways to configure the language:
   *  - Guild (Server) Locale - Setting a language per guild.
   *  - Channel Locale - Setting a language per channel.
   *  - User - Setting a language per user.
   *
   * Here, we want to query Gestalt to check if configurations are set for this resonance's environment.
   *
   * If no configurations are set, we simply take the default language set for the bot.
   *
   * @inheritDoc
   */
  public async getLocale(): Promise<string> {
    // First, we check if configurations exist for this user.
    const i18nUserConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/twitch/users`)
      .catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nUserConfig[this.author.id]
      && i18nUserConfig[this.author.id].locale
      && i18nUserConfig[this.author.id].locale !== "default") {
      return i18nUserConfig[this.author.id].locale;
    }

    // Second, we check if configurations exist for this channel.
    const i18nChannelConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/twitch/channels`)
      .catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nChannelConfig[this.author.id]
      && i18nChannelConfig[this.author.id].locale
      && i18nChannelConfig[this.author.id].locale !== "default") {
      return i18nChannelConfig[this.channel.id].locale;
    }

    // Return the parameters.
    const config: BotConfigurations = await this.bot.getActiveConfig();

    return config.locale;
  }

  /**
   * Emulate the bot typing for a given amount of seconds.
   *
   * In the case of Twitch, we simply wait for the amount of seconds, as Twitch doesn't have typing notifiers.
   *
   * @inheritDoc
   */
  public async typeFor(seconds: number, destination?: string): Promise<void> {
    return Sojiro.wait(seconds);
  }

  /**
   * Send a message to a destination in Discord.
   *
   * @inheritDoc
   */
  protected async doSend(bot: Bot, destination: TwitchChannel | TwitchUser | string, content: string): Promise<string> {
    // If the destination is a channel.
    if (destination instanceof TwitchChannel) {
      // If it's a private whisper channel, we use TMI's whisper function instead.
      // Otherwise, just talk in the channel.
      if (destination.type === "whisper") {
        return this.client.connector.whisper(destination.id, content);
      }

      // Otherwise, just talk in the channel.
      return this.client.connector.say(destination.id, content);
    }

    // If the destination is a user, then we send a whisper as well.
    if (destination instanceof TwitchUser) {
      return this.client.connector.whisper(destination.username, content);
    }

    // If the destination is a string and doesn't start with '#', we send it through a whisper.
    if (typeof destination === "string" && !destination.startsWith("#")) {
      return this.client.connector.whisper(destination, content);
    }

    // If the destination is a string and starts with '#', we send it to the channel.
    if (typeof destination === "string" && destination.startsWith("#")) {
      return this.client.connector.say(destination, content);
    }

    // Otherwise, we just send it to the destination, assuming it's simply the name of a channel.
    return this.client.connector.say(destination, content);
  }

  /**
   * Get origin of the resonance.
   *
   * In the case of Discord, we get the channel the message originates from.
   *
   * @inheritDoc
   */
  protected async resolveOrigin(): Promise<TwitchChannel> {
    return this.message.channel;
  }

  /**
   * Get privacy of the resonance.
   *
   * In the case of Twitch, we get the type of message that was sent.
   *
   * @inheritDoc
   */
  protected async resolvePrivacy(): Promise<string> {
    return this.message.channel.type === "whisper" ? "private" : "public";
  }

}
