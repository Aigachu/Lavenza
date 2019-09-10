/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

import Talent from "../../Talent/Talent";
import {CommandClientConfig, CommandConfigurations, CommandParameterConfig} from "./CommandConfigurations";
import Bot from "../Bot";
import ClientType from "../Client/ClientType";
import Gestalt from "../../Gestalt/Gestalt";
import Sojiro from "../../Confidant/Sojiro";
import Akechi from "../../Confidant/Akechi";
import Resonance from "../Resonance/Resonance";
import Morgana from "../../Confidant/Morgana";
import Igor from "../../Confidant/Igor";
import Yoshida from "../../Confidant/Yoshida";

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
export default abstract class Command {

  /**
   * The ID of the command.
   */
  public key: string;

  /**
   * The path to the directory where this command's file is located.
   */
  public directory: string;

  /**
   * The Talent that declared this Command and manages it.
   */
  public talent: Talent;

  /**
   * The configuration of the command.
   */
  public config: CommandConfigurations;

  /**
   * Command constructor.
   *
   * @param key
   *   The ID of the command. This will be the name of the Command's directory in lowercase.
   * @param directory
   *   The path to the directory where this command was found.
   */
  protected constructor(key: string, directory: string) {
    this.key = key;
    this.directory = directory;
  }

  /**
   * Perform build tasks.
   *
   * Since Commands will be singletons, there is no constructor. Each command will call this function once to set
   * their properties.
   *
   * @param config
   *   Configuration read from the command's '.config.yml' file in the command's directory.
   * @param talent
   *   Talent that this command is a child of.
   */
  async build(config: CommandConfigurations, talent: Talent) {
    this.talent = talent;
    this.config = config;
    this.directory = config.directory;
    this.key = config.key;
  }

  /**
   * Get the active configuration from the database for this Talent, in the context of a Bot.
   *
   * @param bot
   *   The bot context for the configuration we want to fetch. Each bot can have different configuration overrides
   *   for talents.
   *
   * @returns
   *   Returns the configuration fetched from the database.
   */
  async getActiveConfigForBot(bot: Bot): Promise<CommandConfigurations> {
    return await Gestalt.get(`/bots/${bot.id}/commands/${this.config.key}/config`);
  }

  /**
   * Retrieve active client configuration for a specific client in a bot.
   *
   * "Active" configuration refers to the configuration found in the database.
   *
   * @param clientType
   *   The type of client configuration to return for the bot.
   * @param bot
   *   Bot to get this configuration for.
   *
   * @returns
   *   The requested client configuration.
   */
  async getActiveClientConfig(clientType: ClientType, bot: Bot): Promise<CommandClientConfig> {
    // Attempt to get the active configuration from the database.
    let activeConfig = await Gestalt.get(`/bots/${bot.id}/commands/${this.key}/${clientType}`);
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    let config = await this.getClientConfig(clientType);

    // Sync it to the database.
    await Gestalt.sync(config, `/bots/${bot.id}/commands/${this.key}/${clientType}`);

    // Return the configuration.
    return config;
  }

  /**
   * Retrieve configuration for a specific client.
   *
   * @param clientType
   *   The type of client configuration to return for the bot.
   *
   * @returns
   *   The requested client configuration.
   */
  async getClientConfig(clientType: ClientType): Promise<CommandClientConfig> {
    // Determine path to client configuration.
    let pathToClientConfig = `${this.directory}/${clientType}.yml`;

    // Attempt to fetch client configuration.
    if (!await Akechi.fileExists(pathToClientConfig)){
      return undefined;
    }

    // Load configuration since it exists.
    return await Akechi.readYamlFile(pathToClientConfig);
  }

  /**
   * Retrieve active parameter configuration for the command in a specific bot
   *
   * "Active" configuration refers to the configuration found in the database.
   *
   * @param bot
   *   Bot to get this configuration for.
   *
   * @returns
   *   The requested parameter configuration for the given bot obtained frm the database.
   */
  async getActiveParameterConfig(bot: Bot): Promise<CommandParameterConfig> {
    // Attempt to get the active configuration from the database.
    let activeConfig = await Gestalt.get(`/bots/${bot.id}/commands/${this.key}/parameters`);
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    let config = await this.getParameterConfig();

    // Sync it to the database.
    await Gestalt.sync(config, `/bots/${bot.id}/commands/${this.key}/parameters`);

    // Return the configuration.
    return config;
  }

  /**
   * Retrieve parameter configuration for this command.
   *
   * @returns
   *   The parameter configuration obtained from the core files.
   */
  async getParameterConfig(): Promise<CommandParameterConfig> {
    // Determine path to client configuration.
    let pathToParameterConfig = `${this.directory}/parameters.yml`;

    // Attempt to fetch client configuration.
    if (!await Akechi.fileExists(pathToParameterConfig)){
      return {} as CommandParameterConfig;
    }

    // Load configuration since it exists.
    let config = await Akechi.readYamlFile(pathToParameterConfig);
    return Sojiro.isEmpty(config) ? {} as CommandParameterConfig : config;
  }

  /**
   * Executes command functionality.
   *
   * This is an abstract method.
   *
   * Everything needed to go wild with a command is in the two variables provided here.
   *
   * You can access the bot through the resonance, as well as any of the bot's clients.
   *
   * @param resonance
   *   Resonance that invoked this command. All information about the client and message are here.
   */
  abstract async execute(resonance: Resonance);

