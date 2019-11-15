/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { AssociativeObject } from "../../Types";
import { BotClientConfig, ClientConfigurations } from "../ClientConfigurations";

/**
 * Expose an interface to describe Discord Client configurations.
 */
export interface TwitchClientConfigurations extends ClientConfigurations {

  /**
   * Associative list of configurations per Twitch channel, using the Guild's unique ID as keys.
   */
  channels: AssociativeObject<TwitchClientChannelConfigurations>;

}

/**
 * Expose an interface to describe Twitch Client configurations for channels.
 */
export interface TwitchClientChannelConfigurations {

  /**
   * Name of the channel this configuration is for.
   */
  name: string;

  /**
   * Command prefix set to this channel.
   */
  commandPrefix: string;

  /**
   * User Eminence information for this channel.
   */
  userEminences: AssociativeObject<string>;
}

/**
 * Declares a schema for Bot Client Configurations specific to Twitch Clients.
 */
export interface BotTwitchClientConfig extends BotClientConfig {

  /**
   * Username of the Twitch account the Bot will be using.
   */
  username: string;

  /**
   * Twitch channels this bot will interact in and connect to.
   */
  channels: string[];

}
