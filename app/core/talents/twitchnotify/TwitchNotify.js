/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import DiscordJS from "discord.js";

// I have to include twitch-api-v5 in the old way because this package isn't ES6 ready...GROSS!!!
const twitch = require('twitch-api-v5');
twitch.clientID = process.env.TWITCH_CLIENT_ID;
if (Lavenza.isEmpty(process.env.TWITCH_CLIENT_ID)) {
  Lavenza.warn(`There doesn't seem to be a TWITCH_CLIENT_ID environment variable set in your .env file. This will BREAK a lot of Twitch functionality. It is highly recommended to add this variable to your .env. See the .example.env file for more details!`);
}

/**
 * Twitch Notification Talent
 *
 * This Talent manages anything related to Twitch notifications. All notification data is saved in the database.
 */
export default class TwitchNotify extends Lavenza.Talent {

  /**
   * @inheritDoc
   */
  static async build(config) {

    // Run default builders.
    await super.build(config);

    // Initialize variables if needed.
    this.guilds = {};
    this.guildConfigStorages = {};

  }

  /**
   * @inheritDoc
   */
  static async initialize(bot) {

    // Run default initializer to create database collections.
    await super.initialize(bot);

    // Build Configurations and store them in the database.
    this.guildConfigStorages[bot.id] = this.databases[bot.id] + `/guilds`;
    this.guilds[bot.id] = await Lavenza.Gestalt.sync({}, this.guildConfigStorages[bot.id]);

    // Await the processing of all Discord guilds available in the bot's Discord client.
    await Promise.all(bot.getClient(Lavenza.ClientTypes.Discord).guilds.map(async guild => {

      // If the guild definition is not already created in the database, we initialize it here.
      if (Lavenza.isEmpty(this.guilds[bot.id][guild.id])) {

        // These are the default configurations. Twitch Announcements are disabled by default in a guild.
        this.guilds[bot.id][guild.id] = {
          ttvann: {
            id: guild.id,
            enabled: false,
            streams: [],
            ann_channel: null,
            live: [],
          }
        };
      }

      // Save guild configurations.
      await this.save(bot);

    }));


    // Set the pinger.
    // The pinger is basically a function that will run every *minute* to check if a stream must be announced.
    setInterval(async () => {
      await this.ping(bot).catch(Lavenza.continue);
    }, 1000);

  }

  /**
   * Check to see if any twitch streams are live, and announces them if needed.
   *
   * @param {Bot} bot
   *   Bot to perform this functionality with.
   *
   * @returns {Promise<void>}
   */
  static async ping(bot) {

    // Get the current active configuration.
    this.guilds[bot.id] = await Lavenza.Gestalt.get(this.guildConfigStorages[bot.id]);

    // We'll perform checks for every guild this bot is part of.
    await Promise.all(bot.getClient(Lavenza.ClientTypes.Discord).guilds.map(async guild => {

      // If for whatever reason, the guild being processed has no configuration, we return.
      if (Lavenza.isEmpty(this.guilds[bot.id])) {
        return;
      }

      // If announcements are disabled in the current guild, we return.
      if (!this.guilds[bot.id][guild.id].ttvann.enabled) {
        return;
      }

      // If there is no announcement channel set for this guild, we return.
      if (this.guilds[bot.id][guild.id].ttvann.ann_channel === null) {
        return;
      }

      // If there are no streams to announce, we do nothing.
      if (Lavenza.isEmpty(this.guilds[bot.id][guild.id].ttvann.streams)) {
        return;
      }

      // If we pass all the checks, we run the actual checks with the main function.
      await this.ttvann(this.guilds[bot.id][guild.id].ttvann, bot);


    }));
  }

  /**
   * Queries the Twitch API to check if any of the configured streams for a guild are live.
   *
   * @param {Object} guildConfig
   *   Guild configuration for the guild to perform checks for.
   *
   * @param {Bot} bot
   *   Bot to perform these checks for.
   *
   * @returns {Promise<void>}
   */
  static async ttvann(guildConfig, bot) {

    // For every configured stream in the configuration, we'll perform API calls to check if the stream is live.
    await Promise.all(guildConfig.streams.map(async twitchUser => {

      // Initialize and obtain data from Twitch.
      let data;
      data = await this.getUserStream(twitchUser);

      // If the data is null, this means the stream is definitely not live.
      // We fire the function to assure removal the stream from the list of live channels and save the configuration.
      if (data.stream === null) {
        await this.ttvannRemoveStreamLive(guildConfig.id, twitchUser, bot);
        await this.save(bot);
        return;
      }

      // If the data is not determined as null above, the stream is definitely live.
      // Here, we check if the stream was already determined as live. If it is, we don't want to announce it again.
      if (guildConfig.live.includes(twitchUser)) {
        return;
      }

      // If we reach here, then it's assumed that we should announce the stream. We hit the fire function.
      await this.ttvannFire(guildConfig, data.stream, twitchUser, bot);

    }));
  }

