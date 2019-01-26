/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Ping command.
 *
 * Literally just replies with 'Pong!'.
 *
 * A great testing command.
 */
export default class Ping extends Lavenza.Command {

  /**
   * This is the static build function of the command.
   *
   * You can treat this as a constructor. Assign any properties that the command may
   * use!
   *
   * @inheritDoc
   */
  static async build(config, talent) {

    // The build function must always run the parent's build function! Don't remove this line.
    await super.build(config, talent);

    // Example of setting a property to use across the command.
    this.responseMessage = 'Pong! Hello there. :)';

  }

  /**
   * The execution of the command's actions.
   *
   * If this is a command that is available in multiple clients, you can make cases surrounding the 'type' property
   * of the resonance. A simple way to do this is to implement a switch statement on 'resonance.type'.
   *
   * Alternatively, you can adopt any design pattern you want. The Pong command has an example of an advanced pattern
   * using Factory Design principles. Check that out!
   *
   * @inheritDoc
   */
  static async execute(resonance) {

    // Sending a very simple message.
    // Resonances come with a shortcut reply() function built it. This will send a message back to the same context.
    // Regardless of the client it came from, this function should work. So you don't have to worry about that.
    await resonance.__reply(`Pong! Hey there!`);

    // Sending a reply with the built-in reply() function in the resonance.
    // Resonances have a built-in reply() function that handles the sending depending on the client.
    // The reply function has the exact same signature as the translation function, as it automatically handles it.
    // We use a quick example of replacers here to avoid translating specific values or emotes.
    // await resonance.reply(`Pong! Here's your ID: {{id}}! {{tea}}`, {id: resonance.author.id, tea: ':tea:'});

    // That was the simple part, so make sure you understand it before moving on!

    // Different actions per client type.
    // Here, we use a switch statement to do different actions depending on the client.
    // Note that this is UNNECESSARY if your command is intended to only work on one client!
    switch (resonance.client.type) {

      // If we're in Discord..
      case Lavenza.ClientTypes.Discord: {
        await resonance.__reply('Ah, we seem to be on Discord! This application is so much better than Skype & TeamSpeak. Oof!');
        break;
      }

      // If we're in Twitch...
      case Lavenza.ClientTypes.Twitch: {
        await resonance.__reply(`I love Twitch! It's such a cool website. :P`);
        await resonance.__send(resonance.bot.architect.discord, 'Hey, a ping command was invoked on Twitch. :)');
        break;
      }
    }

  }

}