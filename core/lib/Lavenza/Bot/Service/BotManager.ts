/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Morgana } from "../../Confidant/Morgana";
import { Sojiro } from "../../Confidant/Sojiro";
import { Core } from "../../Core/Core";
import { Service } from "../../Service/Service";
import { ServiceContainer } from "../../Service/ServiceContainer";
import { Bot } from "../Bot";

import { BotCatalogue } from "./BotCatalogue";

/**
 * Provides a Catalogue for Bots.
 *
 * This class manages the registering and instantiation of bots.
 *
 * Bots are configured in the 'bots' folder at the root of the application.
 *
 */
export class BotManager extends Service {

  /**
   * Preparation handler for the BotManager.
   *
   * Registers all bots and fires all of *their* preparation handlers.
   */
  public async build(): Promise<void> {
    // We'll run build handlers for all bots as this should only be done once.
    // Await preparation handlers for all bots.
    await Promise.all(ServiceContainer.get(BotCatalogue).all().map(async (bot) => {
      // Await preparation handler for a single bot.
      await bot.build();
    }));
  }

  /**
   * Execution handler for the BotManager.
   *
   * Deploy only the "Master" bot.
   */
  public async run(): Promise<void> {
    // Boot master bot that will manage all other bots in the codebase.
    await this.boot(Core.settings.config.bots.master);

    // Some more flavor.
    await Morgana.success("Booted the master bot, {{bot}}!", {bot: Core.settings.config.bots.master});

    // Boot auto-boot bots.
    // Some bots are set up for auto-booting. We'll handle those too.
    await this.bootAutoBoots();
  }

  /**
   * Run deployment handlers for all bots loaded in the Catalogue.
   *
   * @param botId
   *    The ID of the bot to deploy.
   */
  public async boot(botId: string): Promise<void> {
    // If the bot isn't found, we can't boot it.
    const bot = await ServiceContainer.get(BotCatalogue).find(((b: Bot) => b.id === botId));
    if (!bot) {
      await Morgana.warn("Tried to boot an non-existent bot: {{botId}}. Gracefully continuing the program.", {botId});

      return;
    }

    // Await deployment handlers for a single bot.
    await bot.deploy();
  }

  /**
   * Shutdown a bot.
   *
   * @param botId
   *   ID of the Bot to shutdown.
   */
  public async shutdown(botId: string): Promise<void> {
    // If the bot isn't found, we can't shut it down.
    const bot = await ServiceContainer.get(BotCatalogue).find(((b: Bot) => b.id === botId));
    if (!bot) {
      await Morgana.warn(
        "Tried to shutdown an non-existent bot: {{botId}}. Gracefully continuing the program.",
        {botId},
        );

      return;
    }

    await bot.shutdown();
  }

  /**
   * Boots all bots set up in the 'autoboot' array of the settings.
   */
  private async bootAutoBoots(): Promise<void> {
    // If the autoboot array is empty, we don't do anything here.
    if (Sojiro.isEmpty(Core.settings.config.bots.autoboot)) {
      await Morgana.warn("No bots set up for autobooting. Continuing!");

      return;
    }

    // Boot all bots set up in autobooting.
    await Promise.all(Core.settings.config.bots.autoboot.map(async (botId) => {
      await this.boot(botId);
      await Morgana.success("Successfully Auto-Booted {{bot}}!", {bot: botId});
    }));
  }

}
