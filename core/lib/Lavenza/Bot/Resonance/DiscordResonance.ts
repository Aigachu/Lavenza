/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {Resonance} from './Resonance';
import {Gestalt} from '../../Gestalt/Gestalt';
import {Igor} from '../../Confidant/Igor';
import {Channel, Guild, Message, TextChannel, User} from "discord.js";
import {Bot} from "../Bot";
import {ClientInterface} from "../Client/ClientInterface";
import {DiscordClient} from "../Client/DiscordClient/DiscordClient";
import {BotConfigurations} from "../BotConfigurations";

/**
 * Provides specific Resonance properties for messages coming from Discord.
 */
export class DiscordResonance extends Resonance {

  /**
   * The Message object obtained from the Discord Client.
   */
  public author: User;

  /**
   * The Guild (Discord Server) where the message was heard.
   */
  public guild: Guild;

  /**
   * The Channel where the message was heard.
   */
  public channel: Channel;

  /**
   * The Channel where the message was heard.
   */
  public client: DiscordClient;

  /**
   * DiscordResonance constructor.
   * @inheritDoc
   */
  constructor(content: string, message: Message, bot: Bot, client: ClientInterface) {
    // Run parent constructor.
    super(content, message, bot, client);

    // For Discord, we'll set some useful information to the class.
    this.author = message.author;
    this.guild = message.guild;
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
    let i18nUserConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/discord/users`).catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nUserConfig[this.author.id] && i18nUserConfig[this.author.id].locale && i18nUserConfig[this.author.id].locale !== 'default') {
      return i18nUserConfig[this.author.id].locale;
    }

    // Second, we check if configurations exist for this channel.
    let i18nChannelConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/discord/channels`).catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nChannelConfig[this.author.id] && i18nChannelConfig[this.author.id].locale && i18nChannelConfig[this.author.id].locale !== 'default') {
      return i18nChannelConfig[this.channel.id].locale;
    }

    // First, we check if configurations exist for this guild.
    let i18nGuildConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/discord/guilds`).catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nGuildConfig[this.author.id] && i18nGuildConfig[this.author.id].locale && i18nGuildConfig[this.author.id].locale !== 'default') {
      return i18nGuildConfig[this.guild.id].locale;
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
  protected async doSend(bot: Bot, destination: any, content: string): Promise<Message> {
    return await destination.send(content).catch(Igor.stop);
  }

  /**
   * Get origin of the resonance.
   *
   * In the case of Discord, we get the channel the message originates from.
   *
   * @inheritDoc
   */
  public async resolveOrigin(): Promise<Channel> {
    return this.message.channel;
  }

  /**
   * Get privacy of the resonance.
   *
   * In the case of Discord, we get the type of channel the message was heard from.
   *
   * @inheritDoc
   */
  public async resolvePrivacy(): Promise<string> {
    return this.message.channel.type === "dm" ? 'private' : 'public';
  }

  /**
   * Emulate the bot typing for a given amount of seconds.
   *
   * In the case of Discord, we simply fire the client's typeFor function.
   *
   * @inheritDoc
   */
  public async typeFor(seconds: number, destination: TextChannel) {
    return this.client.typeFor(seconds, destination);
  }

}