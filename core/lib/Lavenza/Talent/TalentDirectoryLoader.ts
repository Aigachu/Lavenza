/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as path from "path";

// Imports.
import { Akechi } from "../Confidant/Akechi";
import { Igor } from "../Confidant/Igor";
import { Sojiro } from "../Confidant/Sojiro";
import { DirectoryLoader } from "../Service/Loader/DirectoryLoader";

import { Talent } from "./Talent";
import { TalentConfigurations } from "./TalentConfigurations";

/**
 * Provides a DirectoryLoader Service Service for Talents.
 */
export class TalentDirectoryLoader extends DirectoryLoader<Talent> {

  /**
   * Load a talent from a given directory found in the loader.
   *
   * @param talentDirectoryPath
   *   Path to the directory housing the talent.
   *
   * @return
   *   The talent loaded from the directory.
   */
  public async process(talentDirectoryPath: string): Promise<Talent> {
    // Get the machine name of the talent from the directory path.
    const talentMachineName = path.basename(talentDirectoryPath);

    // Get the info file for the talent.
    const configFilePath = `${talentDirectoryPath}/${talentMachineName}.config.yml`;
    const config = await Akechi.readYamlFile(configFilePath)
      .catch(Igor.continue) as TalentConfigurations;

    // If the info is empty, we gotta stop here. They are mandatory.
    if (Sojiro.isEmpty(config)) {
      await Igor.throw("Configuration file could not be located for the {{talent}} talent.", {talent: path.basename(talentDirectoryPath)});
    }

    // Set the directory to the info. It's useful information to have in the Talent itself!
    config.directory = talentDirectoryPath;

    // Require the class and instantiate the Talent.
    let talent: Talent = await import(`${talentDirectoryPath}/${config.class}`);
    talent = new talent[path.basename(config.class, ".js")]();

    // If the talent could not be loaded somehow, we end here.
    if (!talent) {
      await Igor.throw(
        "An error occurred when requiring the {{talent}} talent's class. Verify the Talent's info file.",
        {talent: path.basename(talentDirectoryPath)},
      );
    }

    // Await building of the talent.
    // Talents have build tasks too that must be done asynchronously. We'll run them here.
    await talent.build(config);

    // Push the talent into the repository.
    return talent;
  }

}
