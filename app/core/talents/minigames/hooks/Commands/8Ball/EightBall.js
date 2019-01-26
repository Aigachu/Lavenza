/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * 8Ball command! Ask 8Ball a question. :)
 */
export default class EightBall extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(resonance) {

    // If some input was actually given, we can process the command.
    // @TODO - Check if the input is actually a question.
    if (Lavenza.isEmpty(resonance.order.rawContent)) {
      // If no input is given, then no question was actually asked.
      resonance.reply(`"Now now, ask me something. Don't be shy!"`);
      return;
    }

    // We'll store all possible answers in an array.
    let answers = [];

    answers.push({
      message: `"It is certain."`,
      timeout: 2
    });
    answers.push({
      message: `"It is decidedly so."`,
      timeout: 2
    });
    answers.push({
      message: `"Without a doubt."`,
      timeout: 3
    });
    answers.push({
      message: `"Yes, definitely."`,
      timeout: 4
    });
    answers.push({
      message: `"You may rely on it."`,
      timeout: 2
    });
    answers.push({
      message: `"As I see it, yes."`,
      timeout: 3
    });
    answers.push({
      message: `"Most likely."`,
      timeout: 4
    });
    answers.push({
      message: `"Outlook good."`,
      timeout: 2
    });
    answers.push({
      message: `"Yes."`,
      timeout: 4
    });
    answers.push({
      message: `"Signs point to yes."`,
      timeout: 2
    });
    answers.push({
      message: `"Reply hazy try again."`,
      timeout: 2
    });
    answers.push({
      message: `"Ask again later."`,
      timeout: 2
    });
    answers.push({
      message: `"Better not tell you now."`,
      timeout: 3
    });
    answers.push({
      message: `"Cannot predict now."`,
      timeout: 4
    });
    answers.push({
      message: `"Concentrate and ask again."`,
      timeout: 2
    });
    answers.push({
      message: `"Don't count on it."`,
      timeout: 3
    });
    answers.push({
      message: `"My reply is no."`,
      timeout: 4
    });
    answers.push({
      message: `"My sources say no."`,
      timeout: 2
    });
    answers.push({
      message: `"Very doubtful."`,
      timeout: 4
    });
    answers.push({
      message: `"Outlook not so good."`,
      timeout: 2
    });

    // The 'rand' variable will contain the answer chosen.
    // We'll use a random number for the array key.
    let rand = answers[Math.floor(Math.random() * answers.length)];

    // Build the response, translated.
    let response = await Lavenza.__(`8ball says: {{response}}`, {response: await Lavenza.__(rand.message, resonance.locale)}, resonance.locale);

    // Depending on the type of client, we do different actions.
    switch (resonance.client.type) {

      // If we're in Discord, we do a bit of typing to make it seem more natural.
      case Lavenza.ClientTypes.Discord: {
        // Start typing with the chosen answer's timeout, then send the reply to the user.
        await resonance.client.typeFor(1, resonance.channel);
        await Lavenza.wait(rand.timeout);
        await resonance.reply(response);
        await resonance.message.channel.stopTyping();
        return;
      }

      // If we're in Twitch, simply send the answer.
      case Lavenza.ClientTypes.Twitch: {
        // Start typing with the chosen answer's timeout, then send the reply to the user.
        await resonance.reply(response);
        return;
      }
    }


  }

}