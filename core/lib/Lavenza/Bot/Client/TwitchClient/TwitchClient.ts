/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
// const TMIClient = require('tmi.js').Client;
import TwitchUser from './TwitchUser';
import TwitchChannel from './TwitchChannel';
import ClientInterface from "../ClientInterface";
import Bot from "../../Bot";
import ClientType from "../ClientType";
import {BotTwitchClientConfig} from "../../BotConfigurations";
import Morgana from "../../../Confidant/Morgana";
import Igor from "../../../Confidant/Igor";
import Gestalt from "../../../Gestalt/Gestalt";
import {TwitchClientConfigurations} from "../ClientConfigurations";

// Manually require TMI Client since it doesn't work with imports.
const TMIClient = require('tmi.js').client;

/**
 * Provides a class for Twitch Clients managed in Lavenza.
 *
 * This class extends tmi.js. Much love to their work and developers!
 *
 * @see https://www.npmjs.com/package/twitch
 */
export default class TwitchClient extends TMIClient implements ClientInterface {

  /**
   * @inheritDoc
   */
  public bot: Bot;

  /**
   * @inheritDoc
   */
  public type: ClientType;

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
    // Build the configuration that the parent TMI client wants.
    let tmiConfiguration = {
      identity: {
        username: config.username,
        password: bot.env.TWITCH_OAUTH_TOKEN,
      },
      channels: config.channels
    };

    // Call the constructor of the Discord Client parent Class.
    super(tmiConfiguration);

    // Assign the bot to the current client.
    this.bot = bot;

    // Just a utility value to track the client type.
    this.type = ClientType.Twitch;

    // Assign configurations to the client.
    this.config = config;

    // Event: When the client connects to Twitch and is ready.
    this.on('connected', async () => {
      await Morgana.success('Twitch client successfully connected for {{bot}}!', {bot: this.bot.id});
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

      this.bot.listen(msgData, this).catch(Igor.stop);
    });
  }

  /**
   * @inheritDoc
   */
  async getActiveConfigurations(): Promise<TwitchClientConfigurations> {
    return await Gestalt.get(`/bots/${this.bot.id}/clients/${this.type}`);
  }

  /**
   * @inheritDoc
   */
  async gestalt() {
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

    // We start by syncing the permissions configuration.
    let channels = await Gestalt.sync({}, `/bots/${this.bot.id}/clients/${this.type}/channels`);

    // For all guilds, we initialize this default configuration.
    let baseConfig: TwitchClientConfigurations;
    await Promise.all(this.config.channels.map(async channel => {
      if (!(channel in channels)) {
        channels[channel] = baseConfig;
      }
      await Gestalt.update(`/bots/${this.bot.id}/clients/${this.type}/channels`, channels)
    }));
  }

  /**
   * Authenticate the client. (Connect to Twitch)
   */
  async authenticate() {
    // Simply call TMI's connect function.
    await this.connect();
  }

  /**
   * Disconnect from Twitch.
   */
  async disconnect() {
    // Simply call TMI's disconnect function.
    await super.disconnect();
    await Morgana.warn('Twitch client disconnected for {{bot}}.', {bot: this.bot.id});
  }

};
