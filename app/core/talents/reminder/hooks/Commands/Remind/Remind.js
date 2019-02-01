/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import moment from 'moment';
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

    // First, we want to parse the reminder text.
    let reminder = await this.parseReminder(resonance.order.rawContent);
    console.log(parseReminder('remind ' + resonance.order.rawContent));
  }

  /**
   * Parse a reminder from content entered by a user.
   *
   * @param content
   * @returns {Promise<void>}
   */
  static async parseReminder(content) {

  }
}