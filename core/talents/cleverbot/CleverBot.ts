/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import * as CleverBotApi from 'cleverbot';
import Talent from "../../lib/Lavenza/Talent/Talent";
import {TalentConfigurations} from "../../lib/Lavenza/Talent/TalentConfigurations";
import Bot from "../../lib/Lavenza/Bot/Bot";
import Igor from "../../lib/Lavenza/Confidant/Igor";
import Morgana from "../../lib/Lavenza/Confidant/Morgana";

/**
 * CleverBot Talent.
 *
 * Provide CleverBot functionality to an existing Lavenza Bot.
 */
export default class CleverBot extends Talent {

  /**
   * The CleverBot API connection.
   */
  public cleverBotApi: CleverBotApi;

  /**
   * @inheritDoc
   */
  async build(config: TalentConfigurations) {
    // Run default builder.
    await super.build(config);
  }

  /**
   * @inheritDoc
   */
  async initialize(bot: Bot) {
    // Run default initializer.
    await super.initialize(bot);

    // Initialize CleverBot API connection with Bot ENV.
    let cleverBotApiKey = bot.env.CLEVER_BOT_API_KEY;

    // If the token isn't found, we throw an error.
    if (cleverBotApiKey === undefined) {
      await Morgana.error(`CleverBot API Key is missing for {{bot}}. An entry called CLEVER_BOT_API_KEY must be found in the bot's env file for the CleverBot Talent to work.`, {bot: bot.id});
      return;
    }

    // Initialize variables if all is well.
    this.cleverBotApi = new CleverBotApi({key: cleverBotApiKey});
  }

}