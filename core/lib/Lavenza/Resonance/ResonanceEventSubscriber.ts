/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Client } from "../Client/Client";
import { ClientFactory } from "../Client/ClientFactory";
import { ClientMessage } from "../Client/ClientMessage";
import { ClientType } from "../Client/ClientType";
import { Core } from "../Core/Core";
import { EventSubscriber } from "../Service/EventSubscriber/EventSubscriber";
import { EventSubscriptions } from "../Service/EventSubscriber/EventSubscription";
import { ServiceContainer } from "../Service/ServiceContainer";

import { Resonator } from "./Resonator/Resonator";


/**
 * Provides an Event Subscriber for the Resonance Service.
 */
export class ResonanceEventSubscriber extends EventSubscriber {

  /**
   * Get the list of subscribed events for given clients.
   */
  public getEventSubcriptions(): EventSubscriptions {
    // Initialize the subscriptions.
    const subscriptions = {};

    // Discord Client event subscriptions.
    subscriptions[ClientType.Discord] = {
      // When the "message" event occurs, fire the "resonate" function with a priority of "5000".
      message: { method: "resonate", priority: 5000 },
    };

    return subscriptions as EventSubscriptions;
  }

  /**
   * Resonate a message heard in a client.
   *
   * Now, explanations.
   *
   * This function will be used to send a 'communication' back to the bot. This happens whenever a message
   * is 'heard', meaning that the bot is in a chat room and a message was sent by someone (or another bot).
   *
   * When this function is ran, we fetch the raw content of the message sent, and we build a Resonance object with it.
   * This is a fancy name for an object that stores information about a received communication.
   *
   * We then invoke all Resonator services that are declared for the given bot. Resonators are services that other
   * parts of the core or talents can provide to act upon messages that are heard.
   *
   * @param client
   *   The client that emitted the event.
   * @param message
   *   The message that was passed through the event.
   */
  // tslint:disable-next-line:completed-docs
  public async resonate(client: Client, {message}: {message: ClientMessage}): Promise<void> {
    // We'll only do the following tasks if the Core is in the proper status.
    // Resonators will only run if the Lavenza Core is completely finished preparations.
    if (Core.status !== CoreStatus.running) {
      return;
    }

    // Construct a 'Resonance'.
    const resonance = await ClientFactory.buildResonance(client, message);

    // Obtain all resonator services.
    const resonators = ServiceContainer.getServicesWithTag("resonator") as Resonator[];

    // Sort resonators in order of defined priority.
    resonators.sort((a, b) => b.priority - a.priority);

    // Run them all.
    for (const resonator of resonators) {
      // First, we check if the service defined is a service that is available for the bot in the client.
      if (resonator.talent && !(resonator.talent in client.bot.config.talents)) {
        continue;
      }

      // For each resonator, we run the resonate() function.
      await resonator.resonate(resonance);
    }
  }

}

