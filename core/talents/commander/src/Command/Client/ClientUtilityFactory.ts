/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { ClientType } from "../../../../../lib/Lavenza/Client/ClientType";
import { Resonance } from "../../../../../lib/Lavenza/Resonance/Resonance";
import { Instruction } from "../../Instruction/Instruction";
import { CommandAuthorizer } from "../CommandAuthorizer/CommandAuthorizer";
import { CommandHelpHandler } from "../CommandHelpHandler/CommandHelpHandler";
import { CommandInterpreter } from "../CommandInterpreter/CommandInterpreter";

import { DiscordCommandAuthorizer } from "./Discord/DiscordCommandAuthorizer";
import { DiscordCommandHelpHandler } from "./Discord/DiscordCommandHelpHandler";
import { DiscordCommandInterpreter } from "./Discord/DiscordCommandInterpreter";
import { TwitchCommandAuthorizer } from "./Twitch/TwitchCommandAuthorizer";
import { TwitchCommandHelpHandler } from "./Twitch/TwitchCommandHelpHandler";
import { TwitchCommandInterpreter } from "./Twitch/TwitchCommandInterpreter";

/**
 * Provides a factory to build all utilities that are client dependent.
 */
export class ClientUtilityFactory {

  /**
   * Build the appropriate command interpreter given the provided client type.
   *
   * @param resonance
   *   The resonance we want to build an interpreter for.
   *
   * @returns
   *   The interpreter that was built.
   */
  public static async buildCommandInterpreter(resonance: Resonance): Promise<CommandInterpreter> {
    // Initialize the object.
    let interpreter: CommandInterpreter;

    // Depending on the requested type, we build the appropriate client.
    switch (resonance.client.type) {

      // Create a DiscordClient if the type is Discord.
      case ClientType.Discord: {
        interpreter = new DiscordCommandInterpreter();
        break;
      }

      // Create a TwitchClient if the type is Discord.
      case ClientType.Twitch: {
        interpreter = new TwitchCommandInterpreter();
      }

    }

    // Return the interpreter.
    return interpreter;
  }

  /**
   * Build the appropriate command authorizer given the provided client type.
   *
   * @param instruction
   *   The Instruction parsed from a resonance.
   * @returns
   *   Authorizer that was instantiated.
   */
  public static async buildCommandAuthorizer(instruction: Instruction): Promise<CommandAuthorizer> {
    // Initialize the object.
    let authorizer: CommandAuthorizer;

    // Depending on the requested type, we build the appropriate client.
    switch (instruction.resonance.client.type) {

      // Create a DiscordClient if the type is Discord.
      case ClientType.Discord: {
        authorizer = new DiscordCommandAuthorizer(instruction.command, instruction);
        break;
      }

      // Create a TwitchClient if the type is Discord.
      case ClientType.Twitch: {
        authorizer = new TwitchCommandAuthorizer(instruction.command, instruction);
      }

    }

    // Run build tasks for authorizer.
    await authorizer.build();

    // Return the authorizer.
    return authorizer;
  }

  /**
   * Build the appropriate help handler given the provided client type.
   *
   * @param instruction
   *   The instruction we want to build a help handler for.
   *
   * @returns
   *   The interpreter that was built.
   */
  public static async buildCommandHelpHandler(instruction: Instruction): Promise<CommandHelpHandler> {
    // Initialize the object.
    let helpHandler: CommandHelpHandler;

    // Depending on the requested type, we build the appropriate client.
    switch (instruction.resonance.client.type) {

      // Create a DiscordClient if the type is Discord.
      case ClientType.Discord: {
        helpHandler = new DiscordCommandHelpHandler();
        break;
      }

      // Create a TwitchClient if the type is Discord.
      case ClientType.Twitch: {
        helpHandler = new TwitchCommandHelpHandler();
      }

    }

    // Return the handler.
    return helpHandler;
  }

}
