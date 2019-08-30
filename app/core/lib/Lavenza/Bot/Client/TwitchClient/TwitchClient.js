/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
const TMIClient = require('tmi.js').Client;
const TwitchUser = require('./TwitchUser');
const TwitchChannel = require('./TwitchChannel');

/**
 * Provides a class for Twitch Clients managed in Lavenza.
 *
 * This class extends tmi.js. Much love to their work and developers!
 *
 * @see https://www.npmjs.com/package/twitch
 */
module.exports = class TwitchClient extends TMIClient {

  /**
   * TwitchClient constructor.
   *
   * @param {Object} config
   *   Configuration object to create the client with, fetched from the bot's configuration file.
   * @param {Bot} bot
   *   Bot that this client is linked to.
   */
  constructor(config, bot) {

    // Build the configuration that the parent TMI client wants.
    let tmiConfiguration = {
      identity: {
        username: config.username,
        password: process.env[`${bot.id.toUpperCase()}_TWITCH_OAUTH_TOKEN`]
      },
      channels: config.channels
    };

    // Call the constructor of the Discord Client parent Class.
    super(tmiConfiguration);

    // Assign the bot to the current client.
    this.bot = bot;

    // Just a utility value to track the client type.
    this.type = Lavenza.ClientTypes.Twitch;

    // Assign configurations to the client.
    this.config = config;

    // Event: When the client connects to Twitch and is ready.
    this.on('connected', async () => {
      await Lavenza.success('Twitch client successfully connected for {{bot}}!', {bot: this.bot.id});
    });

    // Event: When the twitch client receives a message.
    this.on('message', (target, context, message, self) => {

      // Ignore messages from this bot.
      if (self) { return; }

      // Relevant information will be built and stored like so.
      // It is built to be organized like Discord.JS organizes it. Seems to be our best bet to keep things clean!
      let msgData = {
        author: new TwitchUser(
          context['username'],
          context['username'],
          context['display-name'],
        ),
        content: message,
        context: context,
        channel: new TwitchChannel(target.replace('#', ''), context['message-type'])
      };

      this.bot.listen(msgData, this).catch(Lavenza.stop);

    });

  }

  /**
   * Authenticate the client. (Connect to Twitch)
   *
   * @returns {Promise<void>}
   */
  async authenticate() {

    // Simply call TMI's connect function.
    await this.connect();

  }

  /**
   * Disconnect from Twitch.
   *
   * @returns {Promise<void>}
   */
  async disconnect() {

    // Simply call TMI's disconnect function.
    await super.disconnect();

    await Lavenza.warn('Twitch client disconnected for {{bot}}.', {bot: this.bot.id});

  }

};
