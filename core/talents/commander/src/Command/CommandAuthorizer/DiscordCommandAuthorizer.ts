/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import { Message } from "discord.js";

// Imports.
import { Igor } from "../../../../../lib/Lavenza/Confidant/Igor";
import { Morgana } from "../../../../../lib/Lavenza/Confidant/Morgana";
import { Sojiro } from "../../../../../lib/Lavenza/Confidant/Sojiro";
import { Command } from "../Command";
import { CommandAuthorizer } from "./CommandAuthorizer";
import { Eminence } from "../../../../../lib/Lavenza/Eminence/Eminence";
import { Resonance } from "../../../../../lib/Lavenza/Resonance/Resonance";

import { DiscordCommandAuthorizerConfigurationsCollection } from "../../../../../lib/Lavenza/Client/Discord/DiscordConfigurations";
import { DiscordResonance } from "../../../../../lib/Lavenza/Client/Discord/DiscordResonance";

/**
 * Provides an Authorizer for commands invoked in Discord.
 */
export class DiscordCommandAuthorizer extends CommandAuthorizer {

  /**
   * The Resonance containing the command that was heard.
   */
  protected resonance: DiscordResonance;

  /**
   * The Resonance containing the command that was heard.
   */
  protected message: Message;

  /**
   * Object to store relevant configurations.
   */
  protected configurations: DiscordCommandAuthorizerConfigurationsCollection;

  /**
   * @inheritDoc
   */
  public constructor(command: Command, resonance: DiscordResonance) {
    super(command, resonance);
  }

  /**
   * The warrant function. This function will return TRUE if the command is authorized, and FALSE otherwise.
   *
   * Discord specific checks are performed here.
   */
  protected async warrant(): Promise<boolean> {
    // If the message is not a direct message, we assume it is in a server and do additional validations.
    const messageIsPrivate = await this.resonance.isPrivate();
    if (!messageIsPrivate) {
      // Validate that the command is allowed to be used in this Guild (Server).
      const guildValidation = await this.validateGuild();
      if (!guildValidation) {
        await Morgana.warn("discord guild validation failed");

        return false;
      }

      // Validate that the command is allowed to be used in this Channel.
      const channelValidation = await this.validateChannel();
      if (!channelValidation) {
        await Morgana.warn("discord channel validation failed");

        return false;
      }
    }

    // If all those checks pass through, we can authorize the command.
    return true;
  }

  /**
   * Get Author unique identifier in Discord context.
   *
   * @inheritDoc
   */
  protected async getAuthorIdentification(): Promise<string> {
    return this.resonance.author.id;
  }

  /**
   * Get Author Eminence in Discord context.
   *
   * @inheritDoc
   *
   * @TODO - Explore some cool stuff to do with Discord Roles. i.e. Discord Role Permissions determining Eminence.
   */
  protected async getAuthorEminence(): Promise<Eminence> {
    // First, we'll check if this user's ID is found in the core configuration of the bot for this client.
    // Get the user roles configurations for the Guild where this message took place.
    const clientUserEminences = this.configurations.bot.client.userEminences;
    if (clientUserEminences && clientUserEminences[this.authorID]) {
      return Eminence[clientUserEminences[this.authorID]];
    }

    // If the user's ID is not found in the prior config, we'll search the client specific configurations.
    const guildUserEminences = this.configurations.client.guilds[this.resonance.guild.id].userEminences;
    if (guildUserEminences && guildUserEminences[this.authorID]) {
      return Eminence[guildUserEminences[this.authorID]];
    }

    // If nothing is found, we'll assume this user's eminence is None.
    return Eminence.None;
  }

  /**
   * Send a cooldown notification in Discord.
   *
   * In Discord, we delete this notification after a few moments.
   *
   * @inheritDoc
   */
  protected async sendCooldownNotification(): Promise<void> {
    // Send a reply alerting the user that the command is on cooldown.
    this.resonance.reply("That command is on cooldown. :) Please wait!")
      .then(async (message: Message) => {
      // Delete the message containing the command.
      this.resonance.message.delete()
        .catch(Igor.continue);

      // After 5 seconds, delete the reply originally sent.
      await Sojiro.wait(5);
      await message.delete()
        .catch(Igor.continue);
    });
  }

  /**
   * Validates that the command can be used in the Discord Guild (Server) where it was invoked.
   *
   * @returns
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  private async validateGuild(): Promise<boolean> {
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
  private async validateChannel(): Promise<boolean> {
    if (Sojiro.isEmpty(this.configurations.command.client.authorization.blacklist.channels)) {
      return true;
    }

    return this.configurations.command.client.authorization.blacklist.channels.includes(this.resonance.channel.id);
  }

}
