/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import CommandAuthorizer from "./CommandAuthorizer";

/**
 * Provides an Authorizer for commands.
 *
 * This class will handle the authorization of an already determined order.
 */
export default class DiscordCommandAuthorizer extends CommandAuthorizer {

  async build() {
    await super.build().catch(Lavenza.stop);
    this.botUser = this.resonance.client.user;
    this.authorUser = this.resonance.message.author;
    this.msg = this.resonance.message;
    this.guild = this.resonance.message.guild;
    this.channel = this.resonance.message.channel;
  }

  async authorize() {

    // If the configuration is empty, we have no checks to make.
    if (Lavenza.isEmpty(this.commandClientConfig)) {
      Lavenza.warn('No configuration was found for this command...Is this normal?');
      return true;
    }

    if (this.resonance.message.author.bot === true) {
      return false;
    }

    if (!this.validateActivation()) {
      Lavenza.warn('activation validation failed');
      return false;
    }

    // Check if user is allowed to use this command.
    if (!this.validateUser()) {
      Lavenza.warn('user validation failed');
      return false;
    }

    if (!this.validateOpLevel()) {
      Lavenza.warn('oplevel validation failed');
      return false;
    }

    if (!this.validatePMCommand()) {
      Lavenza.warn('pm channel validation failed');
      return false;
    }

    if (!this.validateGuild()) {
      Lavenza.warn('guild validation failed');
      return false;
    }

    if (!this.validateChannel()) {
      Lavenza.warn('channel validation failed');
      return false;
    }

    return true;
  }

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

  validateUser() {
    if (Lavenza.isEmpty(this.commandClientConfig.authorization.blacklist.users)) {
      return true;
    }

    return this.commandClientConfig.authorization.blacklist.users.includes(this.authorUser.id);
  }

  validateOpLevel() {

    if (this.commandClientConfig.authorization.oplevel === 0) {
      return true;
    }

    if (this.commandClientConfig.authorization.oplevel === 1 && (!this.operators.includes(this.authorUser.id) && !this.masters.includes(this.authorUser.id))) {
      return false;
    }

    if (this.commandClientConfig.authorization.oplevel === 2 && !this.masters.includes(this.authorUser.id)) {
      return false;
    }


    return true;
  }

  validatePMCommand() {
    return !(this.msg.channel.type === "dm" && !this.commandClientConfig.authorization.pms);
  }

  validateGuild() {
    if (this.msg.channel.type === "dm") {
      return true;
    }

    if (Lavenza.isEmpty(this.commandClientConfig.authorization.blacklist.guilds)) {
      return true;
    }

    return this.commandClientConfig.authorization.blacklist.guilds.includes(this.guild.id);
  }

  validateChannel() {
    if (Lavenza.isEmpty(this.commandClientConfig.authorization.blacklist.channels)) {
      return true;
    }

    return this.commandClientConfig.authorization.blacklist.channels.includes(this.channel.id);
  }
}