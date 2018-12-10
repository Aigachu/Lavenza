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
class TwitchAnnounce extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {

    // If the "a" option is used, add a stream to the list of announcements in the server.
    if ('a' in order.args) {
      this.talent.ttvannAddStream(resonance.message.guild.id, order.args.a, resonance.bot);
      resonance.message.channel.send(`Added **${order.args.a}** to the list of Twitch Announcements in this server!`);
      return;
    }

    // If the "r" option is used, remove a stream to the list of announcements in the server.
    if ("r" in order.args) {
      this.talent.ttvannRemoveStream(resonance.message.guild.id, order.args.r, resonance.bot);
      resonance.message.channel.send(`Removed **${order.args.r}** from the list of Twitch Announcements in this server!`);
      return;
    }

    // If the "s" option is used, check the status of the watchdog in this guild.
    if ("s" in order.args) {
      let status = this.talent.status('ttvann', resonance.message.guild, resonance.bot) ? `Enabled` : `Disabled`;
      resonance.message.channel.send(`Twitch Announcements status: **${status}**.`);
      return;
    }

    // If the "c" option is used, set the announcement channel for this server.
    if ("c" in order.args) {
      order.args.c = order.args.c.replace('<#', '');
      order.args.c = order.args.c.replace('>', '');
      order.args.c = order.args.c.replace('!', '');

      if (order.args.c === "#here")
        order.args.c = resonance.message.channel.id;

      this.talent.ttvannSetAnnChannel(resonance.message.guild.id, order.args.c, resonance.bot);
      resonance.message.channel.send(`Set the announcement channel to <#${order.args.c}> for this server!`);
      return;
    }

    // Toggle the watchdog status.
    let toggle = this.talent.status('ttvann', resonance.message.guild, resonance.bot) ? this.talent.disable('ttvann', resonance.message.guild, resonance.bot) : this.talent.enable('ttvann', resonance.message.guild, resonance.bot);

    // Get the new status.
    let status = toggle ? `Enabled` : `Disabled`;

    resonance.message.channel.send(`Twitch Announcements is now **${status}**.`);

    return;
  }

}

module.exports = TwitchAnnounce;