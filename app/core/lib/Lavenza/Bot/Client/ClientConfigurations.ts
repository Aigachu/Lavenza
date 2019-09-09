/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

import {AssociativeObject} from "../../Types";

/**
 * Expose an interface to describe Discord Client configurations.
 */
export interface ClientConfigurations {

}

/**
 * Expose an interface to describe Discord Client configurations.
 */
export interface DiscordClientConfigurations extends ClientConfigurations {
  guilds: AssociativeObject<DiscordClientGuildConfigurations>;
}

/**
 * Expose an interface to describe Discord Client configurations for guilds.
 */
export interface DiscordClientGuildConfigurations {
  name: string;
  commandPrefix: string;
  userEminences: AssociativeObject<string>;
}

/**
 * Expose an interface to describe Discord Client configurations.
 */
export interface TwitchClientConfigurations {
  channels: AssociativeObject<TwitchClientChannelConfigurations>;
}

/**
 * Expose an interface to describe Twitch Client configurations for channels.
 */
export interface TwitchClientChannelConfigurations {
  name: string;
  commandPrefix: string;
  userEminences: AssociativeObject<string>;
}