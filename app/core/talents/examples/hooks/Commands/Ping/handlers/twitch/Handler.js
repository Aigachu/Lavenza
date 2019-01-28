/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * A simple client handler.
 *
 * This class simply executes the tasks for a given command, in the context of a client.
 */
export default class Handler extends Lavenza.CommandClientHandler {

  /**
   * Execute this handler's tasks.
   *
   * @inheritDoc
   */
  async execute(data = {}) {
    await this.resonance.__reply(`I love Twitch! It's such a cool website. :P`);
    await this.resonance.__send(this.resonance.bot.architect.discord, 'Hey, a ping command was invoked on Twitch. :)');
  }

}