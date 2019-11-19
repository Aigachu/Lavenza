/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Resonance } from "../../../../lib/Lavenza/Resonance/Resonance";
import { Listener } from "../../../listeners/src/Listener/Listener";

/**
 * A wonderful listener!
 */
export class WonderfulListenerExample extends Listener {

  /**
   * If we hear 'wonderful', we say Wonderful! <3.
   *
   * @param resonance
   *   The resonance heard by the listener.
   */
  public static async sayWonderfulToo(resonance: Resonance): Promise<void> {
    // If we hear 'wonderful', we say Wonderful! <3.
    if (resonance.content === "wonderful") {
      await resonance.__reply("Wonderful! <3");
    }
  }

  /**
   * This is the function that listens to messages and acts upon them.
   *
   * @inheritDoc
   */
  public async listen(resonance: Resonance): Promise<void> {
    // Say wonderful!
    await WonderfulListenerExample.sayWonderfulToo(resonance);
  }

}
