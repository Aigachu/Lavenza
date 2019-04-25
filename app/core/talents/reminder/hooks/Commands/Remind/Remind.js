/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import moment from 'moment-timezone';
import parseReminder from 'parse-reminder';

/**
 * Remind command.
 */
export default class Remind extends Lavenza.Command {

  /**
   * This is the static build function of the command.
   *
   * @inheritDoc
   */
  static async build(config, talent) {

    // The build function must always run the parent's build function! Don't remove this line.
    await super.build(config, talent);

  }

  /**
   * @inheritDoc
   */
  static async execute(resonance) {

    // If the client is Twitch, we want to send a message saying it's currently unavailable.
    if (resonance.client === Lavenza.ClientTypes.Twitch) {
      await resonance.__reply(`Reminders are currently unavailable on Twitch because Aiga's too lazy to finish it up...Since he won't listen to me, try pestering him to finish up Twitch support.`);
      return;
    }

    // First, we want to parse the reminder text.
    // let reminder = await parseReminder('remind ' + resonance.order.rawContent);
    let reminder = await this.handlers(resonance,{info: parseReminder('remind ' + resonance.order.rawContent)}, 'parseReminder');

    // If the reminder is null, we don't do anything.
    if (reminder === null) {
      return;
    }

    // Set when the reminder should fire.
    let time = reminder.when;
    reminder.when = moment(time).format('x');

    // Run this through the talent.
    await this.talent.setReminder(resonance.bot, reminder);

    // Send a message to confirm this.
    await resonance.__reply(`Okay {{invoker}}, I will follow up on this on the following date: {{date}} at {{time}}`, {
      invoker: await Lavenza.bold(resonance.author.username),
      date: await Lavenza.bold(moment(time).tz('UTC').format('MMMM Do, YYYY')),
      time: await Lavenza.bold(moment(time).tz('UTC').format('hh:mm:ss A zz'))
    });

  }
}