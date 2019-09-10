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
export default class AddCmd extends Lavenza.Command {

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
    // We'll be sending this response back.
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

    // Sending a reply with the built-in reply() function in the resonance.
    // Resonances come with a shortcut function called reply() built in. This will send a message back to the same context.
    // Regardless of the client it came from, this function should work. So you don't have to worry about that.
    // Also, note that we send the static field we set above!
    await resonance.reply(this.responseMessage, '::PING_RESPONSE');

    // Sending a reply with the built-in __reply() function in the resonance.
    // The __reply() function has the exact same signature as the translation function, as it automatically handles translations.
    // We use a quick example of replacers here to avoid translating specific values or emotes.
    // In this case, you don't want to translate the author's name, or the emote either, so you use replacers!
    // On top of everything, Personalizations are built-in to the function as well. You must add a tag at the end
    await resonance.__reply(`Hi {{author}}! Here's some tea: {{tea}}`, {author: resonance.author.username, tea: ':tea:'}, '::PING_RESPONSE_TEA');

    // That was the simple part, so make sure you understand it before moving on!

    // You can customize what happens in this command depending on which client it's invoked in.
    // The "easy mode" way to do this is with a switch statement.
    // The client you're residing in at the current execution is always found at 'resonance.client.type'.
    // As for the cases you're setting, all available client types are available at 'Lavenza.ClientTypes'.
    // switch (resonance.client.type) {
    //
    //   // In a Discord client context...
    //   case Lavenza.ClientTypes.Discord: {
    //
    //     // Send this lovely reply.
    //     await resonance.__reply(`Always been a fan of Discord to be honest! Like, why even bother with the rest?!`);
    //     break;
    //
    //   }
    //
    //   // In a Twitch client context...
    //   case Lavenza.ClientTypes.Twitch: {
    //
    //     // Send this awesome reply.
    //     await resonance.__reply(`Been thinking of getting Twitch Prime to avoid ads...What do you think?`);
    //     break;
    //
    //   }
    //
    //   // In a Slack client context...
    //   case Lavenza.ClientTypes.Slack: {
    //
    //     // Send this awesome reply.
    //     await resonance.__reply(`Isn't Slack lovely? Honestly my favorite part about Slack is the ability to customize loading messages!`);
    //     break;
    //
    //   }
    // }

    // After you're done checking out this command, check out the Pong command for more advanced examples of what you can do!

  }

}