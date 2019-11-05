/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from "path";

import { Akechi } from "../../Confidant/Akechi";
import { Igor } from "../../Confidant/Igor";
import { Morgana } from "../../Confidant/Morgana";
import { Sojiro } from "../../Confidant/Sojiro";
import { Core } from "../../Core/Core";
import { DirectoryLoader } from "../../Service/Loader/DirectoryLoader";
import { Bot } from "../Bot";
import { BotConfigurations } from "../BotConfigurations";

/**
 * Provides a Directory Service Service for Talents.
 */
export class BotDirectoryLoader extends DirectoryLoader<Bot> {

  /**
   * Load a talent from a given directory found in the loader.
   *
   * @param botDirectoryPath
   *   Path to the directory housing the bot.
   *
   * @return
   *   The Bot loaded from the directory.
   */
  public async process(botDirectoryPath: string): Promise<Bot> {
    // Get the bot name. This is in fact the name of the directory.
    const id = path.basename(botDirectoryPath);

    // We want to ignore the 'example' bot in all cases.
    if (id === "example") {
      return;
    }

    // Get the config file for the bot.
    const configFilePath = `${botDirectoryPath}/config.yml`;
    const config = await Akechi.readYamlFile(configFilePath).catch(Igor.continue) as BotConfigurations;

    // If the configuration is empty, stop here.
    // @TODO - Use https://www.npmjs.com/package/validate to validate configurations.
    if (Sojiro.isEmpty(config)) {
      await Morgana.warn("Configuration file could not be loaded for following bot: {{bot}}", {bot: id});

      return;
    }

    // If the 'active' flag of the config is set and is not 'true', we don't activate this bot.
    if (config.active !== undefined && config.active === false) {
      await Morgana.warn("The {{bot}} bot has been set to inactive. It will not be loaded.", {bot: id});

      return;
    }

    // Instantiate and set the bot to the collection.
    const bot = new Bot(id, config, botDirectoryPath);
    if (bot.id === Core.settings.config.bots.master) {
      bot.isMaster = true;
    }

    // Print a success message.
    await Morgana.success("The {{bot}} bot has successfully been loaded!", {bot: id});

    // Return the bot.
    return bot;
  }
}
