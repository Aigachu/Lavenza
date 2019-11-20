/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Client } from "../../Client/Client";
import { AbstractObject } from "../../Types";
import { Service } from "../Service";
import { ServiceContainer } from "../ServiceContainer";

import { EventSubscriber } from "./EventSubscriber";
import { SubscriptionRecordCatalogue } from "./SubscriptionRecordCatalogue";

/**
 * Provides a manager for event subscribers.
 */
export class EventSubscriberManager extends Service {

  /**
   * Run event subscribers for a given client & event.
   *
   * @param client
   *   Client the run event subscribers for.
   * @param event
   *   Event to handle.
   * @param data
   *   Data obtained from the event.
   */
  public static async runEventSubscribers(client: Client, event: string, data?: AbstractObject): Promise<void> {
    // Through the catalogue, we get the array of subscription records that are stored in the appropriate library.
    const records = ServiceContainer.get(SubscriptionRecordCatalogue).library(`${client.type}::${event}`);

    // If there are no records, we can exit here.
    if (!records) {
      return;
    }

    // We want to sort each record by priority real fast.
    records.sort((a, b) => b.priority - a.priority);

    // Loop through all the records and run those that we need to run.
    for (const record of records) {
      // First, we check if the service defined in the record is a service that is available for the bot in the client.
      if (record.service.talent && !client.bot.config.talents.includes(record.service.talent)) {
        continue;
      }

      // Now we simply run the subscriber.
      await record.service[record.method](client, data);
    }
  }

  /**
   * Synthesize event subscriber services.
   *
   * This will assign and subscribe all EventSubscribers to their customized events.
   */
  public static async synthesizeEventSubscribers(): Promise<void> {
    // Now we want to obtain all Event Subscriber services and populate the subscription catalogue.
    for (const service of ServiceContainer.getServicesWithTag("event_subscriber") as EventSubscriber[]) {
      const subscriptions = service.getEventSubcriptions();
      for (const [client, events] of Object.entries(subscriptions)) {
        for (const [event, subscription] of Object.entries(events)) {
          await ServiceContainer.get(SubscriptionRecordCatalogue)
            .store(
              {
                event,
                method: subscription.method,
                priority: subscription.priority,
                service,
              },
              `${client}::${event}`);
        }
      }
    }
  }

  /**
   * Run Synthesis process handler.
   *
   * @inheritDoc
   */
  public async synthesis(): Promise<void> {
    await EventSubscriberManager.synthesizeEventSubscribers();
  }

}
