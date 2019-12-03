/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from "path";

// Imports.
import { ClientType } from "../../../../lib/Lavenza/Client/ClientType";
import { Igor } from "../../../../lib/Lavenza/Confidant/Igor";
import { Morgana } from "../../../../lib/Lavenza/Confidant/Morgana";
import { Sojiro } from "../../../../lib/Lavenza/Confidant/Sojiro";
import { Resonance } from "../../../../lib/Lavenza/Resonance/Resonance";
import { Talent } from "../../../../lib/Lavenza/Talent/Talent";
import { AbstractObject } from "../../../../lib/Lavenza/Types";
import { Instruction } from "../Instruction/Instruction";

import { ClientUtilityFactory } from "./Client/ClientUtilityFactory";
import { CommandConfigurations } from "./CommandConfigurations";


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
   * The command's aliases.
   */
  public aliases: string[];

  /**
   * The Talent that declared this Command and manages it.
   * This property simply exists in case a user would like to assign a talent to their command.
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
   */
  public async build(config: CommandConfigurations): Promise<void> {
    this.config = config;
    this.directory = config.directory;
    this.key = config.key;
    this.aliases = config.aliases;
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
   * @param instruction
   *   Instruction that was built with this command.
   *   Contains information pertaining to command arguments, command prefix and more.
   * @param resonance
   *   Resonance that invoked this command.
   *   Contains information pertaining to the client that the command was invoked in, the bot that was invoked and more.
   */
  public abstract async execute(instruction: Instruction, resonance: Resonance): Promise<void>;

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
   * @param instruction
   *   Instruction that invoked this command. All information about the client and message are here.
   */
  public async help(instruction: Instruction): Promise<void> {
    // Obtain the appropriate help handler.
    const handler = await ClientUtilityFactory.buildCommandHelpHandler(instruction);

    // Fire the help handler.
    await handler.help(instruction);
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
    // Initialize variables for what we'll be checking.
    let allowedForTalent = true;
    let allowedForCommand = true;
    const clientTypeCapital = clientType.charAt(0).toUpperCase() + clientType.slice(1);

    // If a talent is set for this command and there are client configurations, we'll be adjusting the flag.
    if (this.talent && this.talent.config.clients && this.talent.config.clients !== "*") {
      // We adjust the flag if we need to.
      if (Array.isArray(this.talent.config.clients) && (!this.talent.config.clients.includes(clientType) && !this.talent.config.clients.includes(clientTypeCapital))) {
        allowedForTalent = false;
      }
      if (!Array.isArray(this.talent.config.clients) && this.talent.config.clients !== clientType) {
        allowedForTalent = false;
      }
    }

    // Now we do command checks.
    if (this.config.clients && this.config.clients !== "*") {
      // We adjust the flag if we need to.
      if (Array.isArray(this.config.clients) && (!this.config.clients.includes(clientType) && !this.config.clients.includes(clientTypeCapital))) {
        allowedForCommand = false;
      }
      if (!Array.isArray(this.talent.config.clients) && this.config.clients !== clientType) {
        allowedForCommand = false;
      }
    }

    return allowedForTalent && allowedForCommand;
  }

}
