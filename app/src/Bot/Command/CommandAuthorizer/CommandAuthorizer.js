/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import ClientTypes from "../../Client/ClientTypes";

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

    // Validate that the command isn't on cooldown.
    // Check if cooldowns are on for this command.
    // If so, we have to return.
    let cooldownValidation = await this.validateCooldown().catch(Lavenza.stop);
    if (!cooldownValidation) {
      switch (this.resonance.client.type) {
        case ClientTypes.Discord:
          this.resonance.message.reply(`That command is on global cooldown. :) Please wait!`).then(async message => {

            // Delete the message containing the command.
            this.resonance.message.delete();

            // After 5 seconds, delete the reply originally sent.
            Lavenza.wait(5).then( () => {
              message.delete().catch(Lavenza.continue);
            });
          });
          break;
      }

      return false;
    }

    // If command arguments aren't valid, we hit the message with a reply explaining the error, and then end.
    let argumentsValidation = await this.validateCommandArguments().catch(Lavenza.stop);
    if (!argumentsValidation) {
      return false;
    }

    return true;
  }

  /**
   * Validate command arguments if we need to.
   *
   * @returns {Boolean}
   */
  async validateCommandArguments() {
    // First, we perform input validations.
    if (this.commandConfig.input) {
      if (this.commandConfig.input.required === true && Lavenza.isEmpty(this.order.args._)) {
        return false;
      }
    }

    // console.log(this.order.args);

    // Next, we perform option validations.
    if (this.commandConfig.options) {
      await Promise.all(this.commandConfig.options.map(async option => {
        // console.log(option);
      })).catch(error => {
        return false;
      });
    }

    // Next, we perform flag validations.
    if (this.commandConfig.flags) {
      await Promise.all(this.commandConfig.flags.map(async flag => {
        // console.log(flag);
      })).catch(error => {
        return false;
      });
    }

    // If all checks pass, we can return true.
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
   * @returns {Boolean}
   *   Returns false if the command is not cooled. True otherwise.
   */
   async validateCooldown() {

    // Using the cooldown manager, we check if the command is on cooldown first.
    // Cooldowns are individual per user. So if a user uses a command, it's not on cooldown for everyone.
    if (Lavenza.Makoto.check(this.bot.name, 'command', this.commandConfig.key, 0)) {
      return false;
    }

    if (Lavenza.Makoto.check(this.bot.name, 'command', this.commandConfig.key, this.resonance.message.author.id)) {
      return false;
    }

    return true;
  }

}