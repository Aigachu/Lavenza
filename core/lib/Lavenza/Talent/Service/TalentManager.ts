/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../../Bot/Bot";
import { Igor } from "../../Confidant/Igor";
import { Morgana } from "../../Confidant/Morgana";
import { Sojiro } from "../../Confidant/Sojiro";
import { Service } from "../../Service/Service";
import { ServiceContainer } from "../../Service/ServiceContainer";

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
  private async grantTalentsToBot(bot: Bot): Promise<void> {
    // Check if there are talents set in configuration.
    if (Sojiro.isEmpty(bot.config.talents)) {
      await Morgana.warn(
        "Talents configuration missing for {{bot}}. The bot will not have any cool features!",
        {bot: this.id},
      );

      return;
    }

    // Await validation of custom talents configured.
    // This basically checks if the talents entered are valid. Invalid ones are removed from the array.
    await this.validateTalents(bot);
  }

  /**
   * Validates the list of custom talents configured in the bot's config file.
   *
   * If a talent is in the list, but does not exist, it will be removed from the configuration list.
   */
  private async validateTalents(bot: Bot): Promise<void> {
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
    await Promise.all(bot.config.talents.map(async (talentMachineName) => {
      // Then, we'll check if this talent exists in the Catalogue.
      // This happens if another bot already loaded it.
      // If it exists, we're good.
      if (!ServiceContainer.get(TalentCatalogue).getTalent(talentMachineName)) {
        // Send a warning message to the console.
        await Igor.throw("Tried to validate '{{talent}}' talent for {{bot}}, but it does not exist.", {talent: talentMachineName, bot: bot.id});

        return;
      }

      // Validate the dependencies for this talent.
      await this.validateTalentDependencies(talentMachineName, bot);
    })).catch(Igor.throw);
  }

  /**
   * Validate that the bot has dependencies this talent requires.
   *
   * @TODO - Manage talent dependencies in the talent manager.
   *
   * @param talentMachineName
   *   Machine name of the Talent to check dependencies for.
   * @param bot
   *   Bot to validate talent dependencies for.
   */
  private async validateTalentDependencies(talentMachineName: string, bot: Bot): Promise<void> {
    // Check talent's configuration to see if dependencies are loaded into this bot.
    await Promise.all(ServiceContainer.get(TalentCatalogue).getTalent(talentMachineName).config.dependencies.map(async (dependency) => {
      // If the dependency isn't found in this bot's config, we shouldn't load this talent.
      if (!bot.config.talents.includes(dependency)) {
        // Send a warning to the console.
        await Morgana.warn(
          "The '{{talent}}' talent requires the '{{parent}}' talent to exist and to be enabled, but this is not the case. It will not be activated for {{bot}}.",
          {
            bot: this.id,
            parent: dependency,
            talent: talentMachineName,
          });

        // Remove this talent from the bot.
        bot.config.talents = Sojiro.removeFromArray(bot.config.talents, talentMachineName) as string[];
      }
    }));
  }

}
