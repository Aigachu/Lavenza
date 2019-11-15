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
export interface DiscordClientConfigurations extends ClientConfigurations {

  /**
   * Associative list of configurations per Discord guild, using the Guild's unique ID as keys.
   */
  guilds: AssociativeObject<DiscordClientGuildConfigurations>;

}

/**
 * Expose an interface to describe Discord Client configurations for guilds.
 */
export interface DiscordClientGuildConfigurations {

  /**
   * Name of the guild this configuration is for.
   */
  name: string;

  /**
   * Command prefix set to this guild.
   */
  commandPrefix: string;

  /**
   * User Eminence information for this guild.
   */
  userEminences: AssociativeObject<string>;
}

/**
 * Declares a schema for Bot Client Configurations specific to Discord Clients.
 */
export interface BotDiscordClientConfig extends BotClientConfig {

  /**
   * Activity to show for the Bot when it's connected to Discord.
   */
  activity: string;

  /**
   * URL used to integrate the bot into servers of anyone's choosing.
   */
  integrationUrl: string;

}
