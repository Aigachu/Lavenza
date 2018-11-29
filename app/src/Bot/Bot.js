/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import ClientFactory from './Client/ClientFactory';
import TalentManager from '../Talent/TalentManager';
import CommandListener from './Command/CommandListener';
import ClientTypes from "./Client/ClientTypes";

/**
 * Provides a class for Bot objects
 */
export default class Bot {
  constructor(name, config) {
    this.name = name;
    this.directory = config.directory;
    this.config = config;
    this.clients = {};
    this.talents = {};
    this.commands = {};
    this.listeners = [];
  }

  async grantTalents() {
    this.talents.core = TalentManager.coreTalentList;

    if (Lavenza.isEmpty(this.config.talents)) {
      Lavenza.warn('NO_TALENT_CONFIG_FOUND_FOR_BOT', [this.name]);
      this.talents.all = TalentManager.coreTalentList;
    } else {
      await this.validateCustomTalents().catch(Lavenza.stop);
      this.talents.custom = this.config.talents;
      this.talents.all = [...TalentManager.coreTalentList, ...this.config.talents];
    }

    Lavenza.success('TALENTS_LOADED_FOR_BOT', [this.name]);
  }

  getCommand(commandKey) {
    return this.commands[commandKey];
  }

  async setCommands() {
    await Promise.all(this.talents.all.map(async talent => {
      this.commands = Object.assign({}, this.commands, TalentManager.talents.all[talent].commands);
    })).catch(Lavenza.stop);
    Lavenza.success('COMMANDS_SET_FOR_BOT', [this.name]);
  }

  async setListeners() {
    this.listeners.push(CommandListener);
    await Promise.all(this.talents.all.map(async talentKey => {
      this.listeners = [...this.listeners, ...TalentManager.talents.all[talentKey].listeners]
    })).catch(Lavenza.stop);
    Lavenza.success('LISTENERS_SET_FOR_BOT', [this.name]);
  }

  async validateCustomTalents() {
    await Promise.all(this.config.talents.map(async (talentKey) => {
      if (!Lavenza.isEmpty(TalentManager.talents.custom[talentKey])) {
        return;
      }

      let pathToTalent = Lavenza.Paths.TALENTS.CUSTOM + '/' + talentKey;
      let talent = await TalentManager.loadTalent(pathToTalent).catch(Lavenza.continue);

      if (Lavenza.isEmpty(talent)) {
        this.config.talents = Lavenza.removeFromArray(this.config.talents, talentKey);
        Lavenza.warn('CUSTOM_TALENT_NOT_FOUND', [talentKey]);
      }
    })).catch(Lavenza.stop);
  }

  async listen(message, client) {
    // First we decipher the message we just obtained.
    let content = await this.constructor.decipher(message, client).catch(Lavenza.continue);

    // Fire all of the bot's listeners.
    this.listeners.every(listener => {
      listener.listen(content, message, this, client);
      return true;
    });
  }

  static async decipher(message, client) {
    switch (client.type) {
      case ClientTypes.Discord:
        return message.content;

      // case ClientTypes.Twitch:
      //   return message;

      // case ClientTypes.Slack:
      //   return message;
    }
  }

  async deploy() {
    await this.authenticateClients().catch(Lavenza.stop);
  }

  async prepare() {
    await this.initializeClients().catch(Lavenza.stop);

    await this.grantTalents().catch(Lavenza.stop);

    await this.setCommands().catch(Lavenza.stop);

    await this.setListeners().catch(Lavenza.stop);

  }

  async authenticateClients() {
    let clientKeys = Object.keys(this.clients);
    await Promise.all(clientKeys.map(async key => {
      await this.clients[key].authenticate().catch(Lavenza.continue);
    })).catch(Lavenza.continue);
    Lavenza.success('CLIENTS_AUTHENTICATED_FOR_BOT', [this.name]);
  }

  async initializeClients() {
    let clientKeys = Object.keys(this.config.clients);
    await Promise.all(clientKeys.map(key => {
      this.clients[key] = ClientFactory.build(key, this.config.clients[key], this);
    })).catch(Lavenza.stop);
    Lavenza.success('CLIENTS_INITIALIZED_FOR_BOT', [this.name]);
  }
}
