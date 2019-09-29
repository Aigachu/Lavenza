/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides an interface to organize a bot's environment variables
 */
export interface BotEnvironmentVariables {

  /**
   * The Discord Token the bot will use, if applicable.
   */
  DISCORD_TOKEN: string;

  /**
   * The Twitch OAuth Token the bot will use, if applicable.
   */
  TWITCH_OAUTH_TOKEN: string;

  /**
   * The Twitch Client ID of the Twitch Dev Application the bot will use, if applicable.
   */
  TWITCH_CLIENT_ID: string;

  /**
   * The CleverBot API Key the bot will use, if applicable.
   */
  CLEVER_BOT_API_KEY: string;

}
