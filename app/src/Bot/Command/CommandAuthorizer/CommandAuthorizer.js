/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides a base class for Command Authorizers.
 *
 * This class will handle the authorization of an already determined order.
 */
export default class CommandAuthorizer {

  /**
   * Command Authorizers are not static since multiple commands can come in at once, and we wouldn't want conflicts.
   *
   * Constructor actions are here.
   *
   * @param {Order} order
   *   The order that was received from the resonance.
   * @param {Resonance} resonance
   *   The resonance that contained the order.
   */
  constructor(order, resonance) {
    this.order = order;
    this.resonance = resonance;
    this.bot = this.resonance.bot;
    this.type = resonance.client.type;
    this.commandConfig = this.order.config.command;
    this.commandClientConfig = this.commandConfig['clients.config'][this.type];
    this.masters = this.order.config.bot.clients[this.type].masters;
    this.operators = this.order.config.bot.clients[this.type].operators;
    this.cooldowns = this.commandClientConfig.cooldown || this.commandConfig.cooldown;
  }

  /**
   * The authority function. This function will return TRUE if the order is authorized, and FALSE otherwise.
   *
   * This is a default implementation of the method. Authorizers should be created per client, and each client
   * authorizes commands in their own way through their respective Authorizers. They will however each call this
   * default authorize function that should be used by all.
   *
   * @returns {Promise<boolean>}
   */
  async authorize() {
    // No defaults yet...
    return true;
  }

  /**
   * Puts the command on cooldown.
   */
  cool() {
    // Cools the command globally after usage.
    if (this.cooldowns.global !== 0) {
      Lavenza.Makoto.set(this.bot.name, 'command', this.commandConfig.key, 0, this.cooldowns.global * 1000);
    }

    // Cools the command after usage for the user.
    if (this.cooldowns.user !== 0) {
      Lavenza.Makoto.set(this.bot.name, 'command', this.commandConfig.key, this.resonance.message.author.id, this.cooldowns.user * 1000);
    }
  }

  /**
   * Validates that the command is not on cooldown.
   *
   * If it is, we notify the user.
   *
   * @returns {Promise<boolean>}
   */
  async isCooled() {
    // Using the cooldown manager, we check if the command is on cooldown first.
    // Cooldowns are individual per user. So if a user uses a command, it's not on cooldown for everyone.
    if (Lavenza.Makoto.check(this.bot.name, 'command', this.commandConfig.key, 0)) {
      this.resonance.message.reply(`That command is on global cooldown. :) Please wait!`).then(async message => {
        this.resonance.message.delete();
        Lavenza.wait(5).then( () => {
          message.delete().catch(Lavenza.continue);
        });
      });
      return true;
    }

    if (Lavenza.Makoto.check(this.bot.name, 'command', this.commandConfig.key, this.resonance.message.author.id)) {
      this.resonance.message.reply(`That command is on cooldown. :) Please wait!`).then(async message => {
        this.resonance.message.delete();
        Lavenza.wait(5).then( () => {
          message.delete().catch(Lavenza.continue);
        });
      });
      return true;
    }

    return false;
  }

}