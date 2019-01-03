/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * UserPic command.
 *
 * Used to send a bigger version of a user's avatar to a discord channel.
 */
export default class UserPic extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {

    // Trim the given tag from the command.
    order.rawContent = order.rawContent.trim().replace('<@', '').replace('!', '').replace('>', '');

    // Find the member in the current guild.
    let member = resonance.message.guild.members.find(member => member.id === order.rawContent);

    // If a member isn't found, the input may be wrong.
    if (member === null) {
      resonance.message.channel.send(`Hmm...Did you make a mistake? I couldn't get a pic with the input you provided... :(`);
      return;
    }

    // Send the user's avatar to the channel.
    resonance.message.channel.send(member.user.avatarURL);  }

}