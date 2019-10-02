/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
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
import { Igor } from "../../../Confidant/Igor";
import { Morgana } from "../../../Confidant/Morgana";
import { Sojiro } from "../../../Confidant/Sojiro";
import { Yoshida } from "../../../Confidant/Yoshida";
import { Gestalt } from "../../../Gestalt/Gestalt";
import { AbstractObject } from "../../../Types";
import { Command } from "../../Command/Command";
import { PromptException } from "../../Prompt/Exception/PromptException";
import { Client } from "../Client";
import { ClientType } from "../ClientType";

import { DiscordCommandAuthorizer } from "./DiscordCommandAuthorizer";
import {
  BotDiscordClientConfig,
  DiscordClientConfigurations,
  DiscordClientGuildConfigurations,
} from "./DiscordConfigurations";
import { DiscordPrompt } from "./DiscordPrompt";
import { DiscordResonance } from "./DiscordResonance";

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
      await Morgana.success("Discord client successfully connected for {{bot}}!", {bot: this.bot.id});

      // We start by syncing the guild configurations.
      const guilds = await Gestalt.sync({}, `/bots/${this.bot.id}/clients/${this.type}/guilds`);

      // Set up initial guild configurations.
      await Promise.all(this.connector.guilds.map(async (guild) => {
        const baseGuildConfig: DiscordClientGuildConfigurations = {
          commandPrefix: await this.bot.config.commandPrefix,
          name: guild.name,
          userEminences: {},
        };
        if (!(guild.id in guilds)) {
          guilds[guild.id] = baseGuildConfig;
        }
        await Gestalt.update(`/bots/${this.bot.id}/clients/${this.type}/guilds`, guilds);
      }));

      // Set game text.
      this.connector.user.setActivity(this.config.activity)
        .catch(console.error);
    });

    // Event: When the discord client connects to a new guild.
    this.connector.on("guildCreate", async (guild) => {
      // We start by syncing the guild configurations.
      const guilds = await Gestalt.sync({}, `/bots/${this.bot.id}/clients/${this.type}/guilds`);

      const baseGuildConfig: DiscordClientGuildConfigurations = {
        commandPrefix: await this.bot.config.commandPrefix,
        name: guild.name,
        userEminences: {},
      };

      if (!(guild.id in guilds)) {
        guilds[guild.id] = baseGuildConfig;
      }
      await Gestalt.update(`/bots/${this.bot.id}/clients/${this.type}/guilds`, guilds);
    });

    // Event: When the discord client receives a message.
    this.connector.on("message", (message) => {
      // We ignore messages from any bot.
      if (message.author.bot === true) {
        return;
      }

      // Resonate to the Bot.
      this.resonate(message)
        .catch(Igor.stop);
    });

    // Event: When the clients disconnects from Discord.
    this.connector.on("disconnected", async () => {
      await Morgana.status("Discord client for {{bot}} has disconnected.", {bot: this.bot.id});
    });

    // Event: When the clients disconnects from Discord.
    this.connector.on("error", async () => {
      await Morgana.error("Error has occurred for {{bot}}'s client...", {bot: this.bot.id});
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
    await Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/guilds`);
    await Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/channels`);
    await Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/users`);
  }

  /**
   * Send a pretty help dialog.
   *
   * @TODO - A couple of ideas here.
   *    1. Having help text be determine per command, and having the default behavior being the current behaviour.
   *    2. Making it possible to customize help text per command at will.
   *    3. Linking to online documentation whenever needed (Since Twitch and surely other clients can't format text...)
   *
   * @inheritDoc
   */
  public async help(command: Command, resonance: DiscordResonance): Promise<void> {
    // Get configuration.
    const config = await command.getActiveConfigForBot(resonance.bot);
    const parameterConfig = await command.getActiveParameterConfig(resonance.bot);

    // Start building the usage text by getting the command prefix.
    let usageText = `\`${await resonance.bot.getCommandPrefix(resonance)}${config.key}`;

    // If there is input defined for this command, we will add them to the help text.
    if (parameterConfig.input) {
      parameterConfig.input.requests.every((request) => {
        usageText += ` {${request.replace(" ", "_")
          .toLowerCase()}}\`\n`;
      });
    } else {
      usageText += "`\n";
    }

    // If there are aliases defined for this command, add all usage examples to the help text.
    if (config.aliases) {
      const original = usageText;
      config.aliases.every((alias) => {
        usageText += original.replace(`${config.key}`, alias);

        return true;
      });
    }

    // Set the usage section.
    const fields = [
      {
        name: await Yoshida.translate("Usage", resonance.locale),
        text: usageText,
      },
    ];

    // If there are options defined for this command, we add a section for options.
    if (parameterConfig.options) {
      let optionsList = "";
      await Promise.all(parameterConfig.options.map(async (option) => {
        const description = await Yoshida.translate(option.description, resonance.locale);
        const name = await Yoshida.translate(option.name, resonance.locale);
        optionsList += `**${name}** \`-${option.key} {${option.expects.replace(" ", "_")
          .toLowerCase()}}\` - ${description}\n\n`;
      }));
      fields.push({
                    name: await Yoshida.translate("Options", resonance.locale),
                    text: optionsList,
                  });
    }

    // If there are flags defi-...You get the idea.
    if (parameterConfig.flags) {
      let flagsList = "";
      await Promise.all(parameterConfig.flags.map(async (flag) => {
        const description = await Yoshida.translate(flag.description, resonance.locale);
        const name = await Yoshida.translate(flag.name, resonance.locale);
        flagsList += `**${name}** \`-${flag.key}\` - ${description}\n\n`;
      }));
      fields.push({
                    name: await Yoshida.translate("Flags", resonance.locale),
                    text: flagsList,
                  });
    }

    // Finally, send the embed.
    await this.sendEmbed(resonance.message.channel, {
      description: await Yoshida.translate(`${config.description}`, resonance.locale),
      fields,
      header: {
        icon: this.connector.user.avatarURL,
        text: await Yoshida.translate("{{bot}} Guide", {bot: resonance.bot.config.name}, resonance.locale),
      },
      thumbnail: this.connector.user.avatarURL,
      title: await Yoshida.translate(`${config.name}`, resonance.locale),
    });
  }

  /**
   * Discord client's resonance builder.
   *
   * @inheritDoc
   */
  public async buildResonance(message: Message): Promise<DiscordResonance> {
    return new DiscordResonance(message.content, message, this.bot, this);
  }

  /**
   * Discord client's prompt builder.
   *
   * @inheritDoc
   */
  public async buildPrompt(
    user: User,
    line: TextChannel,
    resonance: DiscordResonance,
    lifespan: number,
    onResponse: (resonance: DiscordResonance, prompt: DiscordPrompt) => Promise<void>,
    onError: (error: PromptException) => Promise<void>)
    : Promise<DiscordPrompt> {
    return new DiscordPrompt(
      user,
      line,
      resonance,
      lifespan,
      onResponse,
      onError,
      this.bot,
    );
  }

  /**
   * Discord's Command Authorizer builder.
   *
   * @inheritDoc
   */
  public async buildCommandAuthorizer(
    command: Command,
    resonance: DiscordResonance,
  ): Promise<DiscordCommandAuthorizer> {
    return new DiscordCommandAuthorizer(command, resonance);
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
   * Get active Discord configurations for this bot.
   *
   * @inheritDoc
   */
  public async getActiveConfigurations(): Promise<DiscordClientConfigurations> {
    return await Gestalt.get(`/bots/${this.bot.id}/clients/${this.type}`) as DiscordClientConfigurations;
  }

  /**
   * Get command prefix, taking into consideration the Discord context.
   *
   * A custom command prefix can be set per Guild.
   *
   * @inheritDoc
   */
  public async getCommandPrefix(resonance: DiscordResonance): Promise<string> {
    // Get client specific configurations.
    const clientConfig = await this.getActiveConfigurations();
    if (resonance.message.guild && clientConfig.guilds[resonance.message.guild.id]) {
      return clientConfig.guilds[resonance.message.guild.id].commandPrefix || undefined;
    }
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
