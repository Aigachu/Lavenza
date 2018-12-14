import DiscordJS from "discord.js";

/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
  // I have to include it in the old way because this package isn't ES6 ready...GROSS!!!
const twitch = require('twitch-api-v5');
twitch.clientID = process.env.TWITCH_CLIENT_ID;

/**
 * Example Talent.
 *
 * This class can do *anything* or *nothing*. It's an entry point for extended development of features.
 *
 */
class TwitchNotify extends Lavenza.Talent {

  /**
   * @inheritDoc
   */
  static async build(config) {

    // Run default builders.
    /** @catch Stop execution. */
    await super.build(config).catch(Lavenza.stop);

  }

  /**
   * @inheritDoc
   */
  static async initialize(bot) {

    // Run default initializer to create database collections.
    /** @catch Stop execution. */
    await super.initialize(bot).catch(Lavenza.stop);

    // Build Configurations and store them in the Watchdog.
    this.guilds = this.guilds || {};
    this.guildConfigStorages = this.guildConfigStorages || {};

    this.guildConfigStorages[bot.name] = this.databaseBotRoots[bot.name] + `/guilds`;

    this.guilds[bot.name] = await Lavenza.Gestalt.sync({}, this.guildConfigStorages[bot.name]);


    // If the configurations couldn't be loaded, we'll initialize them here and save them to the config path.

    // Parse all guilds in the bot.
    await Promise.all(bot.clients.discord.guilds.map(async guild => {
      if (Lavenza.isEmpty(this.guilds[bot.name][guild.id])) {
        this.guilds[bot.name][guild.id] = {
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
      await this.save(bot).catch(Lavenza.stop);

    })).catch(Lavenza.stop);


    // Set the pinger.
    // The pinger is basically a function that will run every *minute* to check if a stream must be
    // fired. This is intensive, I know, but it's the best (first) way I thought of doing this.
    setInterval(async () => {
      await this.ping(bot).catch(Lavenza.continue);
    }, 60000);

  }

  /**
   *
   */
  static async ping(bot) {

    this.guilds[bot.name] = await Lavenza.Gestalt.get(this.guildConfigStorages[bot.name]);

    await Promise.all(bot.clients.discord.guilds.map(async guild => {

      if (Lavenza.isEmpty(this.guilds[bot.name])) {
        return;
      }

      // TTVAnn
      if (this.guilds[bot.name][guild.id].ttvann.enabled) {

        // If there is no announcement channel set for this guild, we do nothing.
        if (this.guilds[bot.name][guild.id].ttvann.ann_channel === null) {
          return true;
        }

        // If there are no streams to announce, we do nothing.
        if (Lavenza.isEmpty(this.guilds[bot.name][guild.id].ttvann.streams)) {
          return true;
        }

        // If we pass all the checks, we run ttvann.
        await this.ttvann(this.guilds[bot.name][guild.id].ttvann, bot).catch(Lavenza.stop);

      }
    })).catch(Lavenza.stop);
  }

  /**
   *
   * @param guild
   */
  static async ttvann(guild, bot) {

    await Promise.all(guild.streams.map(async streamUser => {
      let data = await this.getUserStream(streamUser).catch(Lavenza.stop);

      if (data.stream === null) {
        await this.ttvannRemoveStreamLive(guild.id, streamUser, bot).catch(Lavenza.stop);
        await this.save(bot).catch(Lavenza.stop);
        return;
      }

      if (guild.live.includes(streamUser)) {
        return;
      }

      await this.ttvannFire(guild, data.stream, streamUser, bot).catch(Lavenza.stop);

    })).catch(Lavenza.stop);
  }

  /**
   *
   * @param guild
   * @param streamData
   * @param streamUser
   */
  static async ttvannFire(guild, streamData, streamUser, bot) {

    let announcement_channel = bot.clients.discord.channels.find(channel => channel.id === guild.ann_channel);
    let name = streamData.channel.display_name;
    let stream_title = streamData.channel.status;
    let previewImage = streamData.preview.large;
    let streamLogo = streamData.channel.logo;
    let game = streamData.game;
    let url = streamData.channel.url;

    bot.clients.discord.sendEmbed(announcement_channel, {
      title: `${name} is now live with ${game}!`,
      description: `${stream_title}`,
      url: url,
      color: '0x6441A5',
      header: {
        text: 'Twitch Announcements',
        icon: 'attachment://icon.png'
      },
      footer: {
        text: `Brought to you by Lavenza ;)`,
        icon: bot.clients.discord.user.avatarURL
      },
      attachments: [
        new DiscordJS.Attachment(`${this.directory}/icon.png`, 'icon.png')
      ],
      image: previewImage,
      thumbnail: streamLogo

    }).catch(Lavenza.continue);

    await this.ttvannAddStreamLive(guild.id, streamUser, bot).catch(Lavenza.stop);
    await this.save(bot).catch(Lavenza.stop);
  }

  /**
   *
   * @param guildId
   * @param streamUser
   */
  static async ttvannAddStream(guildId, streamUser, bot) {
    if (this.guilds[bot.name][guildId].ttvann.streams.indexOf(streamUser) > -1) {
      return false;
    }
    this.guilds[bot.name][guildId].ttvann.streams.push(streamUser);
    await this.save(bot).catch(Lavenza.stop);
    return true;
  }

  /**
   *
   * @param guildId
   * @param streamUser
   */
  static async ttvannAddStreamLive(guildId, streamUser, bot) {
    if (this.guilds[bot.name][guildId].ttvann.live.includes(streamUser)) {
      return false;
    }
    this.guilds[bot.name][guildId].ttvann.live.push(streamUser);
    await this.save(bot).catch(Lavenza.stop);
    return true;
  }

  /**
   *
   * @param guildId
   * @param channel_id
   */
  static async ttvannSetAnnChannel(guildId, channel_id, bot) {
    this.guilds[bot.name][guildId].ttvann.ann_channel = channel_id;
    await this.save(bot).catch(Lavenza.stop);
  }

  /**
   *
   * @param guildId
   * @param streamUser
   */
  static async ttvannRemoveStream(guildId, streamUser, bot) {
    let streams_index = this.guilds[bot.name][guildId].ttvann.streams.indexOf(streamUser);
    let live_index = this.guilds[bot.name][guildId].ttvann.live.indexOf(streamUser);

    if (streams_index > -1)
      this.guilds[bot.name][guildId].ttvann.streams.splice(streams_index, 1);

    if (live_index > -1)
      this.guilds[bot.name][guildId].ttvann.live.splice(live_index, 1);

    await this.save(bot).catch(Lavenza.stop);
  }

  /**
   *
   * @param guildId
   * @param streamUser
   */
  static async ttvannRemoveStreamLive(guildId, streamUser, bot) {
    let live_index = this.guilds[bot.name][guildId].ttvann.live.indexOf(streamUser);

    if (live_index > -1)
      this.guilds[bot.name][guildId].ttvann.live.splice(live_index, 1);

    await this.save(bot).catch(Lavenza.stop);
  }

  /**
   * Enable the Watchdog in a given guild.
   * @param feature
   * @param  {Guild} guild Guild to enable the Watchdog in.
   */
  static async enable(feature, guild, bot) {
    this.guilds[bot.name][guild.id][feature].enabled = true;
    await this.save(bot).catch(Lavenza.stop);
    return true;
  }

  /**
   * Disable the Watchdog in a given guild.
   * @param feature
   * @param  {Guild} guild Guild to disable the Watchdog in.
   */
  static async disable(feature, guild, bot) {
    this.guilds[bot.name][guild.id][feature].enabled = false;
    await this.save(bot).catch(Lavenza.stop);
    return false;
  }

  /**
   * Get the status of the Watchdog in a given guild.
   * @param feature
   * @param  {Guild} guild Guild to get the Watchdog status from.
   */
  static async status(feature, guild, bot) {
    return this.guilds[bot.name][guild.id][feature].enabled;
  }

  /**
   * Save configurations.
   */
  static async save(bot) {
    await Lavenza.Gestalt.post(this.guildConfigStorages[bot.name], this.guilds[bot.name]).catch(Lavenza.stop);
  }

  /**
   *
   * @param name
   */
  static getUserByName(name) {
    return new Promise((resolve, reject) => {
      twitch.users.usersByName({users: [name]}, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.users[0]);
        }
      });
    });
  }

  static getUserStream(user) {
    return new Promise((resolve, reject) => {
      if (typeof user !== 'object') {
        this.getUserByName(user).then((result) => {
          resolve(this.getUserStream(result));
        });
      } else {
        resolve(this.getStreamData(user._id));
      }
    });
  }

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

module.exports = TwitchNotify;