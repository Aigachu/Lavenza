/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Igor } from "../../Confidant/Igor";
import { Sojiro } from "../../Confidant/Sojiro";
import { Core } from "../../Core/Core";
import { Catalogue } from "../../Service/Catalogue/Catalogue";
import { Talent } from "../Talent";

import { TalentDirectoryLoader } from "./TalentDirectoryLoader";

/**
 * Provides a Catalogue for Talents.
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
    this.repository = [...await Core.service(TalentDirectoryLoader).load(Core.paths.talents.core), ...await Core.service(TalentDirectoryLoader).load(Core.paths.talents.custom)];

    // Check if we loaded duplicate talents and end if we do.
    if (Sojiro.arrayHasDuplicates(this.repository, "machineName")) {
      await Igor.throw("Duplicate talents were loaded during the build phase. Please make sure you don't have duplicate talents!");
    }
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
