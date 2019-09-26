/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

import {User} from "discord.js";
import {TwitchUser} from "./Client/TwitchClient/TwitchUser";
import {AssociativeObject} from "../Types";

/**
 * Declares an interface schema for Base Bot Configurations.
 */
export interface BotConfigurations {
  name: string;
  active: boolean;
  directory: string;
  commandPrefix: string;
  locale: string;
  talents: Array<string>;
  clients: Array<string>;
}

/**
 * Declares an interface for Joker, the object that exposes information about the bot's superuser.
 */
export interface Joker {
  discord: User;
  twitch: TwitchUser;
}

/**
 * Declares a schema for Bot Client Configurations.
 */
export interface BotClientConfig {
  joker: string;
  commandPrefix: string;
  userEminences: AssociativeObject<string>;
}

/**
 * === DISCORD ===
 */

/**
 * Declares a schema for Bot Client Configurations specific to Discord Clients.
 */
export interface BotDiscordClientConfig extends BotClientConfig {
  activity: string;
  integrationUrl: string;
}

/**
 * === TWITCH ===
 */

/**
 * Declares a schema for Bot Client Configurations specific to Twitch Clients.
 */
export interface BotTwitchClientConfig extends BotClientConfig {
  username: string;
  channels: Array<string>;
}