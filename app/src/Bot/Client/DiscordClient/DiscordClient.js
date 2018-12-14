/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import ClientTypes from '../ClientTypes';
import DiscordJS, {Client as DiscordJSClient, RichEmbed as Embed, Attachment} from 'discord.js';

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

    // Event: When the client connects to Discord and is ready.
    this.on('ready', () => {
      Lavenza.success('DISCORD_CLIENT_CONNECT', [this.bot.name]);

      // Set game text.
      this.user.setActivity(this.config.activity).catch(console.error);
    });

    // Event: When the discord client receives a message.
    this.on('message', (message) => {
      this.bot.listen(message, this).catch(Lavenza.stop);
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
   *
   * @param destination
   */
  async sendError(destination, {text, type, code} = {}) {

    // Initialize some variables.
    let message = '';
    let color = '';
    let image = null;

    // Determine code.
    switch (code) {
      case 401:
        message = 'Unauthorized.';
        break;

      default:
        message = 'An error has occured.';
        break;
    }

    // Determine color.
    switch (type) {
      case 'warning':
        color = '0xf4d742';
        image = {
          attachment: new DiscordJS.Attachment('./assets/warning.png', 'warning.png'),
          name: 'warning.png'
        };
        break;

      default:
        color = '0xa5201d';
        image = {
          attachment: new DiscordJS.Attachment('./assets/error.png', 'error.png'),
          name: 'error.png'
        };
        break;
    }

    // Send the embed.
    return await this.sendEmbed(destination, {
      description: text,
      header: {
        text: `${code}: ${message}`,
        icon: `attachment://${image.name}`
      },
      color: color,
      timestamp: true,
      attachments: [
        image.attachment
      ],

    }).catch(Lavenza.stop);
  }

  /**
   * Send a embed to a channel.
   *
   * @see https://leovoel.github.io/embed-visualizer/
   *
   * @param {*} destination
   *   The destination can be a channel or a user.
   * @param {string} title
   *   The title of the rich embed.
   * @param {string} description
   *   The description of the rich embed.
   * @param {Object} header
   *   Object that should contain the *text* of the header and the *icon* if applicable.
   * @param {string} url
   *   URL of the rich embed.
   * @param {string} color
   *   Color of the left border of the rich embed.
   * @param {string} image
   *   Main image of the rich embed. Usually an attachment reference.
   * @param {string} thumbnail
   *   Main thumbnail of the rich embed. Usually an attachment reference.
   * @param {Array} fields
   *   Fields of the rich embed.
   * @param {Object} footer
   *   Object that should contain the *text* of the footer and the *icon* if applicable.
   * @param {Array<Attachment>} attachments
   *   Array of attachments to attach to the embed.
   * @param {Boolean} timestamp
   *   Controls whether or not we want to add a timestamp of the current time.
   *
   * @returns {Promise<void>}
   */
  async sendEmbed(destination, {title, description, header, url, color, image, thumbnail, fields, footer, attachments, timestamp} = {}) {

    // Create the embed instance.
    let embed = new Embed();

    // Manage default values.
    color = color || '0x1C1CF0';

    // Set default values.
    embed.setColor(color);

    // If timestamp is set to true, set it.
    if (timestamp) {
      embed.setTimestamp(new Date());
    }

    // Set Title if any.
    if (title) {
      embed.setTitle(title);
    }

    // Set Description if any.
    if (description) {
      embed.setDescription(description);
    }

    // Set Header/Author if any.
    if (header) {
      embed.setAuthor(header.text, header.icon);
    }

    // Set Footer if any.
    if (footer) {
      embed.setFooter(footer.text, footer.icon);
    }

    // Set Thumbnail if any.
    if (thumbnail) {
      embed.setThumbnail(thumbnail);
    }

    // Set Image if any.
    if (image) {
      embed.setImage(image);
    }

    // Set fields, if any.
    if (fields) {
      fields.every(field => {
        embed.addField(field.name, field.text);
        return true;
      });
    }

    // Set attachments, if any.
    if (attachments) {
      embed.attachFiles(attachments);
    }

    // If url is set, we set it here.
    if (url) {
      embed.setURL(url);
    }

    // Send the embed.
    return await destination.send(embed).catch(Lavenza.stop);

  }

  /**
   * Authenticate the client. (Login to Discord)
   *
   * @returns {Promise<void>}
   */
  async authenticate() {
    // Get the token.
    let token = process.env[`${this.bot.name.toUpperCase()}_DISCORD_TOKEN`];

    // If the token isn't found, we throw an error.
    if (token === undefined) {
      Lavenza.throw('TOKEN_NOT_FOUND_IN_ENV_FOR_BOT', [this.bot.name]);
    }

    // Await the login in of this client.
    /** @catch Stop execution. */
    await super.login(token).catch(error => {
      Lavenza.throw('CLIENT_AUTHENTICATION_FAILURE', [this.type, this.bot.name]);
    });
  }
}
