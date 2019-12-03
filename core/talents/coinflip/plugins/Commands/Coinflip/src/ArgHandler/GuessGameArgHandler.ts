/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as thesaurus from "thesaurus-com";

// Imports.
import { ClientType } from "../../../../../../../lib/Lavenza/Client/ClientType";
import { ClientUser } from "../../../../../../../lib/Lavenza/Client/ClientUser";
import { Sojiro } from "../../../../../../../lib/Lavenza/Confidant/Sojiro";
import { PromptExceptionType } from "../../../../../../../lib/Lavenza/Prompt/Exception/PromptExceptionType";
import { Prompt } from "../../../../../../../lib/Lavenza/Prompt/Prompt";
import { Resonance } from "../../../../../../../lib/Lavenza/Resonance/Resonance";
import { Coinflip } from "../../Coinflip";

/**
 * Argument handler for the 'guess' argument in the Coinflip command.
 */
export class GuessGameArgHandler {

  /**
   * Handle command 'd' & 'duel' options.
   *
   * @param command
   *   The command that invoked this argument handler.
   * @param resonance
   *   Resonance that issued the command.
   * @param userInput
   *   The value of the duel parameter sent by the user.
   */
  public static async handle(command: Coinflip, resonance: Resonance, userInput: string | boolean): Promise<void> {
    // @TODO - Twitch support will come later.
    if (resonance.client.type === ClientType.Twitch) {
      await resonance.__reply(
        "Unfortunately, the Coinflip Guessing Game are not yet supported on Twitch! Give it a try on Discord!",
        "::COINFLIP-GUESS_GAME_NO_TWITCH_SUPPORT",
      );

      return;
    }

    // First order of business is determining who the user wants to duel.
    // Initialize with a  message that serves as an introduction.
    // Depending on the client, handle the first sending of the message properly.
    await resonance.__reply(
      "Oooh {{user}}, a guessing game?! Haha, that's exciting!",
      {
        user: resonance.author,
      },
      "::COINFLIP-GUESS_GAME_INITIAL_MESSAGE",
    );

    // Type for a little bit.
    await resonance.typeFor(2, resonance.message.channel);

    // Variable to store input.
    let input;

    // If the input is set the 'true', that means there is no input added to the 'd' or 'duel' arguments.
    // We need to ask them for input containing the name of the opponent they'd like to duel.
    if (userInput === true) {
      input = await GuessGameArgHandler.promptForInput(command, resonance);
    }

    // If no input was provided and opponent is set to null, gracefully exit.
    if (!input) {
      return;
    }

    // Fetch opponent from the input provided.
    // We use client handlers to have different fetch methods per client.
    const opponent = await command.fireClientHandlers(
      resonance,
      {
        userInput: input,
      },
      "getOpponent",
    ) as ClientUser;


    // If an opponent could not be determined, we can't duel!
    if (opponent === undefined) {
      // Type for a little bit.
      await resonance.typeFor(2, resonance.message.channel);

      // Send a message stating that the opponent could not be determined.
      await resonance.__reply(
        "Hmm...I had trouble identifying your opponent. Make sure you enter their exact name, or tag them directly if you're on Discord!",
        {
          user: resonance.author,
        },
        "::COINFLIP-GUESS_GAME_OPPONENT_UNDEFINED",
      );

      // End execution.
      return;
    }

    // At this point, we know the opponent is defined.
    // If the opponent is the same as the user, we drag them.
    if (opponent.id === resonance.author.id) {
      await resonance.__reply("...Unfortunately, you can't challenge yourself {{user}}! Come on now. :P", {
        user: resonance.author,
      },                      "::COINFLIP-GUESS_GAME_YOURSELF");

      return;
    }

    // Get the confirmation from the opponent.
    const confirmation = await GuessGameArgHandler.confirmWithOpponent(command, resonance, opponent);

    // If our confirmation isn't...Confirmed...We end execution.
    if (!confirmation) {
      return;
    }

    // Add some typing suspense.
    await resonance.typeFor(3, resonance.message.channel);

    // Now we can actually go forth with the duel!
    await resonance.__reply("Ladies and gentlemen, we have ourselves a duel!", "::COINFLIP-GUESS_GAME_CONFIRMED");

    // Add some typing suspense.
    await resonance.typeFor(2, resonance.message.channel);

    // We'll go ahead and send a message, and also flip 2 coins to have the results.
    await resonance.__reply("Alright. I'm flipping a coin for each of you...", "::COINFLIP-GUESS_GAME_START_FLIPS");
    const challengerResult = await Coinflip.flipACoin();
    const opponentResult = await Coinflip.flipACoin();

    // Add some typing suspense.
    await resonance.typeFor(3, resonance.message.channel);

    // Announce that the results are ready!
    await resonance.__reply("Two coins flipped...I have the results right here. Hehe this is exciting!", "::COINFLIP-GUESS_GAME_RESULTS_CONFIRMED");

    // We pick one of the players at random.
    const guesser = Math.floor(Math.random() * 2) === 0 ? resonance.author : opponent;
    const prayer = guesser.id === resonance.author.id ? opponent : resonance.author;

    // Add some typing suspense.
    await resonance.typeFor(2, resonance.message.channel);

    // Now we can actually go forth with the duel!
    await resonance.__reply(
      "{{guesser}}! It's up to you to guess if both coin flips resulted in the **Same** result, or ended up with **Different** results.",
      {
        guesser,
      },
      "::COINFLIP-GUESS_GAME_RANDOM_PLAYER_GUESS",
    );

    // Add some typing suspense.
    await resonance.typeFor(3, resonance.message.channel);

    // Initialize variable to store the victor.
    let victor;

    // Start the prompt.
    await resonance.__reply("You have 10 seconds...**Starting now.**\n\nType in **Same** or **Different**!", "::COINFLIP-GUESS_GAME_RANDOM_PLAYER_GUESS_START");

    // Start up a prompt for the guesser's input.
    const guesserInput = await resonance.prompt(
      {
        onError: async (error) => {
          // Depending on the type of error, you can send different replies.
          switch (error.type) {
            // This is ran when no response is provided.
            case PromptExceptionType.NO_RESPONSE: {
              // Failing to reply will simply send a different message.
              await resonance.__reply(
                "AAAHH {{guesser}}, you failed to respond in time! This is considered a forfeit. As such, the victor is {{victor}}!!! Congratulations!",
                {
                  victor: prayer,
                },
                "::COINFLIP-GUESS_GAME_GUESSER_NO_RESPONSE",
              );
              break;
            }

            // This is ran when the max amount of resets is hit.
            case PromptExceptionType.MAX_RESET_EXCEEDED: {
              // Failing to reply will simply send a different message.
              await resonance.__reply(
                "{{guesser}}, COME ON! It's either **Same** or **Different**!!! WHAT DON'T YOU GET?!\nUgh whatever! The victor is {{victor}}. ENJOY YOUR FREEBIE!",
                {
                  victor: prayer,
                },
                "::COINFLIP-GUESS_GAME_GUESSER_MAX_TRIES",
              );
              break;
            }

            // This is the message sent when no response is provided.
            case PromptExceptionType.INVALID_RESPONSE: {
              await resonance.__reply("That's not a valid answer {{guesser}}! It's either **Same** or **Different**! Try again!", "::COINFLIP-GUESS_GAME_GUESSER_INVALID_INPUT");
            }
          }
        },
        onResponse: async (responseResonance: Resonance, prompt: Prompt) => {
          if (responseResonance.content.toLowerCase() !== Guess.Same && responseResonance.content.toLowerCase() !== Guess.Different) {
            await prompt.reset({error: PromptExceptionType.INVALID_RESPONSE});
          }
        },
        timeLimit: 10,
        user: guesser,
      });

    // Now we'll try to determine what the guesser said.
    const guess = await GuessGameArgHandler.resolveGuess(guesserInput.toLowerCase());

    // If the guesser says 'same', and the results are in fact the same, then they win.
    if (guess === Guess.Same && challengerResult === opponentResult) {
      victor = "guesser";
    } else if (guess === Guess.Different && challengerResult !== opponentResult) {
      victor = "guesser";
    } else {
      victor = "prayer";
    }

    // If the victor isn't determined, there is nothing left to say!
    if (!victor) {
      return;
    }

    // Otherwise, we announce the results and the winner!
    await resonance.__reply("ALRIGHT! Time for the reveal!", "::COINFLIP-GUESS_GAME_REVEAL");

    // Add some typing suspense.
    await resonance.typeFor(2, resonance.message.channel);

    // Reveal the result of the first coin.
    await resonance.__reply(
      "The first coin resulted in...**{{result}}**!",
      {
        result: challengerResult,
      },
      "::COINFLIP-GUESS_GAME_REVEAL_FIRST_COIN",
    );

    // Add some typing suspense.
    await resonance.typeFor(2, resonance.message.channel);

    // Reveal the result of the second coin.
    await resonance.__reply(
      "The second coin resulted in...**{{result}}**!",
      {
        result: opponentResult,
      },
      "::COINFLIP-GUESS_GAME_REVEAL_SECOND_COIN",
    );

    // If the guesser wins, we have some text.
    if (victor && victor === "guesser") {
      await resonance.__reply(
        "Looks like you were right, {{guesser}}! VICTORY IS YOURS! Haha, good job. :)\nBetter luck next time {{prayer}}!",
        {
          guesser,
          prayer,
        },
        "::COINFLIP-GUESS_GAME_GUESSER_WIN",
      );
    } else {
      await resonance.__reply(
        "OOF, {{guesser}}! YOU WERE WRONG! The win goes to {{prayer}}!",
        {
          guesser,
          prayer,
        },
        "::COINFLIP-GUESS_GAME_PRAYER_WIN",
      );
    }
  }

