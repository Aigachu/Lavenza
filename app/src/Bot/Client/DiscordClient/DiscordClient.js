/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import ClientTypes from '../ClientTypes';
import {Client as DiscordJSClient} from 'discord.js';

/**
 * Provides a class for Discord Clients managed in Lavenza.
 *
 * This class extends hydrabolt's wonderful discord.js package. Couldn't do this
 * without em. Much love!
 *
 * @see https://discord.js.org/#/
 */
export default class DiscordClient extends DiscordJSClient {

  /**
   * DiscordClient constructor.
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
    this.type = ClientTypes.Discord;

    // Assign configurations to the client.
    this.config = config;

    // Command prefix, also set in the Maiden's 'settings.js'.
    this.command_prefix = config.command_prefix || bot.config.command_prefix;



    // Event: When the client connects to Discord and is ready.
    this.on('ready', () => {
      Lavenza.success('DISCORD_CLIENT_CONNECT', [this.bot.name]);
    });

    // Event: When the discord client receives a message.
    this.on('message', (message) => {
      this.bot.listen(message, this);
    });

    // Event: When the clients disconnects from Discord.
    this.on('disconnected', () => {
      Lavenza.status('DISCORD_CLIENT_DISCONNECT', [this.bot.name]);
    });

    // Event: When the clients disconnects from Discord.
    this.on('error', () => {
      Lavenza.error('ERROR_OCCURRED', [this.bot.name]);
    });

  }

  /**
   * Authenticate the client. (Login to Discord)
   *
   * @returns {Promise<void>}
   */
  async authenticate() {
    try {
      // Await the login in of this client.
      /** @catch Stop execution. */
      await super.login(this.config.token).catch(Lavenza.stop);
    } catch(error) {
      Lavenza.throw('CLIENT_AUTHENTICATION_FAILURE', [this.type, this.bot.name]);
    }
  }
}
