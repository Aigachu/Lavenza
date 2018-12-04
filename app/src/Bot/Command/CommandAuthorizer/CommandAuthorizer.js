/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

/**
 * Provides an Authorizer for commands.
 *
 * This class will handle the authorization of an already determined order.
 */
export default class CommandAuthorizer {

  constructor(order, resonance) {
    this.order = order;
    this.resonance = resonance;
    this.bot = this.resonance.bot;
    this.type = resonance.client.type;
    this.masters = this.bot.config.clients[this.type].masters;
    this.operators = this.bot.config.clients[this.type].operators;
  }

  async build() {
    await this.setCommandClientConfig().catch(Lavenza.stop);
    this.cooldowns = this.commandClientConfig.cooldown || this.commandConfig.cooldown;
  }

  setCooldown() {
    // Cools the command globally after usage.
    if (this.cooldowns.global !== 0) Lavenza.Makoto.set('command', this.order.command.config.key, 0, this.cooldowns.global * 1000);

    // Cools the command after usage for the user.
    if (this.cooldowns.user !== 0) Lavenza.Makoto.set('command', this.order.command.config.key, this.resonance.message.author, this.cooldowns.user * 1000);
  }

  cooldownIsActive() {
    // Using the cooldown manager, we check if the command is on cooldown first.
    // Cooldowns are individual per user. So if a user uses a command, it's not on cooldown for everyone.
    if (Lavenza.Makoto.check('command', this.order.command.config.key, 0)) {
      this.resonance.message.reply(`That command is on global cooldown. :) Please wait!`);
      return true;
    }

    if (Lavenza.Makoto.check('command', this.order.command.config.key, this.resonance.message.author.id)) {
      this.resonance.message.reply(`That command is on cooldown. :) Please wait!`);
      return true;
    }

    return false
  }

  async setCommandClientConfig() {
    let commandConfig = await Lavenza.Gestalt.get(`/bots/${this.resonance.bot.name}/commands/${this.order.command.config.key}/config`).catch(Lavenza.stop);

    if (Lavenza.isEmpty(commandConfig)) {
      commandConfig = this.order.command.config;
    }

    this.commandConfig = commandConfig;
    this.commandClientConfig = this.commandConfig['clients.config'][this.type];
  }

}