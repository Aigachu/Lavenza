/* tslint:disable:completed-docs only-arrow-functions max-classes-per-file */

/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
declare module "lavenza" {
  // === Imports ===
  import * as path from "path";

  import { CommandConfigurations } from "./Lavenza/Bot/Command/CommandConfigurations";
  import { Listener } from "./Lavenza/Bot/Listener/Listener";
  import { Resonance } from "./Lavenza/Bot/Resonance/Resonance";
  import { Core } from "./Lavenza/Core/Core";
  import { TalentConfigurations } from "./Lavenza/Talent/TalentConfigurations";
  import { AssociativeObject } from "./Lavenza/Types";

  // === Classes ===
  export class Command {
    public id: string;
    public id: string;
    public key: string;
    public directory: string;
    public config: CommandConfigurations;
    protected talent: Talent;
    public async fireClientHandlers(resonance: Resonance, data: AbstractObject | string, method: string = "execute"): Promise<unknown>;
  }

  export class Talent {
    public commandAliases: AssociativeObject<string> = {};
    public commands: AssociativeObject<Command> = {};
    public config: TalentConfigurations;
    public databases: AssociativeObject<string> = {};
    public directory: string;
    public listeners: Listener[] = [];
    public machineName: string;
  }

  // === Types ===
  interface AbstractObject {
    // tslint:disable-next-line:no-any
    [key: string]: any;
  }
  interface AssociativeObject<T> {
    [key: string]: T;
  }

  // === Functions ===
  export async function initialize(root: string = path.dirname(require.main.filename)): Promise<Core> {
    return Core.initialize(root);
  }
  export async function summon(): Promise<void> {
    return Core.summon();
  }
}
