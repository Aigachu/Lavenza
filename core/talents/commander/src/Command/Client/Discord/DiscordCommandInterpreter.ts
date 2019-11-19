/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { DiscordClientConfigurations } from "../../../../../../lib/Lavenza/Client/Discord/DiscordConfigurations";
import { DiscordResonance } from "../../../../../../lib/Lavenza/Client/Discord/DiscordResonance";
import { GestaltComposer } from "../../../../../../lib/Lavenza/Gestalt/GestaltComposer";
import { ServiceContainer } from "../../../../../../lib/Lavenza/Service/ServiceContainer";
import { CommandInterpreter } from "../../CommandInterpreter/CommandInterpreter";

/**
 * Provides a Command Interpreter for Commands in Discord.
 */
export class DiscordCommandInterpreter extends CommandInterpreter {

  /**
   * Get the command prefix for a specific client from a resonance.
   *
   * Each command interpreter for a specific client must implement its own way to find this, as configurations may
   * differ.
   *
   * @param resonance
   *   The Resonance we're taking a look at. We'll look at the information for the given bot to determine the prefix.
   *
   * @returns
   *   Returns the command prefix we need to check for.
   */
  public async getCommandPrefixForClient(resonance: DiscordResonance): Promise<string> {
    // Get client specific configurations.
    const clientConfig = await ServiceContainer.get(GestaltComposer).getActiveConfigForClient(resonance.client) as DiscordClientConfigurations;
    if (resonance.message.guild && clientConfig.guilds[resonance.message.guild.id]) {
      return clientConfig.guilds[resonance.message.guild.id].commandPrefix || undefined;
    }
  }

}


