/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../Bot/Bot";
import { BotCatalogue } from "../Bot/BotCatalogue";
import { BotConfigurations } from "../Bot/BotConfigurations";
import { Client } from "../Client/Client";
import { BotClientConfig, ClientConfigurations } from "../Client/ClientConfigurations";
import { ClientType } from "../Client/ClientType";
import { Sojiro } from "../Confidant/Sojiro";
import { ServiceContainer } from "../Service/ServiceContainer";
import { Talent } from "../Talent/Talent";
import { TalentCatalogue } from "../Talent/TalentCatalogue";
import { TalentConfigurations } from "../Talent/TalentConfigurations";

import { Composer } from "./Composer/Composer";

/**
 * Provides a main composer for the Gestalt main service.
 */
export class GestaltComposer extends Composer {

  /**
   * The priority of the Resonator. This determines the order in which Resonators will resonate.
   */
  public priority: number = 5000;

  /**
   * Each composer service must implement this function to determine what to do when the Manager calls them.
   *
   * Composers are made to do database bootstrapping during runtime.
   */
  public async compose(): Promise<void> {
    // @TODO - Run each service's Gestalt handler.
    // @TODO - We can do the same logic as the Plugin Seekers & Event Subscribers.

    // Creation of i18n collection.
    // All data pertaining to translations will be saved here.
    await this.gestaltService.createCollection("/i18n");

    // Creation of the Bots collection.
    await this.gestaltService.createCollection("/bots");

    // Run Gestalt handlers for each Bot.
    for (const bot of await ServiceContainer.get(BotCatalogue).all()) {
      // Initialize the database collection for this bot if it doesn't already exist.
      await this.gestaltService.createCollection(`/bots/${bot.id}`);

      // Initialize the database collection for this bot's configurations if it doesn't already exist.
      await this.gestaltService.createCollection(`/bots/${bot.id}/config`);

      // Sync core bot config to the database.
      await this.gestaltService.sync(bot.config, `/bots/${bot.id}/config/core`);

      // Initialize i18n database collection for this bot if it doesn't already exist.
      await this.gestaltService.createCollection(`/i18n/${bot.id}`);

      // Initialize i18n database collection for this bot's clients configurations if it doesn't already exist.
      await this.gestaltService.createCollection(`/i18n/${bot.id}/clients`);

      // Create a database collection for the talents granted to a bot.
      await this.gestaltService.createCollection(`/bots/${bot.id}/talents`);

      // For all Talents belonging to this bot, we run additional tasks.
      const botTalents = await ServiceContainer.get(TalentCatalogue).getTalentsForBot(bot);
      if (botTalents) {
        for (const botTalent of botTalents) {
          // Create a database collection for the talents granted to a Bot.
          await this.gestaltService.createCollection(`/bots/${bot.id}/talents/${botTalent.machineName}`);

          // Await the synchronization of data between the Talent's default configuration and the database configuration.
          await this.gestaltService.sync(botTalent.config, `/bots/${bot.id}/talents/${botTalent.machineName}/config`);
        }
      }

      // Create a database collection for the clients belonging to a Bot.
      await this.gestaltService.createCollection(`/bots/${bot.id}/clients`);

      // For all Clients belonging to this bot, we run additional tasks.
      for (const client of Object.values(bot.clients)) {
        // Make sure database collection exists for this client for the given bot.
        await this.gestaltService.createCollection(`/bots/${bot.id}/clients/${client.type}`);

        // Make sure database collection exists for this client's i18n storage for the given bot.
        await this.gestaltService.createCollection(`/i18n/${bot.id}/clients/${client.type}`);

        // Run each client's gestalt handler.
        await client.gestalt();
      }
    }

    // Creation of the Talents collection.
    await this.gestaltService.createCollection("/talents");

    // Run Gestalt handlers for each Talent.
    for (const talent of ServiceContainer.get(TalentCatalogue).all()) {
      // Initialize the database collection for this talent if it doesn't already exist.
      await this.gestaltService.createCollection(`/talents/${talent.machineName}`);
    }
  }

  /**
   * Get the active configuration from the database for this Bot.
   *
   * If no active configuration is found, it is fetched from the base configurations and synced to the database.
   *
   * @param bot
   *   Bot to get configurations for.
   *
   * @returns
   *   Returns the configuration fetched from the database.
   */
  public async getActiveConfigForBot(bot: Bot): Promise<BotConfigurations> {
    // Attempt to get the active configuration from the database.
    const activeConfig = await this.gestaltService.get(`/bots/${bot.id}/config/core`);
    if (!Sojiro.isEmpty(activeConfig)) {
      return activeConfig as BotConfigurations;
    }

    // Sync it to the database.
    await this.gestaltService.sync(bot.config, `/bots/${bot.id}/config/core`);

    // Return the configuration.
    return bot.config;
  }

  /**
   * Retrieve active client configuration for this bot.
   *
   * If no active configuration is found, it is fetched from the base configurations and synced to the database.
   *
   * @param bot
   *   Bot to get configurations for.
   * @param clientType
   *   The type of client configuration to return for the bot.
   *
   * @returns
   *   The requested client configuration straight from the database.
   */
  public async getActiveClientConfigForBot(bot: Bot, clientType: ClientType): Promise<BotClientConfig> {
    // Attempt to get the active configuration from the database.
    const activeConfig = await this.gestaltService.get(`/bots/${bot.id}/config/${clientType}`);
    if (!activeConfig) {
      return activeConfig as BotClientConfig;
    }

    // If we don't find any configurations in the database, we'll fetch it normally and then save it.
    const config = await bot.getClientConfig(clientType);

    // Sync it to the database.
    await this.gestaltService.sync(config, `/bots/${bot.id}/config/${clientType}`);

    // Return the configuration.
    return config;
  }

  /**
   * Get active configurations for client
   *
   * @param client
   *   The client to get configurations for.
   *
   * @return
   *   The client configurations loaded from the database.
   */
  public async getActiveConfigForClient(client: Client): Promise<ClientConfigurations> {
    return this.gestaltService.get(`/bots/${client.bot.id}/clients/${client.type}`);
  }


  /**
   * Get the active configuration from the database for this Talent, in the context of a Bot.
   *
   * Bots can override talent configurations for themselves. As a result, in the database, we must store configurations
   * specific to this talent in the bot's database table.
   *
   * @param talent
   *   The talent we want to fetch configurations for.
   * @param bot
   *   The bot context for the configuration we want to fetch. Each bot can have different configuration overrides
   *   for talents.
   *
   * @returns
   *   The active database configuration for the talent configuration, specific to a given Bot.
   */
  public async getActiveTalentConfigForBot(talent: Talent, bot: Bot): Promise<TalentConfigurations> {
    // Await Gestalt's API call to get the configuration from the storage.
    return await this.gestaltService.get(`/bots/${bot.id}/talents/${talent.machineName}/config`) as TalentConfigurations;
  }

}


