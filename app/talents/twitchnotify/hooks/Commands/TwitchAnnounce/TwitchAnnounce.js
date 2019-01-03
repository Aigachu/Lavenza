/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Twitch Announce command
 *
 * Customize the Twitch Announcements in a Discord server.
 */
export default class TwitchAnnounce extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {

    // If the "a" option is used, add a stream to the list of announcements in the server.
    if ('a' in order.args) {
      await this.talent.ttvannAddStream(resonance.message.guild.id, order.args.a, resonance.bot).catch(Lavenza.stop);
      resonance.message.channel.send(`Added **${order.args.a}** to the list of Twitch Announcements in this server!`);
      return;
    }

    // If the "r" option is used, remove a stream to the list of announcements in the server.
    if ("r" in order.args) {
      await this.talent.ttvannRemoveStream(resonance.message.guild.id, order.args.r, resonance.bot).catch(Lavenza.stop);
      resonance.message.channel.send(`Removed **${order.args.r}** from the list of Twitch Announcements in this server!`);
      return;
    }

    // If the "s" option is used, check the status of the watchdog in this guild.
    if ("s" in order.args) {
      let status = await this.talent.status(resonance.message.guild, resonance.bot).catch(Lavenza.stop) ? `Enabled` : `Disabled`;
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

      await this.talent.ttvannSetAnnChannel(resonance.message.guild.id, order.args.c, resonance.bot).catch(Lavenza.stop);
      resonance.message.channel.send(`Set the announcement channel to <#${order.args.c}> for this server!`);
      return;
    }

    // Toggle the watchdog status.
    let toggle = await this.talent.status(resonance.message.guild, resonance.bot).catch(Lavenza.stop) ? this.talent.disable(resonance.message.guild, resonance.bot).catch(Lavenza.stop) : this.talent.enable(resonance.message.guild, resonance.bot).catch(Lavenza.stop);

    // Get the new status.
    let status = toggle ? `Enabled` : `Disabled`;

    resonance.message.channel.send(`Twitch Announcements is now **${status}**.`);

  }

}