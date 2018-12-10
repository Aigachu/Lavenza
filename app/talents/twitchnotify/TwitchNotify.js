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

    // If the configurations were loaded, we'll stop here.
    if (!Lavenza.isEmpty(this.guilds[bot.name])) {
      Lavenza.status('Maiden Twitch: Loaded guild config from files.');
    } else {
      // If the configurations couldn't be loaded, we'll initialize them here and save them to the config path.
      Lavenza.status('Maiden Twitch: Guild config not found. Created default guild config.');
      bot.clients.discord.guilds.every((guild) => {
        this.guilds[bot.name][guild.id] = {
          ttvann: {
            id: guild.id,
            enabled: false,
            streams: [],
            ann_channel: null,
            live: [],
          }
        };
        // Save guild configurations.
        this.save(bot).catch(Lavenza.stop);
        return true;
      });
    }

    // Set the pinger.
    // The pinger is basically a function that will run every *minute* to check if a stream must be
    // fired. This is intensive, I know, but it's the best (first) way I thought of doing this.
    setInterval(() => {
      this.ping(bot).catch(Lavenza.continue);
    }, 60000);

  }

  /**
   *
   */
  static async ping(bot) {
    this.guilds[bot.name] = await Lavenza.Gestalt.get(this.guildConfigStorages[bot.name]);

    bot.clients.discord.guilds.every((guild) => {

      if (Lavenza.isEmpty(this.guilds[bot.name])) {
        return true;
      }

      // TTVAnn
      if (this.guilds[bot.name][guild.id].ttvann.enabled) {
        // If there is no announcement channel set for this guild, we do nothing.
        if (this.guilds[bot.name][guild.id].ttvann.ann_channel === null)
          return true;

        // If there are no streams to announce, we do nothing.
        if (Lavenza.isEmpty(this.guilds[bot.name][guild.id].ttvann.streams))
          return true;

        // If we pass all the checks, we run ttvann.
        this.ttvann(this.guilds[bot.name][guild.id].ttvann, bot);
      }
      return true;
    });
  }

  /**
   *
   * @param guild
   */
  static ttvann(guild, bot) {
    guild.streams.every((streamUser) => {
      this.getUserStream(streamUser).then((data) => {
        if (data.stream !== null) {
          if (guild.live.includes(streamUser)) {
            return true;
          }
          this.ttvannFire(guild, data.stream, streamUser, bot);
        } else {
          this.ttvannRemoveStreamLive(guild.id, streamUser, bot);
          this.save(bot).catch(Lavenza.stop);
        }
        return true;
      });
      return true;
    });
  }

  /**
   *
   * @param guild
   * @param streamData
   * @param streamUser
   */
  static ttvannFire(guild, streamData, streamUser, bot) {

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

    // announcement_channel.send(`Psst...**${name}** is streaming **${game}** on Twitch!\n\nCome take a look! :eyes:\n\n${url}`);
    this.ttvannAddStreamLive(guild.id, streamUser, bot);
    this.save(bot).catch(Lavenza.stop);
  }

  /**
   *
   * @param guildId
   * @param streamUser
   */
  static ttvannAddStream(guildId, streamUser, bot) {
    if (this.guilds[bot.name][guildId].ttvann.streams.indexOf(streamUser) > -1) {
      return false;
    }
    this.guilds[bot.name][guildId].ttvann.streams.push(streamUser);
    this.save(bot).catch(Lavenza.stop);
    return true;
  }

  /**
   *
   * @param guildId
   * @param streamUser
   */
  static ttvannAddStreamLive(guildId, streamUser, bot) {
    if (this.guilds[bot.name][guildId].ttvann.live.indexOf(streamUser) > -1) {
      return false;
    }
    this.guilds[bot.name][guildId].ttvann.live.push(streamUser);
    this.save(bot).catch(Lavenza.stop);
    return true;
  }

  /**
   *
   * @param guildId
   * @param channel_id
   */
  static ttvannSetAnnChannel(guildId, channel_id, bot) {
    this.guilds[bot.name][guildId].ttvann.ann_channel = channel_id;
    this.save(bot).catch(Lavenza.stop);
  }

  /**
   *
   * @param guildId
   * @param streamUser
   */
  static ttvannRemoveStream(guildId, streamUser, bot) {
    let streams_index = this.guilds[bot.name][guildId].ttvann.streams.indexOf(streamUser);
    let live_index = this.guilds[bot.name][guildId].ttvann.live.indexOf(streamUser);

    if (streams_index > -1)
      this.guilds[bot.name][guildId].ttvann.streams.splice(streams_index, 1);

    if (live_index > -1)
      this.guilds[bot.name][guildId].ttvann.live.splice(live_index, 1);

    this.save(bot).catch(Lavenza.stop);
  }

  /**
   *
   * @param guildId
   * @param streamUser
   */
  static ttvannRemoveStreamLive(guildId, streamUser, bot) {
    let live_index = this.guilds[bot.name][guildId].ttvann.live.indexOf(streamUser);

    if (live_index > -1)
      this.guilds[bot.name][guildId].ttvann.live.splice(live_index, 1);

    this.save(bot).catch(Lavenza.stop);
  }

  /**
   * Enable the Watchdog in a given guild.
   * @param feature
   * @param  {Guild} guild Guild to enable the Watchdog in.
   */
  static enable(feature, guild, bot) {
    this.guilds[bot.name][guild.id][feature].enabled = true;
    this.save(bot).catch(Lavenza.stop);
    return true;
  }

  /**
   * Disable the Watchdog in a given guild.
   * @param feature
   * @param  {Guild} guild Guild to disable the Watchdog in.
   */
  static disable(feature, guild, bot) {
    this.guilds[bot.name][guild.id][feature].enabled = false;
    this.save(bot).catch(Lavenza.stop);
    return false;
  }

  /**
   * Get the status of the Watchdog in a given guild.
   * @param feature
   * @param  {Guild} guild Guild to get the Watchdog status from.
   */
  static status(feature, guild, bot) {
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