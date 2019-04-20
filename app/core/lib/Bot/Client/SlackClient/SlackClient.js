/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {RTMClient as SlackRTMClient} from '@slack/rtm-api';

/**
 * Provides a class for Slack Clients managed in Lavenza.
 *
 * This class extends the official Node Slack SDK RTM API.
 *
 * @see https://slack.dev/node-slack-sdk/rtm-api
 */
export default class SlackClient extends SlackRTMClient {

  /**
   * SlackClient constructor.
   *
   * @param {Object} config
   *   Configuration object to create the client with, fetched from the bot's
   *   configuration file.
   * @param {Bot} bot
   *   Bot that this client is linked to.
   */
  constructor(config, bot) {

    // Retrieve the client token beforehand, since it is needed for the
    // superclass constructor call.
    let token = process.env[`${bot.id.toUpperCase()}_SLACK_TOKEN`];

    // If the token isn't found, we throw an error.
    if (token === undefined) {
      Lavenza.throw('Slack application token is missing for {{bot}}. Make sure the token is set in the /app/.env file at the root of the project. See /app/.env.example for more details.', {bot: bot.id});
    }

    // Call the constructor of the Slack Client parent Class.
    super(token);

    // Assign the bot to the current client.
    this.bot = bot;

    // Just a utility value to track the client type.
    this.type = Lavenza.ClientTypes.Slack;

    // Assign configurations to the client.
    this.config = config;

  }

  /**
   * Authenticate the client. (Login to Slack)
   *
   * @returns {Promise<void>}
   */
  async authenticate() {

    // Await the logging in of this client.
    await super.start().catch(async error => {
      await Lavenza.throw('Failed to authenticate Slack client for {{bot}}.', {bot: this.bot.id, error: error});
    });

  }

}
