/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Pong command.
 *
 * Literally just replies with 'Ping!'.
 *
 * A great testing command.
 */
export default class Pong extends Lavenza.Command {

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

  }

  /**
   * The execution of the command's actions.
   *
   * If this is a command that is available in multiple clients, you can make cases surrounding the 'type' property
   * of the resonance's client. A simple way to do this is to implement a switch statement on 'resonance.client.type'.
   *
   * Available for use is also the this.handlers() function. The best way to understand this is to take a long at this
   * command's folder and code!
   *
   * Alternatively, you can adopt any design pattern you want.
   *
   * @inheritDoc
   */
  static async execute(resonance) {

    // Different actions per client type.
    // Here, we use what we call Handlers to handle tasks that should be done depending on the client we're on!
    // Note that this is UNNECESSARY if your command is intended to only work on one client!
    // You determine what client this command runs on in the COMMANDNAME.config.yml file.
    /** @see ./handlers */
    await this.handlers(resonance, {hello: 'hello'});

    // Prompts.
    // A cool feature of this framework is the ability to set up prompts. They're a little advanced, so bear with me.
    // First thing's first, the code is the same regardless of which client you're in, so don't worry about that!
    // This example will ask the user if they had a nice day.
    // First, we translate the text of the question.
    let promptText = await Lavenza.__(`Anyways, did you have a nice day, {{author}}?`, {author: resonance.author.username}, resonance.locale);

    // Then, we can set the prompt.
    // This will immediately ask the question and await a response.
    // You set the required parameters, we SHOULD be straightforward. The fourth parameter is the time limit set for
    // the response. If that time is elapsed, you will fall into the catch() block below.
    // The fifth parameter is the callback function for when a response is received.
    await resonance.bot.prompt(promptText, resonance.channel, resonance, 30, async (responseResonance, prompt) => {

      // Check if the user says yes or no.
      if (responseResonance.content === 'yes') {

        // Says they're happy to hear that!
        await resonance.__reply(`Awesome! I'm so glad to hear that. :)`).catch(Lavenza.stop);

      } else if (responseResonance.content === 'no') {

        // Say that's unfortunate...
        await resonance.__reply(`How unfortunate...I hope you have a better day tomorrow!!`).catch(Lavenza.stop);

      } else {

        // Explain that this command is just a tutorial.
        await resonance.__reply(`Hey to be honest I only check for "yes" or "no"...We're just in a tutorial command after all! So I couldn't quite make out your answer. HAHA! Still, I hope you had a great day!`).catch(Lavenza.stop);

      }

    }).catch(async error => {

      // You fall into here if the user fails to respond in time. You can decide to send a response, or not do anything. Your call!
      // If you decide not to do anything and silently end the prompt, you can remove this catch block entirely.
      await resonance.__reply(`Hey, are you ignoring me? That's rude...I'll remember this. >:(`);

    });

  }

}