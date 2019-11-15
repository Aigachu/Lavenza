/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Bot } from "../Bot/Bot";
import { Igor } from "../Confidant/Igor";
import { Sojiro } from "../Confidant/Sojiro";
import { Core } from "../Core/Core";
import { Catalogue } from "../Service/Catalogue/Catalogue";

import { Talent } from "./Talent";
import { TalentDirectoryLoader } from "./TalentDirectoryLoader";

/**
 * Provides a Catalogue for Talents.
 *
 * This Catalogue will load necessary talents, and make them available in the bots.
 */
export class TalentCatalogue extends Catalogue<Talent> {

  /**
   * Genesis handler for the TalentCatalogue Service.
   *
   * This runs in the genesis phase of the application.
   *
   * @see Core.summon();
   *
   * @inheritDoc
   */
  public async genesis(): Promise<void> {
    // Load all Talents from the specified installation directories.
    // This loads all talents provided in the Core Framework, as well as any custom talents defined by the user.
    const talentDirectoryLoader = Core.service(TalentDirectoryLoader);
    this.repository = [...await talentDirectoryLoader.load(Core.paths.talents.core), ...await talentDirectoryLoader.load(Core.paths.talents.custom)];

    // Check if we loaded duplicate talents and end if we do.
    if (Sojiro.arrayHasDuplicates(this.repository, "machineName")) {
      await Igor.throw("Duplicate talents were loaded during the build phase. Please make sure you don't have duplicate talents!");
    }
  }

  /**
   * Obtain the list of Talents assigned to a specific Bot.
   *
   * @param bot
   *   Bot to get talents for.
   */
  public async getTalentsForBot(bot: Bot): Promise<Talent[]> {
    return this.library(`bot::${bot.id}`);
  }

  /**
   * Assign a specific talent to a bot's library.
   *
   * @param talent
   *   Talent to assign.
   * @param bot
   *   Bot to assign the Talent to.
   */
  public async assignTalentToBot(talent: Talent, bot: Bot): Promise<void> {
    await this.assign(talent, `bot::${bot.id}`);
  }

  /**
   * Fetch a Talent from the repository.
   *
   * @param machineName
   *   Machine name of the Talent to obtain.
   *
   * @returns
   *   Talent found in the repository. Returns undefined if no Talent is found.
   */
  public getTalent(machineName: string): Talent {
    return this.find((talent: Talent) => talent.machineName === machineName);
  }

}
