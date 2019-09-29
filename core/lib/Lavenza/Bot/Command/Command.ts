/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from "path";

// Imports.
import { Akechi } from "../../Confidant/Akechi";
import { Igor } from "../../Confidant/Igor";
import { Morgana } from "../../Confidant/Morgana";
import { Sojiro } from "../../Confidant/Sojiro";
import { Gestalt } from "../../Gestalt/Gestalt";
import { Talent } from "../../Talent/Talent";
import { AbstractObject } from "../../Types";
import { Bot } from "../Bot";
import { CommandClientConfig } from "../Client/ClientConfigurations";
import { ClientType } from "../Client/ClientType";
import { Resonance } from "../Resonance/Resonance";

import { CommandConfigurations, CommandParameterConfig } from "./CommandConfigurations";

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
export abstract class Command {

  /**
   * The ID of the command.
   */
  public id: string;


  /**
   * The key of the command.
   */
  public key: string;

  /**
   * The path to the directory where this command's file is located.
   */
  public directory: string;

  /**
   * The configuration of the command.
   */
  public config: CommandConfigurations;

  /**
   * The Talent that declared this Command and manages it.
   */
  protected talent: Talent;

  /**
   * Command constructor.
   *
   * @param id
   *   The ID of the command. This will be the name of the Command's directory in lowercase.
   * @param key
   *   The key of the command.
   * @param directory
   *   The path to the directory where this command was found.
   */
  protected constructor(id: string, key: string, directory: string) {
    this.id = id;
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
  public async build(config: CommandConfigurations, talent: Talent): Promise<void> {
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
  public async getActiveConfigForBot(bot: Bot): Promise<CommandConfigurations> {
    return await Gestalt.get(`/bots/${bot.id}/commands/${this.id}/config`) as CommandConfigurations;
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
  public async getActiveClientConfig(clientType: ClientType, bot: Bot): Promise<CommandClientConfig> {
    // Attempt to get the active configuration from the database.
    const activeConfig = await Gestalt.get(`/bots/${bot.id}/commands/${this.id}/${clientType}`) as CommandClientConfig;
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    const config = await this.getClientConfig(clientType);

    // Sync it to the database.
    await Gestalt.sync(config, `/bots/${bot.id}/commands/${this.id}/${clientType}`);

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
  public async getClientConfig(clientType: ClientType): Promise<CommandClientConfig> {
    // Determine path to client configuration.
    const pathToClientConfig = `${this.directory}/${clientType}.yml`;

    // Attempt to fetch client configuration.
    if (!await Akechi.fileExists(pathToClientConfig)) {
      return undefined;
    }

    // Load configuration since it exists.
    return await Akechi.readYamlFile(pathToClientConfig) as CommandClientConfig;
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
  public async getActiveParameterConfig(bot: Bot): Promise<CommandParameterConfig> {
    // Attempt to get the active configuration from the database.
    const activeConfig = await Gestalt.get(`/bots/${bot.id}/commands/${this.id}/parameters`) as CommandParameterConfig;
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    const config = await this.getParameterConfig();

    // Sync it to the database.
    await Gestalt.sync(config, `/bots/${bot.id}/commands/${this.id}/parameters`);

    // Return the configuration.
    return config;
  }

  /**
   * Retrieve parameter configuration for this command.
   *
   * @returns
   *   The parameter configuration obtained from the core files.
   */
  public async getParameterConfig(): Promise<CommandParameterConfig> {
    // Determine path to client configuration.
    const pathToParameterConfig = `${this.directory}/parameters.yml`;

    // Attempt to fetch client configuration.
    if (!await Akechi.fileExists(pathToParameterConfig)) {
      return {} as unknown as CommandParameterConfig;
    }

    // Load configuration since it exists.
    const config = await Akechi.readYamlFile(pathToParameterConfig) as CommandParameterConfig;

    return Sojiro.isEmpty(config) ? {} as unknown as CommandParameterConfig : config;
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
  public abstract async execute(resonance: Resonance): Promise<void>;

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
  public async fireClientHandlers(
    resonance: Resonance,
    data: AbstractObject | string,
    method: string = "execute",
  ): Promise<unknown> {
    // Set variables that we will use.
    let methodToRun = method;
    let dataToUse = data;

    // If the second provided parameter is a string, this means it's the method we want to run, and data is null.
    if (typeof data === "string") {
      methodToRun = data;
      dataToUse = {};
    }

    // If data is not set, set it to an empty object.
    if (dataToUse === undefined) { dataToUse = {}; }

    // Define variable for client task handler.
    let handlerClass;

    // Define path to Handler.
    const pathToHandler = `${this.directory}/handlers/${resonance.client.type}/Handler`;

    // Try to fetch a handler for this client.
    try {
      // Automatically require the handler we want.
      handlerClass = await import(pathToHandler);
    } catch (error) {
      // Log a message.
      await Morgana.warn("Command handler for {{client}} could not be loaded for the {{command}} command. If you are using the handlers() function, make sure client handlers exist for each client this command is usable in.");

      // Log the error that occurred.
      await Morgana.warn(error.message);

      // Return.
      return;
    }

    // Now we can instantiate the Handler.
    const handler = new handlerClass[path.basename(pathToHandler, ".js")](this, resonance, pathToHandler);

    // If the method set doesn't exist, we throw an error here.
    if (Sojiro.isEmpty(handler[methodToRun])) {
      await Igor.throw("The {{method}} method does not exist in the {{client}} handler for your {{command}} command. Please verify your handler code!");
    }

    // Then we can execute the tasks in the Handler.
    return handler[methodToRun](dataToUse);
  }

  /**
   * Provides help text for the current command.
   *
   * You can access the bot through the resonance, as well as any of the bot's clients.
   *
   * @param resonance
   *   Resonance that invoked this command. All information about the client and message are here.
   */
  public async help(resonance: Resonance): Promise<void> {
    // Fire the client's help handler.
    await resonance.client.help(this, resonance);
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
  public async allowedInClient(clientType: ClientType): Promise<boolean> {
    const allowedForTalent =
      !Sojiro.isEmpty(this.talent.config.clients)
      && this.talent.config.clients !== "*"
      && (this.talent.config.clients.includes(clientType)
      || this.talent.config.clients === clientType)
    || (Sojiro.isEmpty(this.talent.config.clients)
      || this.talent.config.clients === "*");

    const allowedForCommand =
      !Sojiro.isEmpty(this.config.clients)
      && this.config.clients !== "*"
      && (this.config.clients.includes(clientType)
      || this.config.clients === clientType)
    || (Sojiro.isEmpty(this.config.clients)
      || this.config.clients === "*");

    return allowedForTalent && allowedForCommand;
  }

}
