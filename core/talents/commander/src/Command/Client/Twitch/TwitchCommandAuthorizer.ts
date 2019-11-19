/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { TwitchResonance } from "../../../../../../lib/Lavenza/Client/Twitch/TwitchResonance";
import { Morgana } from "../../../../../../lib/Lavenza/Confidant/Morgana";
import { Sojiro } from "../../../../../../lib/Lavenza/Confidant/Sojiro";
import { Eminence } from "../../../../../../lib/Lavenza/Eminence/Eminence";
import { Instruction } from "../../../Instruction/Instruction";
import { Command } from "../../Command";
import { CommandAuthorizer } from "../../CommandAuthorizer/CommandAuthorizer";

import { TwitchCommandAuthorizerConfigurationsCollection } from "./TwitchCommandConfigurations";

/**
 * Provides an Authorizer for commands invoked in Discord.
 */
export class TwitchCommandAuthorizer extends CommandAuthorizer {

  /**
   * The Resonance containing the command that was heard.
   */
  protected resonance: TwitchResonance;

  /**
   * Object to store relevant configurations.
   */
  protected configurations: TwitchCommandAuthorizerConfigurationsCollection;

  /**
   * @inheritDoc
   */
  public constructor(command: Command, instruction: Instruction) {
    super(command, instruction);
  }

  /**
   * The warrant function. This function will return TRUE if the order is authorized, and FALSE otherwise.
   *
   * Twitch specific checks are performed here.
   */
  protected async warrant(): Promise<boolean> {
    // If the message is not a direct message, we assume it is in a server and do additional validations.
    const messageIsPrivate = await this.resonance.isPrivate();
    if (!messageIsPrivate) {
      // Validate that the command is allowed to be used in this Channel.
      const channelValidation = await this.validateChannel();
      if (!channelValidation) {
        await Morgana.warn("twitch channel validation failed");

        return false;
      }
    }

    // If all those checks pass through, we can authorize the command.
    return true;
  }

  /**
   * Get Twitch user unique identification.
   *
   * In this case it's simply the username of the user.
   *
   * @inheritDoc
   */
  protected async getAuthorIdentification(): Promise<string> {
    return this.resonance.author.username;
  }

  /**
   * Get Author Eminence in Twitch context.
   *
   * @inheritDoc
   *
   * @TODO - Explore some cool stuff to do with Twitch Roles. i.e. Twitch Chat Statuses (VIP, Mod) determining Eminence.
   */
  protected async getAuthorEminence(): Promise<Eminence> {
    // First, we'll check if this user's ID is found in the core configuration of the bot for this client.
    // Get the user roles configurations for the Guild where this message took place.
    const clientUserEminences = this.configurations.bot.client.userEminences;
    if (this.authorID in clientUserEminences) {
      return Eminence[clientUserEminences[this.authorID]];
    }

    // First, we'll check if this user's ID is found in the core configuration of the bot.
    // Get the user roles configurations for the Guild where this message took place.
    const channelUserEminences = this.configurations.client.channels[this.resonance.channel.id].userEminences;
    if (this.authorID in channelUserEminences) {
      return Eminence[channelUserEminences[this.authorID]];
    }

    // If nothing is found, we'll assume this user's eminence is None.
    return Eminence.None;
  }

  /**
   * Send cooldown notification in twitch.
   *
   * In Twitch, we send a whisper to the person in question.
   *
   * @inheritDoc
   */
  protected async sendCooldownNotification(): Promise<void> {
    // Send a whisper directly to the author.
    await this.resonance.send(this.resonance.author, "That command is on cooldown. :) Please wait!");
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
