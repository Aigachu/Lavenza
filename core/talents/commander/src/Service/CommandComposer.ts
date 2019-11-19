/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../../../../lib/Lavenza/Bot/Bot";
import { BotCatalogue } from "../../../../lib/Lavenza/Bot/BotCatalogue";
import { ClientType } from "../../../../lib/Lavenza/Client/ClientType";
import { Akechi } from "../../../../lib/Lavenza/Confidant/Akechi";
import { Sojiro } from "../../../../lib/Lavenza/Confidant/Sojiro";
import { Composer } from "../../../../lib/Lavenza/Gestalt/Composer/Composer";
import { ServiceContainer } from "../../../../lib/Lavenza/Service/ServiceContainer";
import { Command } from "../Command/Command";
import { CommandClientConfig, CommandConfigurations, CommandParameterConfig } from "../Command/CommandConfigurations";

import { CommandCatalogue } from "./CommandCatalogue";

/**
 * Provides a main composer for the Gestalt main service.
 */
export class CommandComposer extends Composer {

  /**
   * The priority of the Resonator. This determines the order in which Resonators will resonate.
   */
  public priority: number = 4500;

  /**
   * Each composer service must implement this function to determine what to do when the Manager calls them.
   *
   * Composers are made to do database bootstrapping during runtime.
   */
  public async compose(): Promise<void> {
    // Run Gestalt handlers for each Bot.
    for (const bot of await ServiceContainer.get(BotCatalogue).all()) {
      // Create a database collection for Commands belonging to a Bot.
      await this.gestaltService.createCollection(`/bots/${bot.id}/commands`);

      // Await the bootstrapping of Commands data.
      const botCommands = await ServiceContainer.get(CommandCatalogue).getCommandsForEntity(bot);
      for (const command of botCommands) {
        // Create a database collection for commands belonging to a Bot.
        await this.gestaltService.createCollection(`/bots/${bot.id}/commands/${command.id}`);

        // Synchronization of data between the Command's default configuration and the database configuration.
        await this.gestaltService.sync(command.config, `/bots/${bot.id}/commands/${command.id}/config`);
      }
    }
  }

  /**
   * Get the active configuration from the database for this command, in the context of a Bot.
   *
   * @param command
   *   Command we want to get configurations for.
   * @param bot
   *   The bot context for the configuration we want to fetch. Each bot can have different configuration overrides
   *   for talents.
   *
   * @returns
   *   Returns the configuration fetched from the database.
   */
  public async getActiveCommandConfigForBot(command: Command, bot: Bot): Promise<CommandConfigurations> {
    return await this.gestaltService.get(`/bots/${bot.id}/commands/${command.id}/config`) as CommandConfigurations;
  }

  /**
   * Retrieve active client configuration for a specific client in a bot.
   *
   * "Active" configuration refers to the configuration found in the database.
   *
   * @param command
   *   Command we want to get configurations for.
   * @param clientType
   *   The type of client configuration to return for the bot.
   * @param bot
   *   Bot to get this configuration for.
   *
   * @returns
   *   The requested client configuration.
   */
  public async getActiveCommandClientConfigForBot(command: Command, clientType: ClientType, bot: Bot): Promise<CommandClientConfig> {
    // Attempt to get the active configuration from the database.
    const activeConfig = await this.gestaltService.get(`/bots/${bot.id}/commands/${command.id}/${clientType}`) as CommandClientConfig;
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    const config = await this.getCommandClientConfig(command, clientType);

    // Sync it to the database.
    await this.gestaltService.sync(config, `/bots/${bot.id}/commands/${command.id}/${clientType}`);

    // Return the configuration.
    return config;
  }

  /**
   * Retrieve configuration for a specific client.
   *
   * @param command
   *   Command we want to get configurations for.
   * @param clientType
   *   The type of client configuration to return for the bot.
   *
   * @returns
   *   The requested client configuration.
   */
  public async getCommandClientConfig(command: Command, clientType: ClientType): Promise<CommandClientConfig> {
    // Determine path to client configuration.
    const pathToClientConfig = `${command.directory}/clients/${clientType}.yml`;

    // Attempt to fetch client configuration.
    if (!await Akechi.fileExists(pathToClientConfig)) {
      return undefined;
    }

    // Load configuration since it exists.
    return await Akechi.readYamlFile(pathToClientConfig) as CommandClientConfig;
  }

  /**
   * Retrieve active parameter configuration for a command in a specific bot.
   *
   * "Active" configuration refers to the configuration found in the database.
   *
   * @param bot
   *   Bot to get this configuration for.
   * @param command
   *   Command we want to get configurations for.
   *
   * @returns
   *   The requested parameter configuration for the given bot obtained frm the database.
   */
  public async getActiveParameterConfigForBot(command: Command, bot: Bot): Promise<CommandParameterConfig> {
    // Attempt to get the active configuration from the database.
    const activeConfig = await this.gestaltService.get(`/bots/${bot.id}/commands/${command.id}/parameters`) as CommandParameterConfig;
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    const config = await this.getCommandParameterConfig(command);

    // Sync it to the database.
    await this.gestaltService.sync(config, `/bots/${bot.id}/commands/${command.id}/parameters`);

    // Return the configuration.
    return config;
  }

  /**
   * Retrieve parameter configuration for a command.
   *
   * @param command
   *   Command we want to get configurations for.
   *
   * @returns
   *   The parameter configuration obtained from the core files.
   */
  public async getCommandParameterConfig(command: Command): Promise<CommandParameterConfig> {
    // Determine path to client configuration.
    const pathToParameterConfig = `${command.directory}/parameters.yml`;

    // Attempt to fetch client configuration.
    if (!await Akechi.fileExists(pathToParameterConfig)) {
      return {} as unknown as CommandParameterConfig;
    }

    // Load configuration since it exists.
    const config = await Akechi.readYamlFile(pathToParameterConfig) as CommandParameterConfig;

    return Sojiro.isEmpty(config) ? {} as unknown as CommandParameterConfig : config;
  }

}


