/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
  // I have to include it in the old way because this package isn't ES6 ready...GROSS!!!
const twitch = require('twitch-api-v5');

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
    if (!_.isEmpty(this.guilds)) {
      console.log('Maiden Twitch: Loaded guild config from files.');
    } else {
      // If the configurations couldn't be loaded, we'll initialize them here and save them to the config path.
      console.log('Maiden Twitch: Guild config not found. Created default guild config.');
      bot.client.discord.guilds.every((guild) => {
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
      this.ping(bot);
    }, 60000);

  }

  /**
   *
   */
  static ping(bot) {
    bot.clients.discord.guilds.every((guild) => {
      // TTVAnn
      if (this.guilds[bot.name][guild.id].ttvann.enabled) {
        // If there is no announcement channel set for this guild, we do nothing.
        if (this.guilds[bot.name][guild.id].ttvann.ann_channel === null)
          return true;

        // If there are no streams to announce, we do nothing.
        if (_.isEmpty(this.guilds[bot.name][guild.id].ttvann.streams))
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
    guild.streams.every((stream_user) => {
      this.getUserStream(stream_user).then((data) => {
        if (data.stream !== null) {
          this.ttvannFire(guild, data.stream, stream_user, bot);
        } else {
          this.ttvannRemoveStreamLive(guild.id, stream_user, bot);
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
   * @param stream_data
   * @param stream_user
   */
  static ttvannFire(guild, stream_data, stream_user, bot) {

    if (guild.live.indexOf(stream_user) > -1)
      return;

    let announcement_channel = bot.clients.discord.channels.find(channel => channel.id === guild.ann_channel);

    let name = stream_data.channel.display_name;
    let game = stream_data.game;
    let url = stream_data.channel.url;

    announcement_channel.send(`Psst...**${name}** is streaming **${game}** on Twitch!\n\nCome take a look! :eyes:\n\n${url}`);
    this.ttvannAddStreamLive(guild.id, stream_user, bot);
    this.save(bot).catch(Lavenza.stop);
  }

  /**
   *
   * @param guild_id
   * @param stream_user
   */
  static ttvannAddStream(guild_id, stream_user, bot) {
    if (this.guilds[bot.name][guild_id].ttvann.streams.indexOf(stream_user) > -1) {
      return false;
    }
    this.guilds[bot.name][guild_id].ttvann.streams.push(stream_user);
    this.save(bot).catch(Lavenza.stop);
    return true;
  }

  /**
   *
   * @param guild_id
   * @param stream_user
   */
  static ttvannAddStreamLive(guild_id, stream_user, bot) {
    if (this.guilds[bot.name][guild_id].ttvann.live.indexOf(stream_user) > -1) {
      return false;
    }
    this.guilds[bot.name][guild_id].ttvann.live.push(stream_user);
    this.save(bot).catch(Lavenza.stop);
    return true;
  }

  /**
   *
   * @param guild_id
   * @param channel_id
   */
  static ttvannSetAnnChannel(guild_id, channel_id, bot) {
    this.guilds[bot.name][guild_id].ttvann.ann_channel = channel_id;
    this.save(bot).catch(Lavenza.stop);
  }

  /**
   *
   * @param guild_id
   * @param stream_user
   */
  static ttvannRemoveStream(guild_id, stream_user, bot) {
    let streams_index = this.guilds[bot.name][guild_id].ttvann.streams.indexOf(stream_user);
    let live_index = this.guilds[bot.name][guild_id].ttvann.live.indexOf(stream_user);

    if (streams_index > -1)
      this.guilds[bot.name][guild_id].ttvann.streams.splice(streams_index, 1);

    if (live_index > -1)
      this.guilds[bot.name][guild_id].ttvann.live.splice(live_index, 1);

    this.save(bot).catch(Lavenza.stop);
  }

  /**
   *
   * @param guild_id
   * @param stream_user
   */
  static ttvannRemoveStreamLive(guild_id, stream_user, bot) {
    let live_index = this.guilds[bot.name][guild_id].ttvann.live.indexOf(stream_user);

    if (live_index > -1)
      this.guilds[bot.name][guild_id].ttvann.live.splice(live_index, 1);

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