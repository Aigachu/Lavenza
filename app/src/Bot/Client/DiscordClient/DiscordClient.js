/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */

// Includes.
const DiscordJSClient = Packages.DiscordJS.Client;

/**
 * Provides a class for Discord Clients managed in Lavenza.
 *
 * This class extends hydrabolt's wonderful discord.js package. Couldn't do this
 * without em. Much love!
 *
 * @see https://discord.js.org/#/
 */
class DiscordClient extends DiscordJSClient {
  constructor(config, bot) {
    // Call the constructor of the Discord Client parent Class.
    super();

    // Assign the bot to the current client.
    this.bot = bot;

    // Assign configurations to the client.
    this.config = config;

    // Command prefix, also set in the Maiden's 'settings.js'.
    this.command_prefix = config.command_prefix;

    // Event: When the client connects to Discord and is ready.
    this.on('ready', () => {
      // Do stuff here.
    });

    // Event: When the discord client receives a message.
    this.on('message', (message) => {
      if (message.content === 'ping') {
        message.reply('Pong!');
      }
    });

    // Event: When the clients disconnects from Discord.
    this.on('disconnected', () => {
      // Do stuff here.
    });

  }

  async authenticate() {
    try {
      await super.login(this.config.token);
    } catch(error) {
      console.log(error);
    }
  }
}

module.exports = DiscordClient;
