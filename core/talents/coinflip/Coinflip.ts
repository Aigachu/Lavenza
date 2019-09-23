/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import Talent from "../../lib/Lavenza/Talent/Talent";
import {TalentConfigurations} from "../../lib/Lavenza/Talent/TalentConfigurations";
import Bot from "../../lib/Lavenza/Bot/Bot";

/**
 * Coinflip Talent.
 *
 * This talent grants the coinflip command and has many additional features included in it!
 */
export default class Coinflip extends Talent {
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