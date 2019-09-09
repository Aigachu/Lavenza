/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import moment from 'moment';

/**
 * Reminder Talent.
 *
 * This talent will manage features surrounding reminders.
 *
 * With this talent, your bot will be able to manage reminders for your user, in a specific client.
 */
export default class Reminder extends Lavenza.Talent {

  /**
   * @inheritDoc
   */
  static async build(config) {

    // Run default builders.
    await super.build(config);

  }

  /**
   * @inheritDoc
   */
  static async initialize(bot) {

    // Run default initializer to create database collections.
    await super.initialize(bot);

    // Initialize a couple of variables.
    this.reminders = this.reminders || {};
    this.reminderStorages = this.reminderStorages || {};

    // Path to the database file for the specific bot.
    this.reminderStorages[bot.id] = this.databases[bot.id] + `/reminders`;

    // Set the reminders up.
    this.reminders[bot.id] = await this.getCurrentReminders(bot);

    // Set the pinger.
    // The pinger is basically a function that will run every *second* to check if a reminder must be
    // fired. This is intensive, I know, but it's the best (first) way I thought of doing this.
    setInterval(async () => {
      await this.ping(bot);
    }, 1000);
  }

  /**
   * Checks if a reminder must be sent.
   *
   * @param {Bot} bot
   *   The bot that is being used for this action.
   * @returns {Promise<void>}
   */
  static async ping(bot) {

    // If we have no reminders set, don't do anything.
    if (Lavenza.isEmpty(this.reminders[bot.id])) {
      return;
    }

    // Get the current UNIX Timestamp.
    let now = moment().format('x');

    // Loops through all reminders and checks if they need to be sent.
    // @TODO - This isn't really efficient. Explore a way to make this NOT have to loop through ALL reminders.
    await Promise.all(this.reminders[bot.id].map(async (reminder) => {
      // Check if the timestamp is in the past. If it is, we send our reminder and remove it from the array.
      if (reminder.when < now) {
        await this.sendReminder(reminder, bot);
        this.reminders[bot.id].splice(this.reminders[bot.id].indexOf(reminder), 1);

        // Save reminders to the database.
        await this.save(bot);
      }
    }));

  }

  /**
   * Send reminder to its destination.
   *
   * @param {Object} reminder
   *   The reminder object built from the command.
   * @param {Bot} bot
   *   The bot that is being used for this action.
   *
   * @returns {Promise<void>}
   */
  static async sendReminder(reminder, bot) {
    // First we want to check which client this is coming from.
    // @todo - We can refactor this to Factory Design.
    switch (reminder.client) {
      // Send Discord Reminders.
      case Lavenza.ClientTypes.Discord: {
        await this.sendDiscordReminder(reminder, bot);
        break;
      }
      // Send Twitch Reminders.
      // case Lavenza.ClientTypes.Twitch: {
      //   await this.sendTwitchReminder(reminder, bot);
      //   break;
      // }
    }
  }

  /**
   * Send a Reminder in the context of Discord.
   *
   * @param {Object} reminder
   *   The reminder object built from the command.
   * @param {Bot} bot
   *   The bot that is being used for this action.
   *
   * @returns {Promise<void>}
   */
  static async sendDiscordReminder(reminder, bot) {

    // Get the Discord client.
    let client = await bot.getClient(Lavenza.ClientTypes.Discord);

    // First, we get the guild this reminder originated from. If we can't find the guild, sadly we can't process the reminders.
    let originGuild = await client.guilds.find(guild => guild.id === reminder.guild);

    // Depending on the Type reminder we're dealing with, we act differently here.
    // @todo - We can refactor this to Factory Design.
    switch (reminder.type) {
      // If it's a user, we'll need to send them a direct message.
      case 'user': {
        // If we don't find the user, we don't do anything with this reminder. It'll be silently deleted.
        let user = await client.users.find(user => user.id === reminder.id);
        if (Lavenza.isEmpty(user)) break;
        let text = await Lavenza.__(`Greetings {{receiver}}. I was told to remind you of this: {{subject}}. I hope I am not intruding. Have a nice day.`, {
          receiver: user.username,
          subject: await Lavenza.bold(reminder.what),
        });
        await user.send(text);
        break;
      }

      // If it's a role, we'll send a message in the origin channel, addressing the role.
      case 'role': {
        // If we don't find the role, we don't do anything with this reminder. It'll be silently deleted.
        let role = await originGuild.roles.find(role => role.id === reminder.id);
        if (Lavenza.isEmpty(role)) break;
        // If we don't find the channel, we can get the default channel of the server instead.
        let channel = await originGuild.channels.find(channel => channel.id === reminder.channel);
        if (Lavenza.isEmpty(channel)) {
          channel = originGuild.systemChannel;
        }
        let text = await Lavenza.__(`To all {{role}}, I was told to remind you: {{subject}}.`, {
          role: role,
          subject: await Lavenza.bold(reminder.what),
        });
        await channel.send(text);
        break;
      }

      // If it's a channel, we'll send a message in the channel.
      case 'channel': {
        // If we don't find the channel, we don't do anything with this reminder. It'll be silently deleted.
        let channel = await originGuild.channels.find(channel => channel.id === reminder.id);
        if (Lavenza.isEmpty(channel)) break;
        let text = await Lavenza.__(`@here To dwellers of {{channel}}, I was told to remind you: {{subject}}.`, {
          channel: channel,
          subject: await Lavenza.bold(reminder.what),
        });
        await channel.send(text);
        break;
      }

      // If it's everyone, we'll send a message in the default channel, @ing everyone.
      case 'everyone': {
        // If we don't find the channel, we don't do anything with this reminder. It'll be silently deleted.
        let channel = originGuild.systemChannel;
        let text = await Lavenza.__(`@everyone, I was told to remind you: {{subject}}.`, {
          subject: await Lavenza.bold(reminder.what),
        });
        await channel.send(text);
        break;
      }
    }
  }

  /**
   * Save the reminders into the database.
   *
   * @param {Bot} bot
   *   The bot that is being used for this action.
   *
   * @returns {Promise<void>}
   */
  static async save(bot) {
    await Lavenza.Gestalt.post(this.reminderStorages[bot.id], this.reminders[bot.id]);
  }

  /**
   * Set a reminder in the database for the given bot.
   *
   * @param {Bot} bot
   *   The bot to set the reminder for.
   * @param {Object} reminder
   *   The object containing reminder data.
   *
   * @returns {Promise<void>}
   */
  static async setReminder(bot, reminder) {

    // Add this reminder to the array.
    this.reminders[bot.id].push(reminder);

    // Save reminders to database.
    await this.save(bot);

  }

  static async getCurrentReminders(bot) {

    // Return the reminders currently assigned to the class if any.
    if (!Lavenza.isEmpty(this.reminders[bot.id])) {
      return this.reminders[bot.id];
    }

    // Attempt to get the active configuration from the database.
    let reminders = await Lavenza.Gestalt.get(this.reminderStorages[bot.id]);
    if (!Lavenza.isEmpty(reminders)) {
      this.reminders[bot.id] = reminders;
      return this.reminders[bot.id];
    }

    // Sync it to the database.
    this.reminders[bot.id] = await Lavenza.Gestalt.sync([], this.reminderStorages[bot.id]);

    // Return the configuration.
    return this.reminders[bot.id];
  }
}