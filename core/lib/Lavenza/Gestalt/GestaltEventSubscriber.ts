/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Guild } from "discord.js";

import { ClientType } from "../Client/ClientType";
import { DiscordClient } from "../Client/Discord/DiscordClient";
import { DiscordClientGuildConfigurations } from "../Client/Discord/DiscordConfigurations";
import { EventSubscriber } from "../Service/EventSubscriber/EventSubscriber";
import { EventSubscriptions } from "../Service/EventSubscriber/EventSubscription";
import { ServiceContainer } from "../Service/ServiceContainer";

import { Gestalt } from "./Gestalt";


/**
 * Provides an event subscriber for the Gestalt talent.
 */
export class GestaltEventSubscriber extends EventSubscriber {

  /**
   * House the gestalt service that will be injected through DI with the build() function.
   */
  public gestaltService: Gestalt;

  /**
   * Build tasks for the gestalt event subscriber.
   */
  public async build(): Promise<void> {
    this.gestaltService = ServiceContainer.get(Gestalt);
  }

  /**
   * Get the list of subscribed events for given clients.
   */
  public getEventSubcriptions(): EventSubscriptions {
    return {
      [ClientType.Discord]: {
        guildCreate: { method: "discordOnGuildCreate", priority: 5000 },
      },
      [ClientType.Twitch]: {},
    };
  }

  /**
   * Handle tasks when the "onGuildCreate" event is emitted through a Bot's discord client.
   *
   * @param client
   *   The client that emitted the event.
   * @param guild
   *   The data passed through the event. This varies depending on the event that was emitted.
   */
  // tslint:disable-next-line:completed-docs
  public async discordOnGuildCreate(client: DiscordClient, {guild}: {guild: Guild}): Promise<void> {
    // We start by syncing the guild configurations.
    const guilds = this.gestaltService.sync({}, `/bots/${client.bot.id}/clients/${client.type}/guilds`);

    const baseGuildConfig: DiscordClientGuildConfigurations = {
      commandPrefix: await client.bot.config.commandPrefix,
      name: guild.name,
      userEminences: {},
    };

    if (!(guild.id in guilds)) {
      guilds[guild.id] = baseGuildConfig;
    }
    await this.gestaltService.update(`/bots/${client.bot.id}/clients/${client.type}/guilds`, guilds);
  }

}

