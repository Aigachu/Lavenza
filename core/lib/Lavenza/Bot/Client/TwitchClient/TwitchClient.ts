/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
// const TMIClient = require('tmi.js').Client;
import {TwitchUser} from './TwitchUser';
import {TwitchChannel} from './TwitchChannel';
import {ClientInterface} from "../ClientInterface";
import {Bot} from "../../Bot";
import {ClientType} from "../ClientType";
import {BotTwitchClientConfig} from "../../BotConfigurations";
import {Morgana} from "../../../Confidant/Morgana";
import {Igor} from "../../../Confidant/Igor";
import {Gestalt} from "../../../Gestalt/Gestalt";
import {TwitchClientChannelConfigurations, TwitchClientConfigurations} from "../ClientConfigurations";
import {Sojiro} from "../../../Confidant/Sojiro";

// Manually require TMI Client since it doesn't work with imports.
const TMIClient = require('tmi.js').client;

/**
 * Provides a class for Twitch Clients managed in Lavenza.
 *
 * This class extends tmi.js. Much love to their work and developers!
 *
 * @see https://www.npmjs.com/package/twitch
 */
export class TwitchClient extends TMIClient implements ClientInterface {

  /**
   * @inheritDoc
   */
  public bot: Bot;

  /**
   * @inheritDoc
   */
  public type: ClientType = ClientType.Twitch;

  /**
   * @inheritDoc
   */
  public config: BotTwitchClientConfig;

  /**
   * TwitchClient constructor.
   *
   * @param config
   *   Configuration object to create the client with, fetched from the bot's configuration file.
   * @param bot
   *   Bot that this client is linked to.
   */
  constructor(config: BotTwitchClientConfig, bot: Bot) {
    // Call the constructor of the Discord Client parent Class.
    super({
      identity: {
        username: config.username,
        password: bot.env.TWITCH_OAUTH_TOKEN,
      },
      channels: config.channels
    });

    // Assign the bot to the current client.
    this.bot = bot;

    // Assign configurations to the client.
    this.config = config;

    // Event: When the client connects to Twitch and is ready.
    this.on('connected', async () => {
      // Send a message confirming our connection to Twitch.
      await Morgana.success('Twitch client successfully connected for {{bot}}!', {bot: this.bot.id});

      // We sync the client configurations.
      let channels = await Gestalt.sync({}, `/bots/${this.bot.id}/clients/${this.type}/channels`);

      // Generate configuration for each channel.
      await Promise.all(this.config.channels.map(async channel => {
        // For all guilds, we initialize this default configuration.
        let baseChannelConfig: TwitchClientChannelConfigurations = {
          name: channel,
          commandPrefix: this.bot.config.commandPrefix,
          userEminences: {},
        };
        if (!(channel in channels)) {
          channels[channel] = baseChannelConfig;
        }
        await Gestalt.update(`/bots/${this.bot.id}/clients/${this.type}/channels`, channels)
      }));
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
        channel: new TwitchChannel(target, target.replace('#', ''), context['message-type'])
      };

      this.bot.listen(msgData, this).catch(Igor.stop);
    });
  }

  /**
   * @inheritDoc
   */
  public async getActiveConfigurations(): Promise<TwitchClientConfigurations> {
    return await Gestalt.get(`/bots/${this.bot.id}/clients/${this.type}`);
  }

  /**
   * @inheritDoc
   */
  public async gestalt() {
    // Make sure database collection exists for this client for the given bot.
    await Gestalt.createCollection(`/bots/${this.bot.id}/clients/${this.type}`);

    // Make sure database collection exists for permissions in this client.
    await Gestalt.createCollection(`/bots/${this.bot.id}/clients/${this.type}`);

    // Initialize i18n database collection for this client if it doesn't already exist.
    await Gestalt.createCollection(`/i18n/${this.bot.id}/clients/${this.type}`);

    // Initialize i18n contexts, creating them if they don't exist.
    // Translations are manageable through all of these contexts.
    await Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/channels`);
    await Gestalt.sync({}, `/i18n/${this.bot.id}/clients/${this.type}/users`);
  }

  /**
   * Authenticate the client. (Connect to Twitch)
   */
  public async authenticate() {
    // Simply call TMI's connect function.
    await this.connect();
  }

  /**
   * Disconnect from Twitch.
   */
  public async disconnect() {
    // Simply call TMI's disconnect function.
    await super.disconnect();
    await Morgana.warn('Twitch client disconnected for {{bot}}.', {bot: this.bot.id});
  }

  /**
   * A little utility function to order the bot to type for a set amount of seconds in a given channel.
   *
   * @TODO - Do something about that dumb 'method can be static' message.
   *
   * @param seconds
   *   Amount of seconds to type for.
   * @param channel
   *   The Twitch channel to type in.
   */
  public async typeFor(seconds: number, channel: any = null) {
    await Sojiro.wait(seconds);
  }

}