  /**
   * Prompt for user input.
   *
   * This is used when an opponent isn't tagged directly in the command invocation.
   *
   * @param command
   *   The command that invoked this argument handler.
   * @param resonance
   *   Resonance that issued the command.
   */
  public static async promptForInput(command: Coinflip, resonance: Resonance): Promise<string> {
    // Depending on the client, handle the sending of the message properly.
    await resonance.__reply(
      "Who would you like to challenge?",
      {
        user: resonance.author,
      },
      "::COINFLIP-GUESS_GAME_ASK_WHO",
    );

    // Activate a prompt waiting for the user to tell us who they want to duel.
    return await resonance.prompt(
      {
        onError: async () => {
          // Depending on the client, handle the sending of the message properly.
          await resonance.__reply(
            "...Since you decided to ignore my question, I'm canceling the game! Feel free to try again later when you're ready, {{user}}!",
            {
              user: resonance.author,
            },
            "::COINFLIP-GUESS_GAME_ASK_NO_RESPONSE",
          );
        },
        timeLimit: 10,
      }) as string;
  }

  /**
   * Resolve what the user's guess is depending on what is entered by them.
   *
   * @param guess
   *   The text guess said by the user.
   *
   * @return
   *   Return whether the guesser is saying they're the same, or different.
   */
  public static async resolveGuess(guess: string): Promise<string> {
    // Get synonyms of the word 'same'.
    const synonymsOfSame = await thesaurus.search(Guess.Same).synonyms;
    // @TODO - We can go as far as checking if ANY of the synonyms are in the text...But for now we're fine.
    if (guess === Guess.Same
      || guess.split(" ")
        .includes(Guess.Same)
      || new RegExp(synonymsOfSame.join("|")).test(guess)
    ) {
      return Guess.Same;
    }

    // Get synonyms of the word 'different'.
    const synonymsOfDifferent = await thesaurus.search(Guess.Different).synonyms;
    // @TODO - We can go as far as checking if ANY of the synonyms are in the text...But for now we're fine.
    if (guess === "different"
      || guess === "diff"
      || guess.split(" ")
        .includes(Guess.Different)
      || new RegExp(synonymsOfDifferent.join("|")).test(guess)
    ) {
      return Guess.Different;
    }
  }

