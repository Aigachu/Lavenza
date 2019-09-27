/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import {Talent} from "../../lib/Lavenza/Talent/Talent";
import {TalentConfigurations} from "../../lib/Lavenza/Talent/TalentConfigurations";
import {Bot} from "../../lib/Lavenza/Bot/Bot";

/**
 * Gestalt Talent.
 *
 * In case you didn't know, 'Gestalt' is another word for 'configuration'. This Talent will provide commands to allow
 * configuration management while the bot is running.
 */
export class Gestalt extends Talent {
  /**
   * @inheritDoc
   */
  async build(config: TalentConfigurations) {
    // Run default builder.
    await super.build(config);
  }

  /**
   * @inheritDoc
   */
  async initialize(bot: Bot) {
    // Run default initializer.
    await super.initialize(bot);
  }
}
