/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Command } from "../../../../../lib/Lavenza/Bot/Command/Command";
import { Resonance } from "../../../../../lib/Lavenza/Bot/Resonance/Resonance";
import { Igor } from "../../../../../lib/Lavenza/Confidant/Igor";
import { Kawakami } from "../../../../../lib/Lavenza/Confidant/Kawakami";
import { Sojiro } from "../../../../../lib/Lavenza/Confidant/Sojiro";
import { Coinflip as CoinflipTalent } from "../../../Coinflip";

import { GuessGameArgHandler } from "./src/ArgHandler/GuessGameArgHandler";

// Noinspection JSUnusedGlobalSymbols
/**
 * Coinflip command.
 *
 * Flip a coin!
 */
export class Coinflip extends Command {

  /**
   * Declare the Talent.
   */
  protected talent: CoinflipTalent;

  /**
   * Maximum number of coins to flip.
   */
  private maximumNumberOfCoins: number = 5;

  /**
   * Flip a coin and return Heads or Tails.
   */
  public static async flipACoin(): Promise<string> {
    return Math.floor(Math.random() * 2) === 0 ? "Tails" : "Heads";
  }

  /**
   * Execute coinflip command tasks!
   *
   * @inheritDoc
   */
  public async execute(resonance: Resonance): Promise<void> {
    // Get the arguments & raw content.
    const args = resonance.instruction.arguments;
    const content = resonance.instruction.content;

    // If the 'd' or 'duel' arguments are used, we fire the DuelArgHandler handler.
    if ("g" in args || "guess" in args || "guessgame" in args) {
      const input = args.d || args.guess || args.guessgame;
      await GuessGameArgHandler.handle(this, resonance, input)
        .catch(Igor.stop);

      return;
    }

    // Here, we go forth with the regular execution of the command.
    // By default, the user is only flipping 1 coin.
    let numberOfCoins = 1;

    // If the 'c' or 'coins' argument is used, we change the number of coins.
    if ("c" in args || !isNaN(Number(content)) && !Sojiro.isEmpty(content)) {
      // Determine what we're working with.
      const providedNumber = args.c || Number(content);

      // If the provided count isn't a number, we can't go through with this.
      if (isNaN(providedNumber) || !Number.isInteger(providedNumber)) {
        await resonance.__reply(
          "Uh...Sorry {{user}}, but this doesn't seem to be a valid number of coins to flip.",
          {
            user: resonance.author,
          },
          "::COINFLIP-INVALID_COIN_COUNT",
        );

        return;
      }

      // We'll set a maximum. On va se calmer la...
      if (providedNumber > this.maximumNumberOfCoins) {
        await resonance.__reply(
          "Whoa {{user}}! Let's not exaggerate now haha. Maximum of {{max}} coins okay?!",
          {
            max: await Kawakami.bold(this.maximumNumberOfCoins),
            user: resonance.author,
          },
          "::COINFLIP-MAX_COIN_COUNT_SURPASSED",
        );

        return;
      }

      // We'll set a maximum. On va se calmer la...
      if (providedNumber === 0) {
        await resonance.__reply(
          "And how would you expect me to flip 0 coins?",
          {user: resonance.author, max: await Kawakami.bold(this.maximumNumberOfCoins)},
          "::COINFLIP-FLIP_ZERO_COINS",
        );

        return;
      }

      // Otherwise, we should be good to adjust the number of coins.
      numberOfCoins = providedNumber;
    }

    // Now we'll work out flipping the coins.
    // If we're only flipping 1 coin, we simply do it.
    if (numberOfCoins === 1) {
      // Flip the coin already and get the result.
      const result = await Coinflip.flipACoin();

      // Type for a second for some added effect!
      await resonance.typeFor(1, resonance.channel);

      // First, we'll send the flip message.
      await resonance.__reply("Okay {{user}}! Flipping a coin!", {user: resonance.author}, "::COINFLIP-FLIP_MESSAGE");

      // Type for 2 seconds.
      await resonance.typeFor(2, resonance.channel);

      // Send the result!
      await resonance.__reply(
        "{{user}}, you obtained {{result}}!",
        {
          result: await Kawakami.bold(result),
          user: resonance.author,
        },
        "::COINFLIP-FLIP_RESULT",
      );

      // End execution here.
      return;
    }

    // Alternatively, when there are multiple results, we calculate each result.
    const results = {
      heads: 0,
      tails: 0,
    };

    // Flip a coin for the number of times defined.
    for (let i = 0; i < numberOfCoins; i += 1) {
      // Flip a coin.
      const coinflip = await Coinflip.flipACoin();
      if (coinflip  === "Heads") {
        results.heads += 1;
      } else {
        results.tails += 1;
      }
    }

    // Alternatively, when we have multiple results...
    // Type for a second for some added effect!
    await resonance.client.typeFor(1, resonance.channel);

    // First, we'll send the flip message.
    await resonance.__reply(
      "Okay {{user}}! Flipping {{count}} coins. This will only take a moment...",
      {
        count: await Kawakami.bold(numberOfCoins),
        user: resonance.author,
      },
      "::COINFLIP-FLIP_MESSAGE_MULTIPLE",
    );

    // Type for 2 seconds.
    await resonance.client.typeFor(4, resonance.channel);

    // Send the result!
    await resonance.__reply(
      "{{user}}, you obtained the following results:\n\nTails: {{tails}}\nHeads: {{heads}}",
      {
        heads: await Kawakami.bold(results.heads),
        tails: await Kawakami.bold(results.tails),
        user: resonance.author,
     },
      "::COINFLIP-FLIP_RESULT_MULTIPLE",
    );

  }

}
