/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Channel, DMChannel, GroupDMChannel, Guild, Message, TextChannel, User } from "discord.js";

import { Igor } from "../../../Confidant/Igor";
import { Gestalt } from "../../../Gestalt/Gestalt";
import { Bot } from "../../Bot";
import { BotConfigurations } from "../../BotConfigurations";
import { Resonance } from "../../Resonance/Resonance";
import { Client } from "../Client";

import { DiscordClient } from "./DiscordClient";

/**
 * Provides specific Resonance properties for messages coming from Discord.
 */
export class DiscordResonance extends Resonance {

  /**
   * The Channel where the message was heard.
   */
  public message: Message;

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
  public channel: Channel | TextChannel | DMChannel | GroupDMChannel;

  /**
   * The Client connected to this Resonance.
   */
  public client: DiscordClient;

  /**
   * DiscordResonance constructor.
   *
   * @inheritDoc
   */
  public constructor(content: string, message: Message, bot: Bot, client: Client) {
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
    const i18nUserConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/discord/users`)
      .catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nUserConfig[this.author.id]
      && i18nUserConfig[this.author.id].locale
      && i18nUserConfig[this.author.id].locale !== "default") {
      return i18nUserConfig[this.author.id].locale;
    }

    // Second, we check if configurations exist for this channel.
    const i18nChannelConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/discord/channels`)
      .catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nChannelConfig[this.author.id]
      && i18nChannelConfig[this.author.id].locale
      && i18nChannelConfig[this.author.id].locale !== "default") {
      return i18nChannelConfig[this.channel.id].locale;
    }

    // First, we check if configurations exist for this guild.
    const i18nGuildConfig = await Gestalt.get(`/i18n/${this.bot.id}/clients/discord/guilds`)
      .catch(Igor.stop);

    // Now, we check if the user has a configured locale. If that's the case, we return with this locale.
    if (i18nGuildConfig[this.author.id]
      && i18nGuildConfig[this.author.id].locale
      && i18nGuildConfig[this.author.id].locale !== "default") {
      return i18nGuildConfig[this.guild.id].locale;
    }

    // Return the parameters.
    const config: BotConfigurations = await this.bot.getActiveConfig();

    return config.locale;

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
    return this.message.channel.type === "dm" ? "private" : "public";
  }

  /**
   * Emulate the bot typing for a given amount of seconds.
   *
   * In the case of Discord, we simply fire the client's typeFor function.
   *
   * @inheritDoc
   */
  public async typeFor(seconds: number, destination: TextChannel | DMChannel | GroupDMChannel): Promise<void> {
    return this.client.typeFor(seconds, destination);
  }

  /**
   * Send a message to a destination in Discord.
   *
   * @inheritDoc
   */
  protected async doSend(bot: Bot, destination: TextChannel, content: string): Promise<Message | Message[]> {
    return destination.send(content);
  }

}
