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

    // Get the current reminders for this bot.
    this.reminders[bot.id] = await Lavenza.Gestalt.sync({}, this.reminderStorages[bot.id]);

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
    
  }
}