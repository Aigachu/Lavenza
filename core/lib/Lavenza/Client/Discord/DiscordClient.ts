/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules
import {
  Attachment,
  Client as DiscordJSClient, DMChannel, GroupDMChannel,
  Message,
  RichEmbed as Embed,
  TextChannel,
  User,
} from "discord.js";

// Imports.
import { Bot } from "../../Bot/Bot";
import { Igor } from "../../Confidant/Igor";
import { Morgana } from "../../Confidant/Morgana";
import { Sojiro } from "../../Confidant/Sojiro";
import { Core } from "../../Core/Core";
import { EventSubscriberManager } from "../../Service/EventSubscriber/EventSubscriberManager";
import { AbstractObject } from "../../Types";
import { Client } from "../Client";
import { BotClientConfig } from "../ClientConfigurations";
import { ClientType } from "../ClientType";

import {
  BotDiscordClientConfig,
} from "./DiscordConfigurations";

/**
 * Provides a class for Discord Clients managed in Lavenza.
 *
 * This class extends hydrabolt's wonderful discord.js package. Couldn't do this
 * without em. Much love!
 *
 * @see https://discord.js.org/#/
 */
export class DiscordClient extends Client {

  /**
   * The type of client.
   *
   * @inheritDoc
   */
  public type: ClientType = ClientType.Discord;

  /**
   * Client configuration for the Bot this client is connected to.
   *
   * @inheritDoc
   */
  public config: BotDiscordClientConfig;

  /**
   * Store the connector that will be use to connect Discord.
   *
   * @inheritDoc
   */
  public connector: DiscordJSClient;

  /**
   * @inheritDoc
   */
  public constructor(bot: Bot, config: BotClientConfig) {
    super(bot, config);
  }

  /**
   * Bridge a connection to Discord.
   *
   * We'll use Discord.JS here! Thank you hydrabolt. :)
   *
   * @inheritDoc
   */
  public async bridge(): Promise<void> {
    this.connector = new DiscordJSClient();
  }

  /**
   * Run build tasks to prepare any necessary functions.
   *
   * Treat this as a proper constructor.
   */
  public async build(): Promise<void> {
    // Event: When the client connects to Discord and is ready.
    this.connector.on("ready", async () => {
      // Set game text.
      this.connector.user.setActivity(this.config.activity).catch(console.error);

      // Run Event Subscribers for this event.
      await EventSubscriberManager.runEventSubscribers(this, "ready", {});
    });

    // Event: When the discord client connects to a new guild.
    this.connector.on("guildCreate", async (guild) => {
      // Run Event Subscribers for this event.
      await EventSubscriberManager.runEventSubscribers(this, "guildCreate", {guild});
    });

    // Event: When the discord client receives a message.
    this.connector.on("message", async (message) => {
      // Ignore messages from any discord bots.
      if (message.author.bot) {
        return;
      }

      // Run Event Subscribers for this event.
      await EventSubscriberManager.runEventSubscribers(this, "message", {message});
    });

    // Event: When the clients disconnects from Discord.
    this.connector.on("disconnected", async () => {
      await Morgana.status("Discord client for {{bot}} has disconnected.", {bot: this.bot.id});

      // Run Event Subscribers for this event.
      await EventSubscriberManager.runEventSubscribers(this, "disconnected");
    });

    // Event: When the clients disconnects from Discord.
    this.connector.on("error", async () => {
      await Morgana.error("Error has occurred for {{bot}}'s client...", {bot: this.bot.id});

      // Run Event Subscribers for this event.
      await EventSubscriberManager.runEventSubscribers(this, "error");
    });
  }

  /**
   * Authenticate the client. (Login to Discord)
   *
   * @inheritDoc
   */
  public async authenticate(): Promise<void> {
    // Get the token.
    const token = this.bot.env.DISCORD_TOKEN;

    // If the token isn't found, we throw an error.
    if (token === undefined) {
      await Igor.throw("Discord application token is missing for {{bot}}. Make sure the token is set in the .env file in the bot's folder. See the example bot folder for more details.", {bot: this.bot.id});
    }

    // Await the login in of this client.
    await this.connector.login(token)
      .catch(async () => {
        await Igor.throw("Failed to authenticate Discord client for {{bot}}.", {bot: this.bot.id});
      });
  }

