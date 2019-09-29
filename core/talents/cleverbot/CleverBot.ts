/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import * as CleverBotApi from "cleverbot";

import { Bot } from "../../lib/Lavenza/Bot/Bot";
import { Morgana } from "../../lib/Lavenza/Confidant/Morgana";
import { Talent } from "../../lib/Lavenza/Talent/Talent";

/**
 * CleverBot Talent.
 *
 * Provide CleverBot functionality to an existing Lavenza Bot.
 */
export class CleverBot extends Talent {

  /**
   * The CleverBot API connection.
   */
  public cleverBotApi: CleverBotApi;

  /**
   * Initializers for CleverBot talent.
   *
   * Here, we expect to obtain a CleverBot API Key in environement variables for Bots using this talent.
   *
   * @inheritDoc
   */
  public async initialize(bot: Bot): Promise<void> {
    // Run default initializer.
    await super.initialize(bot);

    // Initialize CleverBot API connection with Bot ENV.
    const cleverBotApiKey = bot.env.CLEVER_BOT_API_KEY;

    // If the token isn't found, we throw an error.
    if (cleverBotApiKey === undefined) {
      await Morgana.error(
        "CleverBot API Key is missing for {{bot}}. An entry called CLEVER_BOT_API_KEY must be found in the bot's env file for the CleverBot Talent to work.",
        {
          bot: bot.id,
        },
      );

      return;
    }

    // Initialize variables if all is well.
    this.cleverBotApi = new CleverBotApi({key: cleverBotApiKey});
  }

}
