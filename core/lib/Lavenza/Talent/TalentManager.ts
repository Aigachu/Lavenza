/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../Bot/Bot";
import { BotCatalogue } from "../Bot/BotCatalogue";
import { Igor } from "../Confidant/Igor";
import { Morgana } from "../Confidant/Morgana";
import { Sojiro } from "../Confidant/Sojiro";
import { Service } from "../Service/Service";
import { ServiceContainer } from "../Service/ServiceContainer";

import { Talent } from "./Talent";
import { TalentCatalogue } from "./TalentCatalogue";

/**
 * Provides a Manager Service for Talents.
 *
 * 'Talents', in the context of this application, are bundles of functionality that can be granted to any bot.
 *
 * Think of talents as..."Plugins" from Wordpress, or "Modules" from Drupal, or "Packages" from Laravel.
 *
 * The idea here is that bot features are coded in their own folders. The power here comes from the flexibility we have
 * since talents can be granted to multiple bots, and talents can be tracked in separate repositories if needed. Also,
 * they can easily be toggled on and off.
 *
 * Decoupling the features from the bots seemed like a good move.
 */
export class TalentManager extends Service {

  /**
   * Validate that the bot has dependencies this talent requires.
   *
   * @param talent
   *   Machine name of the Talent to check dependencies for.
   * @param bot
   *   Bot to validate talent dependencies for.
   */
  public static async validateTalentDependencies(talent: Talent, bot: Bot): Promise<boolean> {
    // Check talent's configuration to see if dependencies are loaded into this bot.
    for (const dependency of talent.config.dependencies) {
      // If the dependency isn't found in this bot's config, we shouldn't load this talent.
      if (!bot.config.talents.includes(dependency)) {
        // Send a warning to the console.
        await Morgana.error(
          "The '{{talent}}' talent requires the '{{parent}}' talent to exist and to be enabled, but this is not the case. It will not be activated for {{bot}}.",
          {
            bot: bot.id,
            parent: dependency,
            talent: talent.machineName,
          });

        return false;
      }
    }

    return true;
  }

  /**
   * Runs each Talent's initialize() function to run any preparations for the given bot.
   *
   * @param bot
   *   The Bot that we want to initialize talents for.
   */
  private static async initializeTalentsForBot(bot: Bot): Promise<void> {
    // Await the processing of all of this bot's talents.
    const talents = await ServiceContainer.get(TalentCatalogue).getTalentsForBot(bot);

    // If the bot has no talents, we can return.
    if (!talents) {
      return;
    }

    // Otherwise, run initialization tasks for all talents in a bot.
    for (const talent of talents) {
      // Run this talent's initialize function for this bot.
      await talent.initialize(bot);
    }
  }

  /**
   * Grants talents to the Bot.
   *
   * There is a collection of Core talents that all bots will have.
   *
   * Custom Talents are configured in the Bot's configuration file. You must enter the ID (directory name) of
   * the talent in the bot's config so that it can be loaded here.
   *
   * It's important to note that Talent Classes are never stored in the bot. Only the IDs are stored.
   *
   * Talents will always be accessed through the TalentCatalogue itself.
   *
   * @param bot
   *   Bot to grant talents to.
   */
  private static async grantTalentsToBot(bot: Bot): Promise<void> {
    // Check if there are talents set in configuration.
    if (Sojiro.isEmpty(bot.config.talents)) {
      await Morgana.warn(
        "Talents configuration missing for {{bot}}. The bot will not have any cool features!",
        {bot: bot.id},
      );

      return;
    }

    // If this is the Master bot, we will grant the Master talent.
    if (bot.isMaster) {
      bot.config.talents.push("master");
    }

    // Alternatively, we'll do a quick check to see if someone is trying to set the master talent in config.
    // This talent should not be set here, and instead is automatically assigned to the master bot.
    if (bot.config.talents.includes("master") && !bot.isMaster) {
      bot.config.talents = Sojiro.removeFromArray(bot.config.talents, "master") as string[];
    }

    // Await the processing of all talents in the bot's config object.
    for (const talentMachineName of bot.config.talents) {
      // Attempt to load the talent from the catalogue.
      const talent = ServiceContainer.get(TalentCatalogue).getTalent(talentMachineName);

      // Check if the Talent exists, and exit it if doesn't.
      if (!talent) {
        await Igor.exit(`The "${bot.id}" bot has the "${talentMachineName}" talent enabled for it, but this talent doesn't exist. Please add this talent, or remove it from the talents specified in the bot.`);
      }

      // Await validation of talents configured.
      // This basically checks if the talent entered is valid. Invalid ones are removed from the array.
      if (!await TalentManager.validateTalentDependencies(talent, bot)) {
        bot.config.talents = Sojiro.removeFromArray(bot.config.talents, talent.machineName);

        return;
      }

      // We will also load this talent.
      // If the talent exists, we want to load it.
      await talent.load();

      // If all is good, we grant this talent to the bot through assignation in the Catalogue.
      await ServiceContainer.get(TalentCatalogue).assignTalentToBot(talent, bot);
    }
  }

  /**
   * Genesis handler for the TalentManager Service.
   *
   * We enable talents that need to be enabled. Only talents that are enabled in bots are enabled.
   *
   * @see Core.summon();
   *
   * @inheritDoc
   */
  public async genesis(): Promise<void> {
    // From the loaded bots, we want to see which talents we need to enable.
    // This genesis task must run after the BotCatalogue's genesis task.
    for (const bot of ServiceContainer.get(BotCatalogue).all()) {
      await TalentManager.grantTalentsToBot(bot);
    }
  }

  /**
   * Statis handler for the TalentManager.
   *
   * @inheritDoc
   */
  public async statis(): Promise<void> {
    // Now we want to loop through all bots in the bot catalogue, and initialize talents set for the bot.
    for (const bot of ServiceContainer.get(BotCatalogue).all()) {
      await TalentManager.initializeTalentsForBot(bot);
    }
  }

}