  /**
   * Execute client specific tasks if needed.
   *
   * Some commands are available in all clients, and as such need to be able to do different tasks depending on the
   * client they are invoked in. This function fires any custom client handlers that are defined.
   *
   * @param resonance
   *   The original resonance that invoked the command.
   * @param data
   *   Any custom data that should be used.
   * @param method
   *   The method to run on the handler. By default, it will run the execute method in the handler class.
   *
   * @returns
   *   Anything that should be returned by client handlers.
   */
  async fireClientHandlers(resonance: Resonance, data: any, method: string = 'execute') {
    // If the second provided parameter is a string, this means it's the method we want to run, and data is null.
    if (typeof data === 'string') {
      method = data;
      data = {};
    }

    // If data is not set, set it to an empty object.
    if (data === undefined) { data = {}; }

    // Define variable for client task handler.
    let HandlerClass = undefined;

    // Define path to Handler.
    let pathToHandler = `${this.directory}/handlers/${resonance.client.type}/Handler`;

    // Try to fetch a handler for this client.
    try {
      // Automatically require the handler we want.
      HandlerClass = require(pathToHandler).default;
    } catch (error) {
      // Log a message.
      await Morgana.warn('Command handler for {{client}} could not be loaded for the {{command}} command. If you are using the handlers() function, make sure client handlers exist for each client this command is usable in.');

      // Log the error that occurred.
      await Morgana.warn(error.message);

      // Return.
      return;
    }

    // Now we can instantiate the Handler.
    let Handler = new HandlerClass(this, resonance, pathToHandler);

    // If the method set doesn't exist, we throw an error here.
    if (Sojiro.isEmpty(Handler[method])) {
      await Igor.throw(`The {{method}} method does not exist in the {{client}} handler for your {{command}} command. Please verify your handler code!`);
    }

    // Then we can execute the tasks in the Handler.
    return await Handler[method](data);
  }

  /**
   * Provides help text for the current command.
   *
   * You can access the bot through the resonance, as well as any of the bot's clients.
   *
   * @param resonance
   *   Resonance that invoked this command. All information about the client and message are here.
   */
  async help(resonance) {

    // Get configuration.
    let config = await this.getActiveConfigForBot(resonance.bot);
    let parameterConfig = await this.getActiveParameterConfig(resonance.bot);

    // Depending on the type of client, we want the help function to act differently.
    switch (resonance.client.type) {
      // If we're in Discord, we want to send a formatted rich embed.
      case ClientType.Discord: {
        // Start building the usage text by getting the command prefix.
        let usageText = `\`${await resonance.bot.getCommandPrefix(resonance)}${config.key}`;

        // If there is input defined for this command, we will add them to the help text.
        if (parameterConfig.input) {
          parameterConfig.input.requests.every(request => {
            usageText += ` {${request.replace(' ', '_').toLowerCase()}}\`\n`;
          });
        } else {
          usageText += `\`\n`;
        }

        // If there are aliases defined for this command, add all usage examples to the help text.
        if (parameterConfig['aliases']) {
          let original = usageText;
          parameterConfig['aliases'].every(alias => {
            usageText += original.replace(`${config.key}`, alias);
            return true;
          });
        }

        // Set the usage section.
        let fields = [
          {
            name: await Yoshida.translate('Usage', resonance.locale),
            text: usageText
          }
        ];

        // If there are options defined for this command, we add a section for options.
        if (parameterConfig.options) {
          let optionsList = '';
          await Promise.all(parameterConfig.options.map(async option => {
            let description = await Yoshida.translate(option.description, resonance.locale);
            let name = await Yoshida.translate(option.name, resonance.locale);
            optionsList += `**${name}** \`-${option.key} {${option['expects'].replace(' ', '_').toLowerCase()}}\` - ${description}\n\n`;
          }));
          fields.push({
            name: await Yoshida.translate('Options', resonance.locale),
            text: optionsList
          });
        }

        // If there are flags defi-...You get the idea.
        if (parameterConfig.flags) {
          let flagsList = '';
          await Promise.all(parameterConfig.flags.map(async flag => {
            let description = await Yoshida.translate(flag.description, resonance.locale);
            let name = await Yoshida.translate(flag.name, resonance.locale);
            flagsList += `**${name}** \`-${flag.key}\` - ${description}\n\n`;
          }));
          fields.push({
            name: await Yoshida.translate('Flags', resonance.locale),
            text: flagsList
          });
        }

        // Finally, send the embed.
        await resonance.client.sendEmbed(resonance.message.channel, {
          title: await Yoshida.translate(`${config.name}`, resonance.locale),
          description: await Yoshida.translate(`${config.description}`, resonance.locale),
          header: {
            text: await Yoshida.translate('{{bot}} Guide', {bot: resonance.bot.config.name},resonance.locale),
            icon: resonance.client.user.avatarURL
          },
          fields: fields,
          thumbnail: resonance.client.user.avatarURL
        });
        break;
      }

      case ClientType.Twitch: {
        // @TODO - Implement this!
      }
    }
  }

  /**
   * Determines whether or not a command is allowed to be executed for a client.
   *
   * This is managed in a command's configuration file.
   *
   * @param clientType
   *   Client that we want to check for. i.e. 'discord'.
   *
   * @returns
   *   Returns true if the command is allowed to be executed in the client. Returns false otherwise.
   */
  allowedInClient(clientType: ClientType): boolean {
    let allowedForTalent =
      !Sojiro.isEmpty(this.talent.config.clients) && this.talent.config.clients !== '*' && (this.talent.config.clients.includes(clientType) || this.talent.config.clients === clientType)
    || (Sojiro.isEmpty(this.talent.config.clients) || this.talent.config.clients === '*');

    let allowedForCommand =
      !Sojiro.isEmpty(this.config.clients) && this.config.clients !== '*' && (this.config.clients.includes(clientType) || this.config.clients === clientType)
    || (Sojiro.isEmpty(this.config.clients) || this.config.clients === '*');

    return allowedForTalent && allowedForCommand;
  }

}