  /**
   * Fire an announcement for a specific guild, stream and bot.
   *
   * @param {Object} guildConfig
   *   Guild configuration for the guild to perform checks for.
   * @param {Object} streamData
   *   Stream data retrieved using the Twitch API.
   * @param {string} streamUser
   *   The twitch channel user the data was fetched for.
   * @param {Bot} bot
   *   The bot this function is being performed for.
   *
   * @returns {Promise<boolean>}
   */
  static async ttvannFire(guildConfig, streamData, streamUser, bot) {

    // Here we do some initializations and retrieval of needed data. Pretty straightforward.
    let announcementChannel = bot.getClient(Lavenza.ClientTypes.Discord).channels.find(channel => channel.id === guildConfig.ann_channel);
    let name = streamData.channel.display_name;
    let streamTitle = streamData.channel.status;
    let previewImage = streamData.preview.large;
    let streamLogo = streamData.channel.logo;
    let game = streamData.game;
    let url = streamData.channel.url;
    let client = await bot.getClient(Lavenza.ClientTypes.Discord);

    // We send a beautiful embed to the announcement channel.
    await client.sendEmbed(announcementChannel, {
      title: `${name} is playing ${game}`,
      description: `${streamTitle}`,
      url: url,
      color: '0x6441A5',
      header: {
        text: `${name} has began a livestream on Twitch!`,
        icon: 'attachment://icon.png'
      },
      attachments: [
        new DiscordJS.Attachment(`${this.directory}/icon.png`, 'icon.png')
      ],
      image: previewImage,
      thumbnail: streamLogo

    }).catch(Lavenza.continue);

    // We mark this stream as live in the configuration so it doesn't get announced 1000 times.
    // Then, we save the configuration to the database.
    await this.ttvannAddStreamLive(guildConfig.id, streamUser, bot);
    await this.save(bot);
  }

  /**
   * Add a stream to guild configuration to mark it for announcements.
   *
   * @param {string} guildId
   *   ID of the guild to add the stream to.
   * @param {string} streamUser
   *   The name of the twitch channel. Must be the exact name.
   * @param {Bot} bot
   *   The bot to perform this function for.
   *
   * @returns {Promise<void>}
   */
  static async ttvannAddStream(guildId, streamUser, bot) {

    // If the stream is already in the configuration, we shouldn't do anything.
    if (this.guilds[bot.id][guildId].ttvann.streams.includes(streamUser)) {
      await Lavenza.throw('Stream already set for announcements in this guild.');
    }

    // If not, we simply add it to the array and save the configuration.
    this.guilds[bot.id][guildId].ttvann.streams.push(streamUser);
    await this.save(bot);
  }

  /**
   * Add a stream to guild configuration to mark it as live.
   *
   * This is done to keep track of which streams were already announced, to avoid announcing them more than once.
   *
   * @param {string} guildId
   *   ID of the guild to add the stream to.
   * @param {string} streamUser
   *   The name of the twitch channel. Must be the exact name.
   * @param {Bot} bot
   *   The bot to perform this function for.
   *
   * @returns {Promise<void>}
   */
  static async ttvannAddStreamLive(guildId, streamUser, bot) {

    // If the stream is already in the live list, we shouldn't do anything.
    if (this.guilds[bot.id][guildId].ttvann.live.includes(streamUser)) {
      return;
    }

    // If not, we simply add it to the array and save the configuration.
    this.guilds[bot.id][guildId].ttvann.live.push(streamUser);
    await this.save(bot);
  }

  /**
   * Set the ID of the channel where announcements should be sent for a specific guild.
   *
   * @param {string} guildId
   *   ID of the guild to configure the announcement channel for.
   * @param {string} channelId
   *   ID of the channel to set as the announcement channel.
   * @param {Bot} bot
   *   Bot to perform this action with.
   *
   * @returns {Promise<void>}
   */
  static async ttvannSetAnnChannel(guildId, channelId, bot) {

    // We simply add this channel to the configuration
    this.guilds[bot.id][guildId].ttvann.ann_channel = channelId;
    await this.save(bot);

  }

