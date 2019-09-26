/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {Resonance} from './Resonance';
import {TwitchUser} from '../Client/TwitchClient/TwitchUser';
import {TwitchChannel} from '../Client/TwitchClient/TwitchChannel';
import {Gestalt} from '../../Gestalt/Gestalt';
import {Igor} from '../../Confidant/Igor';
import {Sojiro} from '../../Confidant/Sojiro';
import {Bot} from "../Bot";
import {ClientInterface} from "../Client/ClientInterface";
import {TwitchClient} from "../Client/TwitchClient/TwitchClient";
import {BotConfigurations} from "../BotConfigurations";

/**
 * Provides specific Resonance properties for messages coming from Discord.
 */
export class TwitchResonance extends Resonance {

  /**
   * The Message object obtained from the Discord Client.
   * @TODO - Convert this class to a schema.
   */
  public author: TwitchUser;

  /**
   * The Channel where the message was heard.
   * @TODO - Create a TwitchChannel schema.
   */
  public channel: any;

  /**
   * The Channel where the message was heard.
   */
  public client: TwitchClient;

  /**
   * DiscordResonance constructor.
   * @inheritDoc
   */
  constructor(content: string, message: any, bot: Bot, client: ClientInterface) {
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
    let i18nUserConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/twitch/users`).catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nUserConfig[this.author.id] && i18nUserConfig[this.author.id].locale && i18nUserConfig[this.author.id].locale !== 'default') {
      return i18nUserConfig[this.author.id].locale;
    }

    // Second, we check if configurations exist for this channel.
    let i18nChannelConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/twitch/channels`).catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nChannelConfig[this.author.id] && i18nChannelConfig[this.author.id].locale && i18nChannelConfig[this.author.id].locale !== 'default') {
      return i18nChannelConfig[this.channel.id].locale;
    }

    // Return the parameters.
    let config: BotConfigurations = await this.bot.getActiveConfig();
    return config.locale;
  }

  /**
   * Send a message to a destination in Discord.
   *
   * @inheritDoc
   */
  protected async doSend(bot: Bot, destination: any, content: string): Promise<any> {

    // If the destination is a channel, and it's a private whisper channel, we use TMI's whisper function instead.
    if (destination instanceof TwitchChannel && destination.type === 'whisper') {
      return await this.client.whisper(destination.id, content);
    }

    // If the destination is a user, then we send a whisper as well.
    if (destination instanceof TwitchUser) {
      return await this.client.whisper(destination.username, content);
    }

    // If the destination is a string and doesn't start with '#', we send it through a whisper.
    if (typeof destination === 'string' && !destination.startsWith('#')) {
      return await this.client.whisper(destination, content);
    }

    // If the destination is a string and starts with '#', we send it to the channel.
    if (typeof destination === 'string' && !destination.startsWith('#')) {
      return await this.client.say(destination, content);
    }

    // Otherwise, we just send it to the destination, assuming it's simply the name of a channel.
    return await this.client.say(destination.id, content);
  }

  /**
   * Emulate the bot typing for a given amount of seconds.
   *
   * In the case of Twitch, we simply wait for the amount of seconds, as Twitch doesn't have typing notifiers.
   *
   * @inheritDoc
   */
  public async typeFor(seconds: number, destination: any = undefined) {
    return Sojiro.wait(seconds);
  }

  /**
   * Get origin of the resonance.
   *
   * In the case of Discord, we get the channel the message originates from.
   *
   * @inheritDoc
   */
  protected async resolveOrigin(): Promise<any> {
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
    return this.message.channel.type === "whisper" ? 'private' : 'public';
  }

}