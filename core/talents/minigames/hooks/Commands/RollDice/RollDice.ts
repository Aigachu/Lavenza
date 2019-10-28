/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Command } from "../../../../../lib/Lavenza/Bot/Command/Command";
import { CommandConfigurations } from "../../../../../lib/Lavenza/Bot/Command/CommandConfigurations";
import { Resonance } from "../../../../../lib/Lavenza/Bot/Resonance/Resonance";
import { AbstractObject } from "../../../../../lib/Lavenza/Types";
import { Minigames } from "../../../Minigames";

/**
 * RollDice Command!
 *
 * Roll dice to test your luck! Play the lottery if you roll 10000/10000.
 */
export class RollDice extends Command {

  /**
   * Store the possible rolls in an object.
   */
  private static rolls: AbstractObject[];

  /**
   * Get a random answer for 8Ball to say.
   *
   * @returns
   *   The answer, fetched randomly from the list of answers.
   */
  public static async getRandomRoll(): Promise<AbstractObject> {
    // We'll use a random number for the array key.
    return RollDice.rolls[Math.floor(Math.random() * RollDice.rolls.length)];
  }

  /**
   * This is the static build function of the command.
   *
   * You can treat this as a constructor. Assign any properties that the command may
   * use!
   *
   * @inheritDoc
   */
  public async build(config: CommandConfigurations, talent: Minigames): Promise<void> {
    // The build function must always run the parent's build function! Don't remove this line.
    await super.build(config, talent);

    // Roll types are randomized and have different delays.
    RollDice.rolls = [];

    // Set roll types.
    RollDice.rolls.push({
      message: "*rolls the dice normally*",
      timeout: 2,
    });
    RollDice.rolls.push({
      message: "*throws the dice on the ground violently...*",
      timeout: 3,
    });
    RollDice.rolls.push({
      message: "*accidentally drops the dice on the ground while getting ready*",
      timeout: 4,
    });
    RollDice.rolls.push({
      message: "*spins the dice*",
      timeout: 4,
    });

  }

  /**
   * Execute command.
   *
   * @inheritDoc
   */
  public async execute(resonance: Resonance): Promise<void> {
    // Get arguments.
    const args = await resonance.getArguments();

    // Determine the type of die requested.
    // It will default to 6 face dice.
    const faces = args._[0] || 6;

    // If the # of faces is not a number, we send a message and return.
    if (isNaN(faces)) {
      return;
    }

    // Roll the die.
    const roll = Math.floor(Math.random() * faces) + 1;

    // Choose a roll type with a random key.
    const rand = await RollDice.getRandomRoll();

    // Send the initial message.
    await resonance.reply(rand.message);

    // Invoke Client Handlers to determine what to do in each client.
    /** @see ./handlers */
    await this.fireClientHandlers(resonance, {
      delay: rand.timeout,
      roll,
      },
    );
  }

}
