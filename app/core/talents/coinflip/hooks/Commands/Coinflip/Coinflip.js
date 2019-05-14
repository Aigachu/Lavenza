/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import GuessGameArgHandler from "./src/ArgHandler/GuessGameArgHandler";

/**
 * Coinflip command.
 *
 * Flip a coin!
 */
export default class Coinflip extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async build(config, talent) {

    // The build function must always run the parent's build function! Don't remove this line.
    await super.build(config, talent);

    // Maximum number of coins to flip.
    this.maximumNumberOfCoins = 5;

  }

  /**
   * Flip a coin and return Heads or Tails.
   *
   * @returns {Promise<string>}
   */
  static flipACoin() {
    return Math.floor(Math.random() * 2) === 0 ? 'Tails' : 'Heads';
  }

  /**
   * @inheritDoc
   */
  static async execute(resonance) {

    // If the 'd' or 'duel' arguments are used, we fire the DuelArgHandler handler.
    if ('g' in resonance.order.args || 'guess' in resonance.order.args || 'guessgame' in resonance.order.args) {
      let input = resonance.order.args.d || resonance.order.args['guess'] || resonance.order.args['guessgame'];
      await GuessGameArgHandler.handle(this, resonance, input).catch(Lavenza.stop);
      return;
    }

    // Here we go forth with the regular execution of the command.
    // By default, the user is only flipping 1 coin.
    let numberOfCoins = 1;

    // If the 'c' or 'coins' argument is used, we change the number of coins.
    if ('c' in resonance.order.args || !isNaN(resonance.order.rawContent) && !Lavenza.isEmpty(resonance.order.rawContent)) {
      // Determine what we're working with.
      let providedNumber = resonance.order.args.c || parseInt(resonance.order.rawContent);

      // If the provided count isn't a number, we can't go through with this.
      if (isNaN(providedNumber) || !Number.isInteger(providedNumber)) {
        await resonance.__reply(`Uh...Sorry {{user}}, but this doesn't seem to be a valid number of coins to flip.`, {user: resonance.author}, '::COINFLIP-INVALID_COIN_COUNT');
        return;
      }

      // We'll set a maximum. On va se calmer la...
      if (providedNumber > this.maximumNumberOfCoins) {
        await resonance.__reply(`Whoa {{user}}! Let's not exaggerate now haha. Maximum of {{max}} coins okay?!`, {user: resonance.author, max: await Lavenza.bold(this.maximumNumberOfCoins)}, '::COINFLIP-MAX_COIN_COUNT_SURPASSED');
        return;
      }

      // Otherwise, we should be good to adjust the number of coins.
      numberOfCoins = providedNumber;
    }

    // Now we'll work out flipping the coins.
    // If we're only flipping 1 coin, we simply do it.
    if (numberOfCoins === 1) {
      // Flip the coin already and get the result.
      let result = this.flipACoin();

      // Type for a second for some added effect!
      await this.resonance.typeFor(1, this.resonance.channel);

      // First, we'll send the flip message.
      await this.resonance.__reply(`Okay {{user}}! Flipping a coin!`, {user: this.resonance.author}, '::COINFLIP-FLIP_MESSAGE');

      // Type for 2 seconds.
      await this.resonance.typeFor(2, this.resonance.channel);

      // Send the result!
      await this.resonance.__reply(`{{user}}, you obtained {{result}}!`, {user: this.resonance.author, result: await Lavenza.bold(result)}, '::COINFLIP-FLIP_RESULT');

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
      if (this.flipACoin() === 'Heads') {
        results.heads++;
      } else {
        results.tails++;
      }
    }

    // Alternatively, when we have multiple results...
    // Type for a second for some added effect!
    await this.resonance.client.typeFor(1, this.resonance.channel);

    // First, we'll send the flip message.
    await this.resonance.__reply(`Okay {{user}}! Flipping {{count}} coins. This will only take a moment...`, {user: this.resonance.author, count: await Lavenza.bold(numberOfCoins)}, '::COINFLIP-FLIP_MESSAGE_MULTIPLE');

    // Type for 2 seconds.
    await this.resonance.client.typeFor(4, this.resonance.channel);

    // Send the result!
    await this.resonance.__reply(`{{user}}, you obtained the following results:\n\nTails: {{tails}}\nHeads: {{heads}}`, {
      user: this.resonance.author,
      tails: await Lavenza.bold(results.tails),
      heads: await Lavenza.bold(results.heads)
    }, '::COINFLIP-FLIP_RESULT_MULTIPLE');

  }

}