  /**
   * Remove a stream from guild configuration to stop announcements for it.
   *
   * @param {string} guildId
   *   ID of the guild to remove the stream from.
   * @param {string} streamUser
   *   The name of the twitch channel. Must be the exact name.
   * @param {Bot} bot
   *   The bot to perform this function for.
   *
   * @returns {Promise<void>}
   */
  static async ttvannRemoveStream(guildId, streamUser, bot) {

    // We check the indexes of the stream user channel name in both the streams & live configurations.
    let streamIndex = this.guilds[bot.id][guildId].ttvann.streams.indexOf(streamUser);
    let liveIndex = this.guilds[bot.id][guildId].ttvann.live.indexOf(streamUser);

    if (liveIndex > -1) {
      await this.guilds[bot.id][guildId].ttvann.live.splice(liveIndex, 1);
    }

    // If they exist, we remove them.
    if (streamIndex > -1) {
      await this.guilds[bot.id][guildId].ttvann.streams.splice(streamIndex, 1);
    }

    // Finally, we save configurations.
    await this.save(bot);
  }

  /**
   * Remove a stream from  guild live channels configuration.
   *
   * @param {string} guildId
   *   ID of the guild to remove the stream from.
   * @param {string} streamUser
   *   The name of the twitch channel. Must be the exact name.
   * @param {Bot} bot
   *   The bot to perform this function for.
   *
   * @returns {Promise<void>}
   */
  static async ttvannRemoveStreamLive(guildId, streamUser, bot) {

    // We check the indexes of the stream user channel name in live channel configurations.
    let liveIndex = this.guilds[bot.id][guildId].ttvann.live.indexOf(streamUser);

    // If it exists, we remove it.
    if (liveIndex > -1) {
      this.guilds[bot.id][guildId].ttvann.live.splice(liveIndex, 1);
    }

    // Finally, we save configurations.
    await this.save(bot);
  }

  /**
   * Enable the Twitch Announcements function in a given guild.
   *
   * This simply adjusts the 'enabled' property of a guild configuration.
   *
   * @param {Guild} guild
   *   Guild configuration of the guild to enable the functionality in.
   * @param {Bot} bot
   *   Bot to perform this functionality for.
   *
   * @returns {Promise<void>}
   */
  static async enable(guild, bot) {
    this.guilds[bot.id][guild['id']].ttvann.enabled = true;
    await this.save(bot);
  }

  /**
   * Disable the Twitch Announcements function in a given guild.
   *
   * This simply adjusts the 'enabled' property of a guild configuration.
   *
   * @param {Guild} guild
   *   Guild configuration of the guild to disable the functionality in.
   * @param {Bot} bot
   *   Bot to perform this functionality for.
   *
   * @returns {Promise<void>}
   */
  static async disable(guild, bot) {
    this.guilds[bot.id][guild['id']].ttvann.enabled = false;
    await this.save(bot);
  }

  /**
   * Check the status of the Twitch Announcements function in a given guild.
   *
   * @param {Object} guildConfig
   *   Guild configuration of the guild to disable the functionality in.
   * @param {Bot} bot
   *   Bot to perform this functionality for.
   *
   * @returns {Promise<boolean>}
   */
  static async status(guildConfig, bot) {
    return this.guilds[bot.id][guildConfig.id].ttvann.enabled;
  }

  /**
   * Save configurations to the database using Gestalt.
   */
  static async save(bot) {
    await Lavenza.Gestalt.post(this.guildConfigStorages[bot.id], this.guilds[bot.id]);
  }

  /**
   * Use the Twitch API to get User data.
   *
   * @param {string} name
   *   Username of the user to get data for.
   *
   * @returns {Promise<any>}
   *   The data obtained from Twitch.
   */
  static getUserByName(name) {
    return new Promise((resolve, reject) => {
      twitch.users.usersByName({users: name}, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.users[0]);
        }
      });
    });
  }

  /**
   * Use the Twitch API to get stream data for a given user.
   *
   * @param {*} user
   *   User data retrieved from Twitch.
   *
   * @returns {Promise<any>}
   *   The data obtained from Twitch.
   */
  static getUserStream(user) {
    return new Promise((resolve) => {
      if (typeof user !== 'object') {
        this.getUserByName(user).then((result) => {
          resolve(this.getUserStream(result));
        });
      } else {
        resolve(this.getStreamData(user['_id']));
      }
    });
  }

  /**
   * Get stream data for a given channel ID.
   *
   * @param {string} id
   *   ID of the channel to get stream data for.
   *
   * @returns {Promise<any>}
   *   The data obtained from Twitch.
   */
  static getStreamData(id) {
    return new Promise((resolve, reject) => {
      twitch.streams.channel({channelID: id}, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}