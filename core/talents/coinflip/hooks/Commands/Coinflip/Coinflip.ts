/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {Command} from "../../../../../lib/Lavenza/Bot/Command/Command";
import {GuessGameArgHandler} from "./src/ArgHandler/GuessGameArgHandler";
import {Kawakami} from "../../../../../lib/Lavenza/Confidant/Kawakami";
import {Igor} from "../../../../../lib/Lavenza/Confidant/Igor";
import {Sojiro} from "../../../../../lib/Lavenza/Confidant/Sojiro";
import {Coinflip as CoinflipTalent} from "../../../Coinflip";
import {Resonance} from "../../../../../lib/Lavenza/Bot/Resonance/Resonance";

// noinspection JSUnusedGlobalSymbols
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
   * @inheritDoc
   */
  async build(config, talent) {
    // The build function must always run the parent's build function! Don't remove this line.
    await super.build(config, talent);
  }

  /**
   * Flip a coin and return Heads or Tails.
   */
  static async flipACoin(): Promise<string> {
    return Math.floor(Math.random() * 2) === 0 ? 'Tails' : 'Heads';
  }

  /**
   * @inheritDoc
   */
  async execute(resonance: Resonance) {
    // Get the arguments & raw content.
    let args = resonance.instruction.arguments;
    let content = resonance.instruction.content;

    // If the 'd' or 'duel' arguments are used, we fire the DuelArgHandler handler.
    if ('g' in args || 'guess' in args || 'guessgame' in args) {
      let input = args.d || args['guess'] || args['guessgame'];
      await GuessGameArgHandler.handle(this, resonance, input).catch(Igor.stop);
      return;
    }

    // Here, we go forth with the regular execution of the command.
    // By default, the user is only flipping 1 coin.
    let numberOfCoins = 1;

    // If the 'c' or 'coins' argument is used, we change the number of coins.
    if ('c' in args || !isNaN(content) && !Sojiro.isEmpty(content)) {
      // Determine what we're working with.
      let providedNumber = args.c || parseInt(content);

      // If the provided count isn't a number, we can't go through with this.
      if (isNaN(providedNumber) || !Number.isInteger(providedNumber)) {
        await resonance.__reply(`Uh...Sorry {{user}}, but this doesn't seem to be a valid number of coins to flip.`, {user: resonance.author}, '::COINFLIP-INVALID_COIN_COUNT');
        return;
      }

      // We'll set a maximum. On va se calmer la...
      if (providedNumber > this.maximumNumberOfCoins) {
        await resonance.__reply(`Whoa {{user}}! Let's not exaggerate now haha. Maximum of {{max}} coins okay?!`, {user: resonance.author, max: await Kawakami.bold(this.maximumNumberOfCoins)}, '::COINFLIP-MAX_COIN_COUNT_SURPASSED');
        return;
      }

      // We'll set a maximum. On va se calmer la...
      if (providedNumber === 0) {
        await resonance.__reply(`And how would you expect me to flip 0 coins?`, {user: resonance.author, max: await Kawakami.bold(this.maximumNumberOfCoins)}, '::COINFLIP-FLIP_ZERO_COINS');
        return;
      }

      // Otherwise, we should be good to adjust the number of coins.
      numberOfCoins = providedNumber;
    }

    // Now we'll work out flipping the coins.
    // If we're only flipping 1 coin, we simply do it.
    if (numberOfCoins === 1) {
      // Flip the coin already and get the result.
      let result = await Coinflip.flipACoin();

      // Type for a second for some added effect!
      await resonance.typeFor(1, resonance.channel);

      // First, we'll send the flip message.
      await resonance.__reply(`Okay {{user}}! Flipping a coin!`, {user: resonance.author}, '::COINFLIP-FLIP_MESSAGE');

      // Type for 2 seconds.
      await resonance.typeFor(2, resonance.channel);

      // Send the result!
      await resonance.__reply(`{{user}}, you obtained {{result}}!`, {user: resonance.author, result: await Kawakami.bold(result)}, '::COINFLIP-FLIP_RESULT');

      // End execution here.
      return;
    }

    // Alternatively, when there are multiple results, we calculate each result.
    let results = {
      tails: 0,
      heads: 0,
    };

    // Flip a coin for the number of times defined.
    for (let i = 0; i < numberOfCoins; i++) {
      // Flip a coin.
      let coinflip = await Coinflip.flipACoin();
      if (coinflip  === 'Heads') {
        results.heads++;
      } else {
        results.tails++;
      }
    }

    // Alternatively, when we have multiple results...
    // Type for a second for some added effect!
    await resonance.client.typeFor(1, resonance.channel);

    // First, we'll send the flip message.
    await resonance.__reply(`Okay {{user}}! Flipping {{count}} coins. This will only take a moment...`, {user: resonance.author, count: await Kawakami.bold(numberOfCoins)}, '::COINFLIP-FLIP_MESSAGE_MULTIPLE');

    // Type for 2 seconds.
    await resonance.client.typeFor(4, resonance.channel);

    // Send the result!
    await resonance.__reply(`{{user}}, you obtained the following results:\n\nTails: {{tails}}\nHeads: {{heads}}`, {
      user: resonance.author,
      tails: await Kawakami.bold(results.tails),
      heads: await Kawakami.bold(results.heads)
    }, '::COINFLIP-FLIP_RESULT_MULTIPLE');

  }

}
