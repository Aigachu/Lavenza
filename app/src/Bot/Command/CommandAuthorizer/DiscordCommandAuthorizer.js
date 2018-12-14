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
export default class DiscordCommandAuthorizer extends CommandAuthorizer {

  /**
   * Since authorizers are static classes, we'll have a build function to make preparations.
   *
   * @returns {Promise<void>}
   */
  async build() {
    this.botUser = this.resonance.client.user;
    this.authorUser = this.resonance.message.author;
    this.msg = this.resonance.message;
    this.guild = this.resonance.message.guild;
    this.channel = this.resonance.message.channel;
    this.clientConfig = await Lavenza.Gestalt.get(`/bots/${this.bot.name}/clients/discord`).catch(Lavenza.stop);
    this.operatorsToValidate = [...this.operators, ...this.masters, ...this.gods, ...this.clientConfig.guilds[this.guild.id].operators, ...this.clientConfig.guilds[this.guild.id].masters];
    this.mastersToValidate = [...this.masters, ...this.clientConfig.guilds[this.guild.id].masters, ...this.gods];
  }

  /**
   * The authority function. This function will return TRUE if the order is authorized, and FALSE otherwise.
   *
   * Discord specific checks are performed here.
   *
   * @returns {Promise<boolean>}
   */
  async authorize() {

    // First, we run through the default authorization function.
    let defaultAuth = await super.authorize().catch(Lavenza.stop);
    if (!defaultAuth) {
      return false;
    }

    // If the configuration is empty, we have no checks to make.
    if (Lavenza.isEmpty(this.commandClientConfig)) {
      Lavenza.warn('No configuration was found for this command...Is this normal?...');
      return true;
    }

    // We deny commands invoked by any other bot. Let's not mess shit up.
    if (this.resonance.message.author.bot === true) {
      return false;
    }

    // Check if the command is activated.
    if (!this.validateActivation()) {
      Lavenza.warn('activation validation failed');
      return false;
    }

    // Check if user is allowed to use this command.
    if (!this.validateUser()) {
      Lavenza.warn('user validation failed');
      return false;
    }

    // Check if the user has appropriate operation access rights.
    if (!this.validateOpLevel()) {

      this.resonance.client.sendError(this.resonance.message.channel, {
        text: 'You are not authorized to use this command.',
        code: 401
      }).then(async message => {
        this.resonance.message.delete();
        await Lavenza.wait(10).catch(Lavenza.stop);
        message.delete().catch(Lavenza.continue);
      });

      Lavenza.warn('oplevel validation failed');
      return false;
    }

    // Check if this command is allowed to be used in DMs.
    // No, don't worry. It will only really apply if the command is called in a DM.
    if (!this.validatePMCommand()) {
      Lavenza.warn('pm channel validation failed');
      return false;
    }

    // Validate that the command is allowed to be used in this Guild (Server).
    if (!this.validateGuild()) {
      Lavenza.warn('guild validation failed');
      return false;
    }

    // Validate that the command is allowed to be used in this Channel.
    if (!this.validateChannel()) {
      Lavenza.warn('channel validation failed');
      return false;
    }

    // If all those checks pass through, we can authorize the command.
    return true;
  }

  /**
   * Validate command arguments if we need to.
   *
   * @returns {Boolean}
   */
  async validateCommandArguments() {

    // Run the parent one first.
    let defaults = await super.validateCommandArguments().catch(Lavenza.stop);
    if (!defaults) {
      return false;
    }

    // If any arguments were given, we'll validate them here.
    let validations = await Promise.all(Object.keys(this.order.args).map(async arg => {

      if (arg === '_') {
        return;
      }

      if (Lavenza.isEmpty(this.commandConfig.options.find(option => option.key === arg)) && Lavenza.isEmpty(this.commandConfig.flags.find(flag => flag.key === arg))) {
        Lavenza.throw(`\`${arg}\` is not a valid argument for this command.`);
      }

      let argConfig = this.commandConfig.options.find(option => option.key === arg) || this.commandConfig.flags.find(flag => flag.key === arg);

      if (argConfig.oplevel === 1 && !this.operatorsToValidate.includes(this.authorUser.id)) {
        Lavenza.throw(`You do not have the necessary permissions to use the ${argConfig.key} argument. Sorry. :( You may want to talk to Aiga about getting permission!`);
      }

      if (argConfig.oplevel === 2 && !this.mastersToValidate.includes(this.authorUser.id)) {
        Lavenza.throw(`You do not have the necessary permissions to use the ${argConfig.key} argument. Sorry. :( You may want to talk to Aiga about getting permission!`);
      }

      if (argConfig.oplevel === 3 && !this.gods.includes(this.authorUser.id)) {
        Lavenza.throw(`You do not have the necessary permissions to use the ${argConfig.key} argument. Sorry. :( You may want to talk to Aiga about getting permission!`);
      }

      return true;

    })).catch(error => {
      this.resonance.message.channel.send(error.message);
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
      return this.commandClientConfig.authorization.whitelist.guilds.includes(this.guild.id)
        || this.commandClientConfig.authorization.whitelist.channels.includes(this.channel.id)
        || this.commandClientConfig.authorization.whitelist.users.includes(this.authorUser.id)
    }
  }

  /**
   * Validate that the user is not blacklisted.
   *
   * @returns {Boolean}
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  validateUser() {
    if (Lavenza.isEmpty(this.commandClientConfig.authorization.blacklist.users)) {
      return true;
    }

    return this.commandClientConfig.authorization.blacklist.users.includes(this.authorUser.id);
  }

  /**
   * Validates that the user has the appropriate operation access rights needed.
   *
   * @returns {Boolean}
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  validateOpLevel() {

    if (this.commandClientConfig.authorization.oplevel === 0) {
      return true;
    }

    if (this.commandClientConfig.authorization.oplevel === 1 && !this.operatorsToValidate.includes(this.authorUser.id)) {
      return false;
    }

    if (this.commandClientConfig.authorization.oplevel === 2 && !this.mastersToValidate.includes(this.authorUser.id)) {
      return false;
    }

    if (this.commandClientConfig.authorization.oplevel === 3 && !this.gods.includes(this.authorUser.id)) {
      return false;
    }


    return true;
  }

  /**
   * If the resonance was received from a DM, we check if this command can be used in DMs.
   *
   * @returns {Boolean}
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  validatePMCommand() {
    return !(this.msg.channel.type === "dm" && !this.commandClientConfig.authorization.pms);
  }

  /**
   * Validates that the command can be used in the Discord Guild (Server) where it was invoked.
   *
   * @returns {*}
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  validateGuild() {
    if (this.msg.channel.type === "dm") {
      return true;
    }

    if (Lavenza.isEmpty(this.commandClientConfig.authorization.blacklist.guilds)) {
      return true;
    }

    return this.commandClientConfig.authorization.blacklist.guilds.includes(this.guild.id);
  }

  /**
   * Validates that the command can be used in the Discord Channel where it was invoked.
   *
   * @returns {*}
   *   TRUE if this authorization passes, FALSE otherwise.
   */
  validateChannel() {
    if (Lavenza.isEmpty(this.commandClientConfig.authorization.blacklist.channels)) {
      return true;
    }

    return this.commandClientConfig.authorization.blacklist.channels.includes(this.channel.id);
  }

}