/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Hello command.
 *
 * Literally just replies with 'Hello!'.
 *
 * A great testing command.
 */
class EightBall extends Lavenza.Command {

  /**
   * @inheritDoc
   */
  static async execute(order, resonance) {

    // If some input was actually given, we can process the command.
    // @TODO - Check if the input is actually a question.
    if (Lavenza.isEmpty(order.rawContent)) {
      // If no input is given, then no question was actually asked.
      resonance.message.reply("8ball says: \"_Now now, ask me something. Don't be shy!_\"");
      return;
    }

    // We'll store all possible answers in an array.
    let answers = [];

    answers.push({
      message: `8ball says: _**"It is certain."**_`,
      timeout: 2
    });
    answers.push({
      message: `8ball says: _**"It is decidedly so."**_`,
      timeout: 2
    });
    answers.push({
      message: `8ball says: _**"Without a doubt."**_`,
      timeout: 3
    });
    answers.push({
      message: `8ball says: _**"Yes, definitely."**_`,
      timeout: 4
    });
    answers.push({
      message: `8ball says: _**"You may rely on it."**_`,
      timeout: 2
    });
    answers.push({
      message: `8ball says: _**"As I see it, yes."**_`,
      timeout: 3
    });
    answers.push({
      message: `8ball says: _**"Most likely."**_`,
      timeout: 4
    });
    answers.push({
      message: `8ball says: _**"Outlook good."**_`,
      timeout: 2
    });
    answers.push({
      message: `8ball says: _**"Yes."**_`,
      timeout: 4
    });
    answers.push({
      message: `8ball says: _**"Signs point to yes."**_`,
      timeout: 2
    });
    answers.push({
      message: `8ball says: _**"Reply hazy try again."**_`,
      timeout: 2
    });
    answers.push({
      message: `8ball says: _**"Ask again later."**_`,
      timeout: 2
    });
    answers.push({
      message: `8ball says: _**"Better not tell you now."**_`,
      timeout: 3
    });
    answers.push({
      message: `8ball says: _**"Cannot predict now."**_`,
      timeout: 4
    });
    answers.push({
      message: `8ball says: _**"Concentrate and ask again."**_`,
      timeout: 2
    });
    answers.push({
      message: `8ball says: _**"Don't count on it."**_`,
      timeout: 3
    });
    answers.push({
      message: `8ball says: _**"My reply is no."**_`,
      timeout: 4
    });
    answers.push({
      message: `8ball says: _**"My sources say no."**_`,
      timeout: 2
    });
    answers.push({
      message: `8ball says: _**"Very doubtful."**_`,
      timeout: 4
    });
    answers.push({
      message: `8ball says: _**"Outlook not so good."**_`,
      timeout: 2
    });

    // The 'rand' variable will contain the answer chosen.
    // We'll use a random number for the array key.
    let rand = answers[Math.floor(Math.random() * answers.length)];

    // Start typing with the chosen answer's timeout, then send the reply to the user.
    resonance.message.channel.startTyping(1);
    Lavenza.wait(rand.timeout).then(() => {
      resonance.message.reply(rand.message);
      resonance.message.channel.stopTyping();
    });
  }

}

module.exports = EightBall;