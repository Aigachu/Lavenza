/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Hello command.
 *
 * Literally just replies with 'Hello!'.
 *
 * A great testing command.
 */
export default class Hello extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(resonance) {

    // If "set" is the first argument, we allow the user to set locale settings for themselves.
    // @TODO - This will be much more intricate later on!
    if (resonance.order.args._[0] === 'set') {
      let locale = resonance.order.args._[1];

      // Use Gestalt to make the modification.
      let payload = {};
      payload[`${resonance.author.id}`] = {locale: locale};
      await Lavenza.Gestalt.update(`/i18n/${resonance.bot.id}/clients/${resonance.client.type}/users`, payload);

      // Send a reply.
      await resonance.__reply("I've modified your locale settings! From now on, I will answer you in this language when I can. You can change this setting at any time.", locale);
    }

  }

}