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
class UserPic extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {

    // Trim the given tag from the command.
    order.rawContent = order.rawContent.trim().replace('<@', '').replace('!', '').replace('>', '');

    console.log(order.rawContent);

    // Find the member in the current guild.
    let member = resonance.message.guild.members.find(member => member.id === order.rawContent);

    // If a member isn't found, the input may be wrong.
    if (member === null) {
      resonance.message.channel.send(`Hmm...Did you make a mistake? I couldn't get a pic with the input you provided... :(`);
      return false;
    }

    // Send the user's avatar to the channel.
    resonance.message.channel.send(member.user.avatarURL);  }

}

module.exports = UserPic;