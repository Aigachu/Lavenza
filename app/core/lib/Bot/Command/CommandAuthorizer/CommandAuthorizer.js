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
   * @param {Resonance} resonance
   *   The resonance that contained the order.
   */
  constructor(resonance) {
    this.resonance = resonance;
    this.order = resonance.order;
    this.command = resonance.order.command;
    this.bot = resonance.bot;
    this.type = resonance.client.type;
  }

  /**
   * Perform async operations that occur right after building an Authorizer.
   *
   * @returns {Promise<void>}
   */
  async build(resonance) {
    this.botClientConfig = await Lavenza.Gestalt.get(`/bots/${this.bot.id}/clients/${resonance.client.type}`);
    this.clientMasterConfig = await resonance.bot.getClientConfig(this.type);
    this.operators = this.clientMasterConfig.operators;
    this.masters = this.clientMasterConfig.masters;
    this.deities = this.clientMasterConfig.deities;
    this.architect = this.clientMasterConfig.architect;
    this.commandConfig = this.order.config.command;
    this.commandParameterConfig = await this.command.getActiveParameterConfig(resonance.bot);
    this.commandClientConfig = await this.command.getActiveClientConfig(this.type, resonance.bot);
    this.cooldowns = this.commandClientConfig['cooldown'] || this.commandConfig['cooldown'];

    this.operatorsToValidate = [...this.operators, ...this.masters, ...this.deities];
    this.mastersToValidate = [...this.masters, ...this.deities];

    // Add the architect to all lists.
    this.operatorsToValidate.push(this.architect);
    this.mastersToValidate.push(this.architect);
    this.deities.push(this.architect);
  }

  /**
   * The authority function. This function will return TRUE if the order is authorized, and FALSE otherwise.
   *
   * This is a default implementation of the method. Authorizers should be created per client, and each client
   * authorizes commands in their own way through their respective Authorizers. They will however each call this
   * default authorize function first.
   *
   * @returns {Promise<boolean>}
   *   Returns true if the order is authorized. False otherwise.
   */
  async authorize() {

    // Validate that the command isn't on cooldown.
    // Check if cooldowns are on for this command.
    // If so, we have to return.
    let cooldownValidation = await this.validateCooldown();

    if (!cooldownValidation) {
      // Depending on the type of client we have, we want to alert the person that tried to use the command differently.
      switch (this.resonance.client.type) {
        // On Discord, we send a simple message and delete it later.
        case Lavenza.ClientTypes.Discord: {
          // Send a reply alerting the user that the command is on cooldown.
          this.resonance.reply(`That command is on cooldown. :) Please wait!`).then(async message => {
            // Delete the message containing the command.
            this.resonance.message.delete().catch(Lavenza.continue);

            // After 5 seconds, delete the reply originally sent.
            await Lavenza.wait(5);
            await message.delete().catch(Lavenza.continue);
          });
          break;
        }

        // On Twitch, we whisper a message to the resonance's author. We don't wanna clog the chat.
        case Lavenza.ClientTypes.Twitch: {
          // Send a whisper directly to the author.
          await this.resonance.send(this.resonance.author, `That command is on cooldown. :) Please wait!`);
          break;
        }
      }
      return false;
    }

    // If command arguments aren't valid, we hit the message with a reply explaining the error, and then end.
    let argumentsValidation = await this.validateCommandArguments();
    if (!argumentsValidation) {
      return false;
    }

    return true;
  }

  /**
   * Validate command arguments if we need to.
   *
   * This simply checks if the command has input. When it comes to options or flags in commands, specific checks
   * must be performed per client authorizer, since each client has a different way to manage authority.
   *
   * This default method should always be called by the overridden implementations in the child classes.
   *
   * @returns {Boolean}
   *   Returns true if the arguments are valid. False otherwise.
   */
  async validateCommandArguments() {

    // First, we perform input validations.
    if (this.commandParameterConfig.input) {
      if (this.commandParameterConfig.input.required === true && Lavenza.isEmpty(this.order.args._)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Puts the command on cooldown using Makoto.
   */
  cool() {
    // Cools the command globally after usage.
    if (this.cooldowns.global !== 0) {
      Lavenza.Makoto.set(this.bot.id, 'command', this.commandConfig.key, 0, this.cooldowns.global * 1000);
    }

    // Cools the command after usage for the user.
    if (this.cooldowns.user !== 0) {
      Lavenza.Makoto.set(this.bot.id, 'command', this.commandConfig.key, this.resonance.author.id, this.cooldowns.user * 1000);
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
    // @TODO - If the invoker is an architect or deity, they shouldn't be affected by cooldowns.

    // Using the cooldown manager, we check if the command is on cooldown first.
    // Cooldowns are individual per user. So if a user uses a command, it's not on cooldown for everyone.
    if (Lavenza.Makoto.check(this.bot.id, 'command', this.commandConfig.key, 0)) {
      return false;
    }

    if (Lavenza.Makoto.check(this.bot.id, 'command', this.commandConfig.key, this.resonance.author.id)) {
      return false;
    }

    return true;
  }

}