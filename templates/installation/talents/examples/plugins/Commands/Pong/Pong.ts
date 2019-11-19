/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Command, CommandConfigurations, Instruction, PromptException, PromptExceptionType, Resonance } from "lavenza";

import { Examples } from "../../../Examples";

/**
 * Pong command.
 *
 * Literally just replies with 'Ping!'.
 *
 * A great testing command.
 */
export class Pong extends Command {

  /**
   * This is the static build function of the command.
   *
   * You can treat this as a constructor. Assign any properties that the command may
   * use!
   *
   * @inheritDoc
   */
  public async build(config: CommandConfigurations, talent: Examples): Promise<void> {
    // The build function must always run the parent's build function! Don't remove this line.
    await super.build(config, talent);
  }

  /**
   * The execution of the command's actions.
   *
   * If this is a command that is available in multiple clients, you can make cases surrounding the 'type' property
   * of the resonance's client. A simple way to do this is to implement a switch statement on 'resonance.client.type'.
   *
   * Available for use is also the this.fireClientHandlers() function.
   * The best way to understand this is to take a long look at this command's folder and code!
   *
   * Alternatively, you can adopt any design pattern you want.
   *
   * @inheritDoc
   */
  public async execute(instruction: Instruction, resonance: Resonance): Promise<void> {
    // Different actions per client type.
    // Here, we use what we call Handlers to handle tasks that should be done depending on the client we're on!
    // Note that this is UNNECESSARY if your command is intended to only work on one client!
    // You determine what clients this command runs on in the COMMANDNAME.config.yml file.
    // In this case, the third parameter is ommitted. It can be used to select which function from the Handler to run.
    /** @see ./handlers */
    await this.fireClientHandlers(resonance, {hello: "hello"});

    // Prompts.
    // A cool feature of this framework is the ability to set up prompts. They're a little advanced, so bear with me.
    // First thing's first, the code is the same regardless of which client you're in, so don't worry about that!
    // This example will ask the user if they had a nice day.
    // First, we ask a simple question expecting an answer.
    await resonance.__reply(
      "Anyways, did you have a nice day, {{author}}?",
      {author: resonance.author.username}, resonance.locale,
    );

    // Set a variable to track whether the user had a good day.
    let goodDay = false;

    // Then, we can set the prompt.
    // This will immediately begin a process where the bot awaits a response.
    // You set the required parameters, which SHOULD be straightforward. The third parameter is the time limit.
    // The fourth is the response callback. So when a response is heard, you determine what code runs upon getting it.
    // If the time limit elapses, or an error is thrown in your onResponse callback, you will fall into the onError().
    // The fifth parameter is the callback function for when a response is received.
    await resonance.prompt(
      resonance.author,
      resonance.channel,
      10,
      async (responseResonance, prompt) => {
        // Check if the user says yes or no.
        if (responseResonance.content === "yes") {
          // They had a good day,
          goodDay = true;

          // Says they're happy to hear that!
          await resonance.__reply("Awesome! I'm so glad to hear that. :)");
        } else if (responseResonance.content === "no") {
          // They had a bad day,
          goodDay = false;

          // Say that's unfortunate...
          await resonance.__reply("How unfortunate...I hope you have a better day tomorrow!!");
        } else {
          // Explain that this command is just a tutorial.
          await prompt.error(PromptExceptionType.INVALID_RESPONSE);
        }
      },
      async (error: PromptException) => {
        // Depending on the type of error, you can send different replies.
        switch (error.type) {
          // This is ran when no response is provided.
          case PromptExceptionType.NO_RESPONSE: {
            await resonance.__reply("Hey, are you ignoring me? That's rude...I'll remember this. >:(", "::PONG_NO_RESPONSE");
            break;
          }

          // This is ran when the max amount of resets is hit.
          case PromptExceptionType.MAX_RESET_EXCEEDED: {
            await resonance.__reply("Oof okay. I don't think you got the message...We can talk later!", "::PONG_MAX_TRIES");
            break;
          }

          // This is the message sent when no response is provided.
          case PromptExceptionType.INVALID_RESPONSE: {
            await resonance.__reply(`Hey to be honest I only check for "yes" or "no"...We're just in a tutorial command after all! So I couldn't quite make out your answer. HAHA! Mind trying again?`, "::PONG_INVALID_RESPONSE");
          }
        }
      });

    // Different actions per client type, but with a custom method invoked through the handler.
    // By default, when you use handlers, they will call the execute() method within the handler.
    // Here is an example where you tell the handlers to run a different function.
    // This can become very useful if you wanna do client specific things many times in your command!
    /** @see ./handlers */
    await this.fireClientHandlers(resonance, {goodDay}, "myCustomMethod");

    // Now that's it for level 2. Feel free to have a look at Pang! Now that command will have even more advanced stuff.
    // The beauty of Talents is the fact that you can organize it however way you want.
    // The framework simply provides many utility functions and entry points for you to get started with. :)
    // Enjoy Pang!
  }

}
