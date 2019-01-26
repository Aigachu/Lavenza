/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import CommandAuthorizer from "./CommandAuthorizer";

/**
 * Provides an Authorizer for commands invoked in Discord.
 */
export default class TwitchCommandAuthorizer extends CommandAuthorizer {

  /**
   * Since authorizers are static classes, we'll have a build function to make preparations.
   *
   * @returns {Promise<void>}
   */
  async build(resonance) {

    // Run parent build function.
    await super.build(resonance);

    this.author = resonance.author;
    this.channel = resonance.channel;

    // If there's a channel assigned to the resonance, we can add channel defined operators & masters.
    if (!Lavenza.isEmpty(this.channel)) {
      this.operatorsToValidate = [...this.operatorsToValidate, ...this.botClientConfig.channels[this.channel.id].operators, ...this.botClientConfig.channels[this.channel.id].masters];
      this.mastersToValidate = [...this.mastersToValidate, ...this.botClientConfig.channels[this.channel.id].masters];
    }

  }

  /**
   * The authority function. This function will return TRUE if the order is authorized, and FALSE otherwise.
   *
   * Discord specific checks are performed here.
   *
   * @returns {Promise<boolean>}
   */
  async authorize() {

    // First, we run through the default authorization function from the parent class.
    let defaultAuth = await super.authorize();
    if (!defaultAuth) {
      return false;
    }

    // At this point, if the configuration is empty, we have no checks to make, so we let it pass.
    if (Lavenza.isEmpty(this.commandClientConfig)) {
      // await Lavenza.warn('No configuration was found for this command...Is this normal?...');
      return true;
    }

    // Check if the command is activated.
    if (!this.validateActivation()) {
      await Lavenza.warn('activation validation failed');
      return false;
    }

    // Check if user is allowed to use this command.
    if (!this.validateUser()) {
      await Lavenza.warn('user validation failed');
      return false;
    }

    // Check if the user has appropriate operation access rights.
    if (!this.validateOpLevel()) {
      await Lavenza.warn('oplevel validation failed');
      return false;
    }

    // Check if this command is allowed to be used in DMs.
    if (!this.validatePMCommand()) {
      await Lavenza.warn('pm channel validation failed');
      return false;
    }

    // Validate that the command is allowed to be used in this Channel.
    if (!this.validateChannel()) {
      await Lavenza.warn('channel validation failed');
      return false;
    }

    // If all those checks pass through, we can authorize the command.
    return true;
  }

  /**
   * Validate command arguments if we need to.
   *
   * @returns {Boolean}
   *   Returns true if the arguments are valid. False otherwise.
   */
  async validateCommandArguments() {

    // Run the parent one first.
    let defaults = await super.validateCommandArguments();
    if (!defaults) {
      return false;
    }

    // We'll merge the options and flags together for easier comparisons.
    let configOptions = this.commandConfig.options || [];
    let configFlags = this.commandConfig.flags || [];
    let configArgs = [...configOptions, ...configFlags];

    // If args is empty, we don't have any validations to do.
    if (Lavenza.isEmpty(configArgs)) {
      return true;
    }

    // If any arguments were given, we'll validate them here.
    let validations = await Promise.all(Object.keys(this.order.args).map(async arg => {

      if (arg === '_') {
        return;
      }

      // Attempt to find the argument in the configurations.
      let argConfig = configArgs.find(configArg => configArg.key === arg);

      if (Lavenza.isEmpty(argConfig)) {
        await Lavenza.throw(`{{arg}} is not a valid argument for this command.`, {arg: arg});
      }

      // Validate level 1. Operators.
      if (argConfig['oplevel'] === 1 && !this.operatorsToValidate.includes(this.author.username)) {
        await Lavenza.throw(`You do not have the necessary permissions to use the {{arg}} argument. Sorry. :( You may want to talk to Aiga about getting permission!`, {arg: argConfig.key});
      }

      // Validate level 2. Masters.
      if (argConfig['oplevel'] === 2 && !this.mastersToValidate.includes(this.author.username)) {
        await Lavenza.throw(`You do not have the necessary permissions to use the {{arg}} argument. Sorry. :( You may want to talk to Aiga about getting permission!`, {arg: argConfig.key});
      }

      // Validate level 3. Deities.
      if (argConfig['oplevel'] === 3 && !this.deities.includes(this.author.username)) {
        await Lavenza.throw(`You do not have the necessary permissions to use the {{arg}} argument. Sorry. :( You may want to talk to Aiga about getting permission!`, {arg: argConfig.key});
      }

      return true;

    })).catch(error => {
      return false;
    });

    // Get out if it failed.
    if (!validations) {
      return false;
    }

    // If all checks pass, we can return true.
    return true;
  }

  /**
   * Validates whether or not the command is activated.
   *
   * It also checks whitelisting capabilities.
   *
   * @TODO - Refactor this whole deal.
   *
   * @returns {Boolean}
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  validateActivation() {
    if (this.commandConfig.active === undefined || this.commandConfig.active) {
      return true;
    }

    if (!this.commandConfig.active) {
      return this.commandClientConfig.authorization['whitelist'].channels.includes(this.channel)
        || this.commandClientConfig.authorization['whitelist'].users.includes(this.authorUser.id)
    }
  }

  /**
   * Validates that the user has the appropriate operation access rights needed.
   *
   * @returns {Boolean}
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  validateOpLevel() {

    if (this.commandClientConfig.authorization['oplevel'] === 0) {
      return true;
    }

    if (this.commandClientConfig.authorization['oplevel'] === 1 && !this.operatorsToValidate.includes(this.author.username)) {
      return false;
    }

    if (this.commandClientConfig.authorization['oplevel'] === 2 && !this.mastersToValidate.includes(this.author.username)) {
      return false;
    }

    return !(this.commandClientConfig.authorization['oplevel'] === 3 && !this.deities.includes(this.author.username));

  }

  /**
   * Validate that the user is not blacklisted.
   *
   * @returns {Boolean}
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  validateUser() {
    if (Lavenza.isEmpty(this.commandClientConfig.authorization['blacklist'].users)) {
      return true;
    }

    return !this.commandClientConfig.authorization['blacklist'].users.includes(this.author.username);
  }

  /**
   * If the resonance was received from a DM, we check if this command can be used in DMs.
   *
   * @returns {Boolean}
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  validatePMCommand() {
    return !(this.channel.type === "whisper" && !this.commandClientConfig.authorization['pms']);
  }

  /**
   * Validates that the command can be used in the Discord Channel where it was invoked.
   *
   * @returns {*}
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  validateChannel() {
    if (Lavenza.isEmpty(this.commandClientConfig.authorization['blacklist'].channels)) {
      return true;
    }

    return this.commandClientConfig.authorization['blacklist'].channels.includes(this.channel);
  }

}