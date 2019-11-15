/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Guild } from "discord.js";

import { ClientType } from "../../../../lib/Lavenza/Client/ClientType";
import { DiscordClient } from "../../../../lib/Lavenza/Client/Discord/DiscordClient";
import { DiscordClientGuildConfigurations } from "../../../../lib/Lavenza/Client/Discord/DiscordConfigurations";
import { EventSubscriber } from "../../../../lib/Lavenza/Service/EventSubscriber/EventSubscriber";
import { EventSubscriptions } from "../../../../lib/Lavenza/Service/EventSubscriber/EventSubscription";
import { ServiceContainer } from "../../../../lib/Lavenza/Service/ServiceContainer";

import { Gestalt } from "./Gestalt";


/**
 * Provides an event subscriber for the Gestalt talent.
 */
export abstract class GestaltEventSubscriber extends EventSubscriber {

  /**
   * Inject the Gestalt Service through DI.
   */
  public gestaltService: Gestalt = ServiceContainer.get(Gestalt);

  /**
   * Get the list of subscribed events for given clients.
   */
  public getEventSubcriptions(): EventSubscriptions {
    const subscriptions = {};

    // Discord Client event subscriptions.
    subscriptions[ClientType.Discord] = {
      guildCreate: "discordOnGuildCreate",
    };

    return subscriptions as EventSubscriptions;
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

