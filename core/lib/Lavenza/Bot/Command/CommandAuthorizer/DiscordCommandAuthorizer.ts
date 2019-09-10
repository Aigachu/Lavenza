/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import CommandAuthorizer from './CommandAuthorizer';
import Sojiro from "../../../Confidant/Sojiro";
import Morgana from "../../../Confidant/Morgana";
import Igor from "../../../Confidant/Igor";
import DiscordResonance from "../../Resonance/DiscordResonance";
import Eminence from "../../Eminence/Eminence";
import {DiscordCommandAuthorizerConfigurationsCollection} from "./CommandAuthorizerConfigurations";

/**
 * Provides an Authorizer for commands invoked in Discord.
 */
export default class DiscordCommandAuthorizer extends CommandAuthorizer {

  /**
   * The Resonance containing the command that was heard.
   */
  protected resonance: DiscordResonance;

  /**
   * Object to store relevant configurations.
   */
  protected configurations: DiscordCommandAuthorizerConfigurationsCollection;

  /**
   * Since authorizers are static classes, we'll have a build function to make preparations.
   */
  async build(resonance: DiscordResonance) {
    // Run parent build function.
    await super.build(resonance);
  }

  /**
   * The warrant function. This function will return TRUE if the command is authorized, and FALSE otherwise.
   *
   * Discord specific checks are performed here.
   */
  async warrant(): Promise<boolean> {

    // If the message is not a direct message, we assume it is in a server and do additional validations.
    let messageIsPrivate = await this.resonance.isPrivate();
    if (!messageIsPrivate) {
      // Validate that the command is allowed to be used in this Guild (Server).
      let guildValidation = await this.validateGuild();
      if (!guildValidation) {
        await Morgana.warn('guild validation failed');
        return false;
      }

      // Validate that the command is allowed to be used in this Channel.
      let channelValidation = await this.validateChannel();
      if (!channelValidation) {
        await Morgana.warn('channel validation failed');
        return false;
      }
    }

    // If all those checks pass through, we can authorize the command.
    return true;
  }

  /**
   * @inheritDoc
   */
  async getAuthorIdentification(): Promise<string> {
    return this.resonance.author.id;
  }

  /**
   * @inheritDoc
   * @TODO - Explore some cool stuff to do with Discord Roles.
   */
  async getAuthorEminence(): Promise<Eminence> {
    // First, we'll check if this user's ID is found in the core configuration of the bot for this client.
    // Get the user roles configurations for the Guild where this message took place.
    let clientUserEminences = this.configurations.bot.client.userEminences;
    if (this.authorID in clientUserEminences) {
      return Eminence[clientUserEminences[this.authorID]];
    }

    // If the user's ID is not found in the prior config, we'll search the client specific configurations.
    let guildUserEminences = this.configurations.client.guilds[this.resonance.guild.id].userEminences;
    if (this.authorID in guildUserEminences) {
      return Eminence[guildUserEminences[this.authorID]];
    }

    // If nothing is found, we'll assume this user's eminence is None.
    return Eminence.None;
  }

  /**
   * @inheritDoc
   */
  async sendCooldownNotification() {
    // Send a reply alerting the user that the command is on cooldown.
    this.resonance.reply(`That command is on cooldown. :) Please wait!`).then(async message => {
      // Delete the message containing the command.
      this.resonance.message.delete().catch(Igor.continue);

      // After 5 seconds, delete the reply originally sent.
      await Sojiro.wait(5);
      await message.delete().catch(Igor.continue);
    });
  }

  /**
   * Validates that the command can be used in the Discord Guild (Server) where it was invoked.
   *
   * @returns
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  async validateGuild(): Promise<boolean> {
    if (Sojiro.isEmpty(this.configurations.command.client.authorization.blacklist.guilds)) {
      return true;
    }

    return this.configurations.command.client.authorization.blacklist.guilds.includes(this.resonance.guild.id);
  }

  /**
   * Validates that the command can be used in the Discord Channel where it was invoked.
   *
   * @returns
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  async validateChannel(): Promise<boolean> {
    if (Sojiro.isEmpty(this.configurations.command.client.authorization.blacklist.channels)) {
      return true;
    }

    return this.configurations.command.client.authorization.blacklist.channels.includes(this.resonance.channel.id);
  }

}