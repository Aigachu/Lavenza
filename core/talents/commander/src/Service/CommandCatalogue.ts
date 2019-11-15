/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../../../../lib/Lavenza/Bot/Bot";
import { Catalogue } from "../../../../lib/Lavenza/Service/Catalogue/Catalogue";
import { Talent } from "../../../../lib/Lavenza/Talent/Talent";
import { Command } from "../Command/Command";

/**
 * Provides a static class with helper functions pertaining to commands.
 */
export class CommandCatalogue extends Catalogue<Command> {

  /**
   * Store an array of listeners in a library designed for a given bot.
   *
   * @param commands
   *   Array of commands.
   * @param entity
   *   Entity to store the listeners for.
   */
  public async storeCommandsForEntity(commands: Command[], entity: Bot | Talent): Promise<void> {
    // If a bot, we set the catalogue library id to the Bots's ID with a unique key.
    if (entity instanceof Bot) {
      await this.store(commands, `bot::${entity.id}`);
    }
    // If a talent, we set the catalogue library id to the Talent's Machine Name with a unique key.
    if (entity instanceof Talent) {
      await this.store(commands, `talent::${entity.machineName}`);
    }
  }

  /**
   * Store an array of commands in a library designed for a given bot.
   *
   * @param entity
   *   Entity to get the commands for.
   */
  public async getCommandsForEntity(entity: Bot | Talent): Promise<Command[]> {
    // If a bot, we set the catalogue library id to the Bots's ID with a unique key.
    if (entity instanceof Bot) {
      return this.library(`bot::${entity.id}`);
    }
    // If a talent, we set the catalogue library id to the Talent's Machine Name with a unique key.
    if (entity instanceof Talent) {
      return this.library(`talent::${entity.machineName}`);
    }
  }

}
