/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
import Sojiro from "../../../Confidant/Sojiro";
import Morgana from "../../../Confidant/Morgana";

// Imports.
import CommandAuthorizer from './CommandAuthorizer';
import TwitchResonance from "../../Resonance/TwitchResonance";
import Eminence from "../../Eminence/Eminence";
import {TwitchCommandAuthorizerConfigurationsCollection} from "./CommandAuthorizerConfigurations";

/**
 * Provides an Authorizer for commands invoked in Discord.
 */
export default class TwitchCommandAuthorizer extends CommandAuthorizer {

  /**
   * The Resonance containing the command that was heard.
   */
  protected resonance: TwitchResonance;

  /**
   * Object to store relevant configurations.
   */
  protected configurations: TwitchCommandAuthorizerConfigurationsCollection;

  /**
   * Since authorizers are static classes, we'll have a build function to make preparations.
   */
  async build(resonance: TwitchResonance) {
    // Run parent build function.
    await super.build(resonance);
  }

  /**
   * The warrant function. This function will return TRUE if the order is authorized, and FALSE otherwise.
   *
   * Twitch specific checks are performed here.
   */
  async warrant(): Promise<boolean> {
    // Validate that the command is allowed to be used in this Channel.
    if (!this.validateChannel()) {
      await Morgana.warn('channel validation failed');
      return false;
    }

    // If all those checks pass through, we can authorize the command.
    return true;
  }

  /**
   * @inheritDoc
   */
  async getAuthorIdentification() {
    return this.resonance.author.username;
  }

  /**
   * @inheritDoc
   */
  async getAuthorEminence() {
    // First, we'll check if this user's ID is found in the core configuration of the bot for this client.
    // Get the user roles configurations for the Guild where this message took place.
    let clientUserEminences = this.configurations.bot.client.userEminences;
    if (this.authorID in clientUserEminences) {
      return Eminence[clientUserEminences[this.authorID]];
    }

    // First, we'll check if this user's ID is found in the core configuration of the bot.
    // Get the user roles configurations for the Guild where this message took place.
    let channelUserEminences = this.configurations.client.channels[this.resonance.channel.id].userEminences;
    if (this.authorID in channelUserEminences) {
      return Eminence[channelUserEminences[this.authorID]];
    }

    // If nothing is found, we'll assume this user's eminence is None.
    return Eminence.None;
  }

  /**
   * @inheritDoc
   */
  async sendCooldownNotification() {
    // Send a whisper directly to the author.
    await this.resonance.send(this.resonance.author, `That command is on cooldown. :) Please wait!`);
  }

  /**
   * Validates that the command can be used in the Discord Channel where it was invoked.
   *
   * @returns
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  validateChannel(): boolean {
    if (Sojiro.isEmpty(this.configurations.command.client.authorization.blacklist.channels)) {
      return true;
    }

    return this.configurations.command.client.authorization.blacklist.channels.includes(this.resonance.channel.id);
  }

}