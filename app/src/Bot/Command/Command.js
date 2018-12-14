/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

import ClientTypes from "../Client/ClientTypes";
import DiscordJS from "discord.js";

/**
 * Provides a base class for Commands.
 *
 * 'Commands' are directives you can give to a bot given you write the necessary format into a chat.
 *
 * Lavenza's design vision will allow commands to be created and configured for many clients, instead of
 * solely Discord. This also means that Commands from one client can do acts on another client. This will
 * be shown / described in this class.
 *
 * This class SHOULD have many helper functions to make this dream come true.
 */
export default class Command {

  /**
   * Perform build tasks.
   *
   * Since Commands will be singletons, there is no constructor. Each command will call this function once to set
   * their properties.
   *
   * @param {Object} config
   *   Configuration read from the command's '.config.yml' file in the command's directory.
   * @param {Talent|Lavenza.Talent} talent
   *   Talent that this command is a child of.
   *
   * @returns {Promise.<void>}
   */
  static async build(config, talent) {

    this.talent = talent;
    this.config = config;

  }

  /**
   * Get the active configuration from the database for this Talent, in the context of a Bot.
   *
   * @param {Bot} bot
   *   The bot context for the configuration we want to fetch. Each bot can have different configuration overrides
   *   for talents.
   *
   * @returns {Promise<Object>}
   *   Returns the configuration fetched from the database.
   */
  static async getActiveConfigForBot(bot) {
    return await Lavenza.Gestalt.get(`/bots/${bot.name}/commands/${this.config.key}/config`).catch(Lavenza.stop);
  }

  /**
   * Executes command functionality.
   *
   * Everything needed to go wild with a command is in the two variables provided here.
   *
   * You can access the bot through the resonance, as well as any of the bot's clients.
   *
   * @param {Order} order
   *   Order sent by the CommandInterpreter, including the command arguments and more information.
   * @param {Resonance} resonance
   *   Resonance that invoked this command. All information about the client and message are here.
   */
  static async execute(order, resonance) {
    // Default execute function. Does nothing.
    Lavenza.warn('You should probably add an execute function to this command!');
  }

  /**
   * Provides help text for the current command.
   *
   * You can access the bot through the resonance, as well as any of the bot's clients.
   *
   * @param {Order} order
   *   Order sent by the CommandInterpreter, including the command arguments and more information.
   * @param {Resonance} resonance
   *   Resonance that invoked this command. All information about the client and message are here.
   */
  static async help(order, resonance) {

    // Get configuration.
    let config = await this.getActiveConfigForBot(resonance.bot).catch(Lavenza.stop);

    switch (resonance.client.type) {
      case ClientTypes.Discord:
        let usageText = `\`${await resonance.bot.getCommandPrefix(resonance).catch(Lavenza.stop)}${config.key}`;

        if (config.input) {
          config.input.requests.every(request => {
            usageText += ` {${request.replace(' ', '_').toLowerCase()}}\`\n`;
          });
        } else {
          usageText += `\`\n`;
        }

        if (config.aliases) {
          let original = usageText;
          config.aliases.every(alias => {
            usageText += original.replace(`${config.key}`, alias);
            return true;
          });
        }

        let fields = [
          {
            name: 'Usage',
            text: usageText
          }
        ];

        if (config.options) {
          let optionsList = '';
          config.options.every(option => {
            optionsList += `**${option.name}** \`-${option.key} {${option.expects.replace(' ', '_').toLowerCase()}}\` - ${option.description}\n\n`;
            return true;
          });
          fields.push({
            name: 'Options',
            text: optionsList
          });
        }

        if (config.flags) {
          let flagsList = '';
          config.flags.every(flag => {
            flagsList += `**${flag.name}** \`-${flag.key}\` - ${flag.description}\n\n`;
            return true;
          });
          fields.push({
            name: 'Flags',
            text: flagsList
          });
        }

        await resonance.client.sendEmbed(resonance.message.channel, {
          title: `${config.name}`,
          description: `${config.description}`,
          header: {
            text: 'Lavenza Guide',
            icon: resonance.client.user.avatarURL
          },
          fields: fields,
          thumbnail: resonance.client.user.avatarURL
        }).catch(Lavenza.stop);
        break;

      default:
        return;
    }
  }

  /**
   * Determines whether or not a command is allowed to be executed for a client.
   *
   * This is managed in a command's configuration file.
   *
   * @param {string} clientType
   *   Client that we want to check for. i.e. 'discord'.
   *
   * @returns {boolean}
   *   Returns true if the command is allowed to be executed in the client. Returns false otherwise.
   */
  static allowedInClient(clientType) {
    let allowedForTalent =
      (this.talent.config.clients !== {} && this.talent.config.clients !== '*' && (this.talent.config.clients.includes(clientType) || this.talent.config.clients === clientType))
    || (this.talent.config.clients === {} || this.talent.config.clients === '*');

    let allowedForCommand =
      (this.config.clients !== {} && this.config.clients !== '*' && (this.config.clients.includes(clientType) || this.config.clients === clientType))
    || (this.config.clients === {} || this.config.clients === '*');

    return allowedForTalent && allowedForCommand;
  }
}
