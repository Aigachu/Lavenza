/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

import { Yoshida } from "../../../../../lib/Lavenza/Confidant/Yoshida";
import { Resonance } from "../../../../../lib/Lavenza/Resonance/Resonance";
import { AbstractObject } from "../../../../../lib/Lavenza/Types";
import { Command } from "../../../../commander/src/Command/Command";
import { CommandConfigurations } from "../../../../commander/src/Command/CommandConfigurations";
import { Instruction } from "../../../../commander/src/Instruction/Instruction";

/**
 * 8Ball command! Ask 8Ball a question. :)
 */
export class EightBall extends Command {

  /**
   * Provides an array to house possible answers.
   */
  private answers: AbstractObject[];

  /**
   * Eightball Builder.
   *
   * @inheritDoc
   */
  public async build(config: CommandConfigurations): Promise<void> {
    // The build function must always run the parent's build function! Don't remove this line.
    await super.build(config);

    // We'll store all possible answers in an array.
    // The timeout is the amount of time before the answer is actually said. Adds a bit of suspense!
    this.answers = [];
    this.answers.push({
      message: '"It is certain."',
      timeout: 2,
    });
    this.answers.push({
      message: '"It is decidedly so."',
      timeout: 2,
    });
    this.answers.push({
      message: '"Without a doubt."',
      timeout: 3,
    });
    this.answers.push({
      message: '"Yes, definitely."',
      timeout: 4,
    });
    this.answers.push({
      message: '"You may rely on it."',
      timeout: 2,
    });
    this.answers.push({
      message: '"As I see it, yes."',
      timeout: 3,
    });
    this.answers.push({
      message: '"Most likely."',
      timeout: 4,
    });
    this.answers.push({
      message: '"Outlook good."',
      timeout: 2,
    });
    this.answers.push({
      message: '"Yes."',
      timeout: 4,
    });
    this.answers.push({
      message: '"Signs point to yes."',
      timeout: 2,
    });
    this.answers.push({
      message: '"Reply hazy try again."',
      timeout: 2,
    });
    this.answers.push({
      message: '"Ask again later."',
      timeout: 2,
    });
    this.answers.push({
      message: '"Better not tell you now."',
      timeout: 3,
    });
    this.answers.push({
      message: '"Cannot predict now."',
      timeout: 4,
    });
    this.answers.push({
      message: '"Concentrate and ask again."',
      timeout: 2,
    });
    this.answers.push({
      message: `"Don't count on it."`,
      timeout: 3,
    });
    this.answers.push({
      message: '"My reply is no."',
      timeout: 4,
    });
    this.answers.push({
      message: '"My sources say no."',
      timeout: 2,
    });
    this.answers.push({
      message: '"Very doubtful."',
      timeout: 4,
    });
    this.answers.push({
      message: '"Outlook not so good."',
      timeout: 2,
    });
  }

  /**
   * Get a random answer for 8Ball to say.
   *
   * @returns
   *   The answer, fetched randomly from the list of answers.
   */
  public async getRandomAnswer(): Promise<AbstractObject> {
    // We'll use a random number for the array key.
    return this.answers[Math.floor(Math.random() * this.answers.length)];
  }

  /**
   * Execute command.
   *
   * @inheritDoc
   */
  public async execute(instruction: Instruction, resonance: Resonance): Promise<void> {
    // Get a random answer.
    const rand = await this.getRandomAnswer();

    // Translate the answer's message real quick.
    const answerMessage = await Yoshida.translate(rand.message, resonance.locale);

    // Invoke Client Handlers to determine what to do in each client.
    /** @see ./handlers */
    await this.fireClientHandlers(resonance, {answer: answerMessage, delay: rand.timeout});
  }

}
