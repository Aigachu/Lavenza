/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// I have to include twitch-api-v5 in the old way because this package isn't ES6 ready...GROSS!!!
import CleverBotP from 'cleverbot';
if (Lavenza.isEmpty(process.env.CLEVER_BOT_API_KEY)) {
  Lavenza.warn(`There doesn't seem to be a CLEVER_BOT_API_KEY environment variable set in your .env file. This will BREAK ALL CleverBot functionality. It is highly recommended to add this variable to your .env if you are using the CleverBot talent. See the .example.env file for more details!`);
}

/**
 * CleverBot Talent.
 *
 * Provide CleverBot functionality to an existing Lavenza Bot.
 */
export default class CleverBot extends Lavenza.Talent {

  /**
   * @inheritDoc
   */
  static async build(config) {

    // Run default builders.
    await super.build(config);

    // Initialize variables if needed.
    this.cleverbot = new CleverBotP({key: process.env.CLEVER_BOT_API_KEY});
  }

}