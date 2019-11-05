/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Core } from "../../../../lib/Lavenza/Core/Core";
import { Catalogue } from "../../../../lib/Lavenza/Service/Catalogue/Catalogue";
import { ServiceContainer } from "../../../../lib/Lavenza/Service/ServiceContainer";
import { TalentCatalogue } from "../../../../lib/Lavenza/Talent/Service/TalentCatalogue";
import { Talent } from "../../../../lib/Lavenza/Talent/Talent";
import { Command } from "../Command/Command";

import { CommandDirectoryLoader } from "./CommandDirectoryLoader";

/**
 * Provides a static class with helper functions pertaining to commands.
 */
export class CommandCatalogue extends Catalogue<Command> {

  /**
   * Build handler for the CommandCatalogue Service.
   *
   * This runs in the build phase of the application.
   *
   * This should be set to run after Talents & Bots are initialized. We want to load commands that may be defined for
   * each and set them to our repository.
   *
   * @inheritDoc
   */
  public async build(): Promise<void> {

  }

  /**
   * From a given path, load commands into the repository via the CommandDirectoryLoader.
   *
   * @return
   *   The commands loaded from the provided path.
   */
  public async loadCommands(pathToLoadFrom: string): Promise<Command[]> {
    const loadedCommands = await Core.service(CommandDirectoryLoader).load(pathToLoadFrom);
    this.repository = [...this.repository, ...loadedCommands];

    return loadedCommands;
  }

}
