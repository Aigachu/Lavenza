/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import TwitchJSClient from 'twitch'

/**
 * Provides a class for Twitch Clients managed in Lavenza.
 *
 * This class extends d-fischer's wonderful twitch.js package. Couldn't do this
 * without em. Much love!
 *
 * @see https://www.npmjs.com/package/twitch
 */
export default class TwitchClient extends TwitchJSClient {

  /**
   * TwitchClient constructor.
   *
   * @param {Object} config
   *   Configuration object to create the client with, fetched from the bot's configuration file.
   * @param {Bot} bot
   *   Bot that this client is linked to.
   */
  constructor(config, bot) {

    // Call the constructor of the Discord Client parent Class.
    super();

    // Assign the bot to the current client.
    this.bot = bot;

    // Just a utility value to track the client type.
    this.type = Lavenza.ClientTypes.Discord;

    // Assign configurations to the client.
    this.config = config;

    // Event: When the client connects to Discord and is ready.
    this.on('ready', async () => {
      await Lavenza.success('Discord client successfully connected for {{bot}}!', {bot: this.bot.id});

      // Set game text.
      this.user.setActivity(this.config['activity']).catch(console.error);
    });

    // Event: When the discord client receives a message.
    this.on('message', (message) => {
      this.bot.listen(message, this).catch(Lavenza.continue);
    });

    // Event: When the clients disconnects from Discord.
    this.on('disconnected', () => {
      Lavenza.status('Discord client for {{bot}} has disconnected.', {bot: this.bot.id});
    });

    // Event: When the clients disconnects from Discord.
    this.on('error', async () => {
      await Lavenza.error("Error has occurred for {{bot}}'s client...", {bot: this.bot.id});
    });

  }

  /**
   * Authenticate the client. (Login to Discord)
   *
   * @returns {Promise<void>}
   */
  async authenticate() {

    // Get the token.
    let token = process.env[`${this.bot.id.toUpperCase()}_DISCORD_TOKEN`];

    // If the token isn't found, we throw an error.
    if (token === undefined) {
      await Lavenza.throw('Discord application token is missing for {{bot}}. Make sure the token is set in the /app/.env file at the root of the project. See /app/.env.example for more details.', {bot: this.bot.id});
    }

    // Await the login in of this client.
    await super.login(token).catch(async error => {
      await Lavenza.throw('Failed to authenticate Discord client for {{bot}}.', {bot: this.bot.id});
    });

  }
}