  /**
   * Attempt to get a confirmation from the opponent that was challenged.
   *
   * The opponent will be prompted and the answer will determine whether or not the duel will happen.
   *
   * @param command
   *   The command that invoked this argument handler.
   * @param resonance
   *   Resonance that issued the command.
   * @param opponent
   *   The opponent determined from the input.
   */
  public static async confirmWithOpponent(
    command: Coinflip,
    resonance: Resonance,
    opponent: ClientUser,
  ): Promise<boolean> {
    // Initialize confirmation.
    let confirmation = false;

    // Add some typing suspense.
    await resonance.typeFor(2, resonance.message.channel);

    // Send a message to the opponent.
    await resonance.__reply(
      "{{opponent}}, looks like {{user}} wants to challenge you to a guessing game showdown. Do you accept?",
      {
        opponent,
        user: resonance.author,
      },
      "::COINFLIP-GUESS_GAME_OPPONENT_CONFIRM",
    );

    // Start up a prompt for the opponent's input.
    // Noinspection JSUnusedLocalSymbols
    await resonance.prompt(
      {
        onError: async () => {
          // Failing to reply will simply send a different message.
          await resonance.__reply(
            "Hmm, they're not available right now. Try again later!",
            {
              opponent,
            },
            "::COINFLIP-GUESS_GAME_OPPONENT_FAILED_CONFIRMATION",
          );
        },
        onResponse: async (responseResonance) => {
          // If the opponent sends a confirmation, we set confirmation to true.
          // Otherwise, send a sad message. :(
          confirmation = await Sojiro.isConfirmation(responseResonance.content);
          if (!confirmation) {
            await resonance.__reply("Aww ok. Maybe another time then!", "::COINFLIP-GUESS_GAME_DECLINED");
          }
        },
        timeLimit: 10,
        user: opponent,
      });

    return confirmation;
  }

}

/**
 * Declare an Enum to organize the different guessing possibilities.
 */
enum Guess {
  Same = "same",
  Different = "different",
}
