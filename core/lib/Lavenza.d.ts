/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
declare module "lavenza" {
  // === Imports ===
  import * as path from "path";

  import { BotManager } from "./Lavenza/Bot/BotManager";
  import { ClientType } from "./Lavenza/Bot/Client/ClientType";
  import { CommandClientHandler } from "./Lavenza/Bot/Command/CommandClientHandler";
  import { Listener } from "./Lavenza/Bot/Listener/Listener";
  import { PromptException } from "./Lavenza/Bot/Prompt/Exception/PromptException";
  import { PromptExceptionType } from "./Lavenza/Bot/Prompt/Exception/PromptExceptionType";
  import { Resonance } from "./Lavenza/Bot/Resonance/Resonance";
  import { Akechi } from "./Lavenza/Confidant/Akechi";
  import { Igor } from "./Lavenza/Confidant/Igor";
  import { Kawakami } from "./Lavenza/Confidant/Kawakami";
  import { Morgana } from "./Lavenza/Confidant/Morgana";
  import { Sojiro } from "./Lavenza/Confidant/Sojiro";
  import { Yoshida } from "./Lavenza/Confidant/Yoshida";
  import { Core } from "./Lavenza/Core/Core";
  import { Gestalt } from "./Lavenza/Gestalt/Gestalt";
  import { Talent } from "./Lavenza/Talent/Talent";
  import { TalentManager } from "./Lavenza/Talent/TalentManager";
  import { AbstractObject } from "./Lavenza/Types";

  // === Classes ===
  export { Core } from "./Lavenza/Core/Core";
  export { Command } from "./Lavenza/Bot/Command/Command";

  // === Types ===
  export { AbstractObject };

  // === Functions ===
  // tslint:disable-next-line:only-arrow-functions completed-docs
  export async function initialize(root: string = path.dirname(require.main.filename)): Promise<Core> {
    return Core.initialize(root);
  }
  // tslint:disable-next-line:only-arrow-functions completed-docs
  export async function summon(): Promise<void> {
    return Core.summon();
  }
}
