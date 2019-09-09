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
  static async execute(resonance) {

    // If the "a" option is used, add a stream to the list of announcements in the server.
    if ('a' in resonance.order.args) {
      await this.talent.ttvannAddStream(resonance, resonance.order.args.a);
      return;
    }

    // If the "r" option is used, remove a stream to the list of announcements in the server.
    if ("r" in resonance.order.args) {
      await this.talent.ttvannRemoveStream(resonance, resonance.order.args.r);
      return;
    }

    // If the "s" option is used, check the status of the watchdog in this guild.
    if ("s" in resonance.order.args) {
      let status = await this.talent.status(resonance.message.guild, resonance.bot) ? `Enabled` : `Disabled`;
      await resonance.__reply(`Twitch channel stream announcements are currently {{status}}.`, {
        status: await Lavenza.bold(status),
      });
      return;
    }

    // If the "l" option is used, list the channels that are set up for announcements.
    if ("l" in resonance.order.args) {
      await this.talent.list(resonance);
      return;
    }

    // If the "c" option is used, set the announcement channel for this server.
    if ("c" in resonance.order.args) {
      resonance.order.args.c = resonance.order.args.c.replace('<#', '');
      resonance.order.args.c = resonance.order.args.c.replace('>', '');
      resonance.order.args.c = resonance.order.args.c.replace('!', '');

      if (resonance.order.args.c === "#here") {
        resonance.order.args.c = resonance.message.channel.id;
      }

      await this.talent.ttvannSetAnnChannel(resonance.message.guild.id, resonance.order.args.c, resonance.bot);
      await resonance.__reply(`Twitch announcements will now be done in the {{channel}}. Adjust your notifications accordingly if you don't want to get spammed!`, {
        channel: `<#${resonance.order.args.c}>`,
      });
      return;
    }

    // Toggle the watchdog status.
    let toggle = await this.talent.status(resonance.message.guild, resonance.bot);
    if (toggle) {
      await this.talent.disable(resonance.message.guild, resonance.bot)
    } else {
      await this.talent.enable(resonance.message.guild, resonance.bot);
    }

    // Get the new status.
    let status = !toggle ? `Enabled` : `Disabled`;

    await resonance.__reply(`Twitch channel stream announcements are now {{status}}.`, {
      status: await Lavenza.bold(status),
    });

  }

}