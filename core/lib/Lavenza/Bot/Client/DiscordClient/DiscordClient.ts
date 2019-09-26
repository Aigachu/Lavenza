/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {
  Client as DiscordJSClient,
  RichEmbed as Embed,
  Attachment,
  User,
  Message,
  TextChannel
} from 'discord.js';
import {ClientInterface} from "../ClientInterface";
import {ClientType} from "../ClientType";
import {Bot} from "../../Bot";
import {BotDiscordClientConfig} from "../../BotConfigurations";
import {Morgana} from "../../../Confidant/Morgana";
import {Igor} from "../../../Confidant/Igor";
import {Sojiro} from "../../../Confidant/Sojiro";
import {Gestalt} from "../../../Gestalt/Gestalt";
import {DiscordClientConfigurations, DiscordClientGuildConfigurations} from "../ClientConfigurations";

/**
 * Provides a class for Discord Clients managed in Lavenza.
 *
 * This class extends hydrabolt's wonderful discord.js package. Couldn't do this
 * without em. Much love!
 *
 * @see https://discord.js.org/#/
 */
export class DiscordClient extends DiscordJSClient implements ClientInterface {

  /**
   * @inheritDoc
   */
  public bot: Bot;

  /**
   * @inheritDoc
   */
  public type: ClientType = ClientType.Discord;

  /**
   * @inheritDoc
   */
  public config: BotDiscordClientConfig;

  /**
   * DiscordClient constructor.
   *
   * @param config
   *   Configuration object to create the client with, fetched from the bot's configuration file.
   * @param bot
   *   Bot that this client is linked to.
   */
  constructor(config: BotDiscordClientConfig, bot: Bot) {
    // Call the constructor of the Discord Client parent Class.
    super();

    // Assign the bot to the current client.
    this.bot = bot;

    // Assign configurations to the client.
    this.config = config;

    // Event: When the client connects to Discord and is ready.
    this.on('ready', async () => {
      await Morgana.success('Discord client successfully connected for {{bot}}!', {bot: this.bot.id});

      // We start by syncing the guild configurations.
      let guilds = await Gestalt.sync({}, `/bots/${this.bot.id}/clients/${this.type}/guilds`);

      // Set up initial guild configurations.
      await Promise.all(this.guilds.map(async guild => {
        let baseGuildConfig: DiscordClientGuildConfigurations = {
          name: guild.name,
          commandPrefix: await this.bot.config.commandPrefix,
          userEminences: {},
        };
        if (!(guild.id in guilds)) {
          guilds[guild.id] = baseGuildConfig;
        }
        await Gestalt.update(`/bots/${this.bot.id}/clients/${this.type}/guilds`, guilds)
      }));

      // Set game text.
      this.user.setActivity(this.config['activity']).catch(console.error);
    });

    // Event: When the discord client receives a message.
    this.on('message', (message) => {
      // We ignore messages from any bot.
      if (message.author.bot === true) {
        return;
      }

      this.bot.listen(message, this).catch(Igor.stop);
    });

    // Event: When the clients disconnects from Discord.
    this.on('disconnected', async () => {
      await Morgana.status('Discord client for {{bot}} has disconnected.', {bot: this.bot.id});
    });

    // Event: When the clients disconnects from Discord.
    this.on('error', async () => {
      await Morgana.error("Error has occurred for {{bot}}'s client...", {bot: this.bot.id});
    });
  }

  /**
   * @inheritDoc
   */
  public async getActiveConfigurations(): Promise<DiscordClientConfigurations> {
    return await Gestalt.get(`/bots/${this.bot.id}/clients/${this.type}`);
  }

  /**
   * @inheritDoc
   */
  public async gestalt() {
    // Make sure database collection exists for this client for the given bot.
    await Gestalt.createCollection(`/bots/${this.bot.id}/clients/${this.type}`);

    // Make sure database collection exists for this client's general database.
    await Gestalt.createCollection(`/bots/${this.bot.id}/clients/${this.type}`);

    // Initialize i18n database collection for this client if it doesn't already exist.
    await Gestalt.createCollection(`/i18n/${this.bot.id}/clients/${this.type}`);

    // Initialize i18n contexts, creating them if they don't exist.
    // Translations are manageable through all of these contexts.
    await Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/guilds`);
    await Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/channels`);
    await Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/users`);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * A little utility function to order the bot to type for a set amount of seconds in a given channel.
   *
   * @TODO - Do something about that dumb 'method can be static' message.
   *
   * @param seconds
   *   Amount of seconds to type for.
   * @param channel
   *   The Discord channel to type in.
   */
  public async typeFor(seconds: number, channel: TextChannel) {
    await channel.stopTyping();
    await channel.startTyping(1);
    await Sojiro.wait(seconds);
    await channel.stopTyping();
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Send a cute error message to a destination.
   *
   * @param destination
   *   Destination, normally a channel or a user.
   * @param {string} text
   *   Message of the error.
   * @param {string} type
   *   Type of error. Can be warning, status or error.
   * @param {int} code
   *   Error code.
   *
   * @returns
   *   The message that was sent as an error.
   */
  public async sendError(destination: TextChannel | User, {text = '', type = '', code = 404} = {}): Promise<Message> {
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
        message = 'An error has occurred.';
        break;
    }

    // Determine color.
    switch (type) {
      case 'warning':
        color = '0xf4d742';
        image = {
          attachment: new Attachment('./core/assets/warning.png', 'warning.png'),
          name: 'warning.png'
        };
        break;

      default:
        color = '0xa5201d';
        image = {
          attachment: new Attachment('./core/assets/error.png', 'error.png'),
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
    }) as Message;
  }

  /**
   * Send a embed to a channel.
   *
   * @see https://leovoel.github.io/embed-visualizer/
   *
   * @param destination
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
   * @returns
   *   The message that was sent as an embed.
   */
  public async sendEmbed(destination: TextChannel | User, {title = '', description = '', header = {}, url = '', color = '', image = '', thumbnail = '', fields = [], footer = {}, attachments = [], timestamp = false} = {}): Promise<Message | Message[]> {

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
      embed.setAuthor(header['text'], header['icon']);
    }

    // Set Footer if any.
    if (footer) {
      embed.setFooter(footer['text'], footer['icon']);
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
    return await destination.send(embed);
  }

  /**
   * Authenticate the client. (Login to Discord)
   *
   * @inheritDoc
   */
  public async authenticate() {
    // Get the token.
    let token = this.bot.env.DISCORD_TOKEN;

    // If the token isn't found, we throw an error.
    if (token === undefined) {
      await Igor.throw(`Discord application token is missing for {{bot}}. Make sure the token is set in the .env file in the bot's folder. See the example bot folder for more details.`, {bot: this.bot.id});
    }

    // Await the login in of this client.
    await super.login(token).catch(async () => {
      await Igor.throw('Failed to authenticate Discord client for {{bot}}.', {bot: this.bot.id});
    });
  }

  /**
   * Disconnect from Discord.
   *
   * @inheritDoc
   */
  public async disconnect() {
    // Call the destruction function to disconnect the client.
    await this.destroy();

    await Morgana.warn('Discord client disconnected for {{bot}}.', {bot: this.bot.id});
  }

}
