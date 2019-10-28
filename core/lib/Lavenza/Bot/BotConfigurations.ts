/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Declares an interface schema for Base Bot Configurations.
 */
export interface BotConfigurations {

  /**
   * Reader-Friendly name of the Bot.
   */
  name: string;

  /**
   * Flag that determines whether this bot is active or not. Inactive bots will not be summoned.
   */
  active: boolean;

  /**
   * Path to the directory where this bot's files are stored.
   */
  directory: string;

  /**
   * The global default command prefix for this bot.
   */
  commandPrefix: string;

  /**
   * The global default language this bot will communicate in.
   */
  locale: string;

  /**
   * List of machinenames of Talents that are enabled for this bot.
   */
  talents: string[];

  /**
   * List of clients that this bot is connected to.
   */
  clients: string[];

}
