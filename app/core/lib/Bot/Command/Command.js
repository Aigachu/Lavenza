/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

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
    this.directory = config.directory;
    this.id = config.id;

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
    return await Lavenza.Gestalt.get(`/bots/${bot.id}/commands/${this.config.key}/config`);
  }

  /**
   * Retrieve active client configuration for a specific client in a bot.
   *
   * @param {string} clientType
   *   The type of client configuration to return for the bot.
   * @param {Bot} bot
   *   Bot to get this configuration for.
   *
   * @returns {Promise<void>}
   *   The requested client.
   */
  static async getActiveClientConfig(clientType, bot) {

    // Attempt to get the active configuration from the database.
    let activeConfig = await Lavenza.Gestalt.get(`/bots/${bot.id}/commands/${this.id}/${clientType}`);
    if (!Lavenza.isEmpty(activeConfig)) {
      return activeConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    let config = await this.getClientConfig(clientType);

    // Sync it to the database.
    await Lavenza.Gestalt.sync(config, `/bots/${bot.id}/commands/${this.id}/${clientType}`);

    // Return the configuration.
    return config;

  }

  /**
   * Retrieve configuration for a specific client.
   *
   * @param {string} clientType
   *   The type of client configuration to return for the bot.
   *
   * @returns {Promise<Object>}
   *   The requested client configuration.
   */
  static async getClientConfig(clientType) {

    // Determine path to client configuration.
    let pathToClientConfig = `${this.directory}/${this.id}.${clientType}.yml`;

    // Attempt to fetch client configuration.
    if (!await Lavenza.Akechi.fileExists(pathToClientConfig)){
      return undefined;
    }

    // Load configuration since it exists.
    return await Lavenza.Akechi.readYamlFile(pathToClientConfig);

  }

  /**
   * Retrieve active parameter configuration for the command in a specific bot
   *
   * @param {Bot} bot
   *   Bot to get this configuration for.
   *
   * @returns {Promise<Object>}
   *   The requested client.
   */
  static async getActiveParameterConfig(bot) {

    // Attempt to get the active configuration from the database.
    let activeConfig = await Lavenza.Gestalt.get(`/bots/${bot.id}/commands/${this.id}/parameters`);
    if (!Lavenza.isEmpty(activeConfig)) {
      return activeConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    let config = await this.getParameterConfig();

    // Sync it to the database.
    await Lavenza.Gestalt.sync(config, `/bots/${bot.id}/commands/${this.id}/parameters`);

    // Return the configuration.
    return config;

  }

  /**
   * Retrieve parameter configuration for this command.
   *
   * @returns {Promise<Object>}
   *   The configuration.
   */
  static async getParameterConfig() {

    // Determine path to client configuration.
    let pathToParameterConfig = `${this.directory}/${this.id}.parameters.yml`;

    // Attempt to fetch client configuration.
    if (!await Lavenza.Akechi.fileExists(pathToParameterConfig)){
      return {};
    }

    // Load configuration since it exists.
    let config = await Lavenza.Akechi.readYamlFile(pathToParameterConfig);
    return Lavenza.isEmpty(config) ? {} : config;
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
   * @param {Resonance} resonance
   *   Resonance that invoked this command. All information about the client and message are here.
   */
  static async execute(resonance) {

    // Default execute function. Does nothing right now.
    await Lavenza.warn(`You should probably add an execute function to this command!`);
    console.log(resonance);

  }

  /**
   * Execute client specific tasks if needed.
   *
   * Some commands are available in all clients, and as such need to be able to do different tasks depending on the
   * client they are invoked in. This function fires any custom client handlers that are defined.
   *
   * @param {Resonance} resonance
   *   The original resonance that invoked the command.
   * @param {Object} data
   *   Any custom data that should be used.
   * @param {String} method
   *   The method to run on the handler. By default, it will run the execute method in the handler class.
   * @returns {Promise<void>}
   */
  static async handlers(resonance, data, method = 'execute') {

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
      await Lavenza.warn('Command handler for {{client}} could not be loaded for the {{command}} command. If you are using the handlers() function, make sure client handlers exist for each client this command is usable in.');

      // Log the error that occurred.
      await Lavenza.warn(error.message);

      // Return.
      return;
    }

    // Now we can instantiate the Handler.
    let Handler = new HandlerClass(this, resonance, pathToHandler);

    // If the method set doesn't exist, we throw an error here.
    if (Lavenza.isEmpty(Handler[method])) {
      await Lavenza.throw(`The {{method}} method does not exist in the {{client}} handler for your {{command}} command. Please verify your handler code!`);
    }

    // Then we can execute the tasks in the Handler.
    await Handler[method](data);

  }

  /**
   * Provides help text for the current command.
   *
   * You can access the bot through the resonance, as well as any of the bot's clients.
   *
   * @param {Resonance} resonance
   *   Resonance that invoked this command. All information about the client and message are here.
   */
  static async help(resonance) {

    // Get configuration.
    let config = await this.getActiveConfigForBot(resonance.bot);

    // Depending on the type of client, we want the help function to act differently.
    switch (resonance.client.type) {

      // If we're in Discord, we want to send a formatted rich embed.
      case Lavenza.ClientTypes.Discord: {

        // Start building the usage text by getting the command prefix.
        let usageText = `\`${await resonance.bot.getCommandPrefix(resonance)}${config.key}`;

        // If there is input defined for this command, we will add them to the help text.
        if (config.input) {
          config.input.requests.every(request => {
            usageText += ` {${request.replace(' ', '_').toLowerCase()}}\`\n`;
          });
        } else {
          usageText += `\`\n`;
        }

        // If there are aliases defined for this command, add all usage examples to the help text.
        if (config['aliases']) {
          let original = usageText;
          config['aliases'].every(alias => {
            usageText += original.replace(`${config.key}`, alias);
            return true;
          });
        }

        // Set the usage section.
        let fields = [
          {
            name: await Lavenza.__('Usage', resonance.locale),
            text: usageText
          }
        ];

        // If there are options defined for this command, we add a section for options.
        if (config.options) {
          let optionsList = '';
          await Promise.all(config.options.map(async option => {
            let description = await Lavenza.__(option.description, resonance.locale);
            let name = await Lavenza.__(option.name, resonance.locale);
            optionsList += `**${name}** \`-${option.key} {${option['expects'].replace(' ', '_').toLowerCase()}}\` - ${description}\n\n`;
          }));
          fields.push({
            name: await Lavenza.__('Options', resonance.locale),
            text: optionsList
          });
        }

        // If there are flags defi-...You get the idea.
        if (config.flags) {
          let flagsList = '';
          await Promise.all(config.flags.map(async flag => {
            let description = await Lavenza.__(flag.description, resonance.locale);
            let name = await Lavenza.__(flag.name, resonance.locale);
            flagsList += `**${name}** \`-${flag.key}\` - ${description}\n\n`;
          }));
          fields.push({
            name: await Lavenza.__('Flags', resonance.locale),
            text: flagsList
          });
        }

        // Finally, send the embed.
        await resonance.client.sendEmbed(resonance.message.channel, {
          title: await Lavenza.__(`${config.name}`, resonance.locale),
          description: await Lavenza.__(`${config.description}`, resonance.locale),
          header: {
            text: await Lavenza.__('{{bot}} Guide', {bot: resonance.bot.config.name},resonance.locale),
            icon: resonance.client.user.avatarURL
          },
          fields: fields,
          thumbnail: resonance.client.user.avatarURL
        });
        break;
      }

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
      this.talent['config'].clients !== {} && this.talent['config'].clients !== '*' && (this.talent['config'].clients.includes(clientType) || this.talent['config'].clients === clientType)
    || (this.talent['config'].clients === {} || this.talent['config'].clients === '*');

    let allowedForCommand =
      this.config.clients !== {} && this.config.clients !== '*' && (this.config.clients.includes(clientType) || this.config.clients === clientType)
    || (this.config.clients === {} || this.config.clients === '*');

    return allowedForTalent && allowedForCommand;
  }
}