  /**
   * Disconnect from Discord.
   *
   * @inheritDoc
   */
  public async disconnect(): Promise<void> {
    // Call the destruction function to disconnect the client.
    await this.connector.destroy();

    await Morgana.warn("Discord client disconnected for {{bot}}.", {bot: this.bot.id});
  }

  /**
   * Bootstrap database folders for Discord client.
   *
   * @inheritDoc
   */
  public async gestalt(): Promise<void> {
    // Initialize i18n contexts, creating them if they don't exist.
    // Translations are manageable through all of these contexts.
    await Core.gestalt().sync({}, `/i18n/${this.bot.id}/clients/${this.type}/guilds`);
    await Core.gestalt().sync({}, `/i18n/${this.bot.id}/clients/${this.type}/channels`);
    await Core.gestalt().sync({}, `/i18n/${this.bot.id}/clients/${this.type}/users`);
  }

  /**
   * Fetch a Discord user's information.
   *
   * @inheritDoc
   */
  public async getUser(identifier: string): Promise<User> {
    return this.connector.fetchUser(identifier);
  }

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
  public async typeFor(seconds: number, channel: TextChannel | DMChannel | GroupDMChannel): Promise<void> {
    await channel.stopTyping();
    await channel.startTyping(1);
    await Sojiro.wait(seconds);
    await channel.stopTyping();
  }

  // tslint:disable-next-line:comment-format
  // noinspection JSUnusedGlobalSymbols
  /**
   * Send a cute error message to a destination.
   *
   * @param destination
   *   Destination, normally a channel or a user.
   * @param text
   *   Message of the error.
   * @param type
   *   Type of error. Can be warning, status or error.
   * @param code
   *   Error code.
   *
   * @returns
   *   The message that was sent as an error.
   */
  public async sendError(
    destination: TextChannel | GroupDMChannel | DMChannel | User,
    {
      text = "",
      type = "",
      code = 404,
    }: AbstractObject = {},
  ): Promise<Message> {
    // Initialize some variables.
    let message = "";
    let color = "";
    let image;

    // Determine code.
    switch (code) {
      case 401:
        message = "Unauthorized.";
        break;

      default:
        message = "An error has occurred.";
    }

    // Determine color.
    switch (type) {
      case "warning":
        color = "0xf4d742";
        image = {
          attachment: new Attachment("./core/assets/warning.png", "warning.png"),
          name: "warning.png",
        };
        break;

      default:
        color = "0xa5201d";
        image = {
          attachment: new Attachment("./core/assets/error.png", "error.png"),
          name: "error.png",
        };
    }

    // Send the embed.
    return await this.sendEmbed(destination, {
      attachments: [
        image.attachment,
      ],
      color,
      description: text,
      header: {
        icon: `attachment://${image.name}`,
        text: `${code}: ${message}`,
      },
      timestamp: true,
    }) as Message;
  }

  /**
   * Send a embed to a channel.
   *
   * @see https://leovoel.github.io/embed-visualizer/
   *
   * @param destination
   *   The destination can be a channel or a user.
   * @param title
   *   The title of the rich embed.
   * @param description
   *   The description of the rich embed.
   * @param header
   *   Object that should contain the *text* of the header and the *icon* if applicable.
   * @param url
   *   URL of the rich embed.
   * @param color
   *   Color of the left border of the rich embed.
   * @param image
   *   Main image of the rich embed. Usually an attachment reference.
   * @param thumbnail
   *   Main thumbnail of the rich embed. Usually an attachment reference.
   * @param fields
   *   Fields of the rich embed.
   * @param footer
   *   Object that should contain the *text* of the footer and the *icon* if applicable.
   * @param attachments
   *   Array of attachments to attach to the embed.
   * @param timestamp
   *   Controls whether or not we want to add a timestamp of the current time.
   *
   * @returns
   *   The message that was sent as an embed.
   */
  public async sendEmbed(
    destination: TextChannel | DMChannel | GroupDMChannel | User,
    {
      title = "",
      description = "",
      header = {}, url = "",
      color = "", image = "",
      thumbnail = "",
      fields = [],
      footer = {},
      attachments = [],
      timestamp = false,
    }: AbstractObject = {},
  ): Promise<Message | Message[]> {

    // Create the embed instance.
    const embed = new Embed();

    // Manage default values.
    const colorHex = color || "0x1C1CF0";

    // Set default values.
    embed.setColor(colorHex);

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
      fields.every((field) => {
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
    return destination.send(embed);
  }

}
