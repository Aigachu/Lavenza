/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Service } from "../Service";

import { EventSubscriptions } from "./EventSubscription";

/**
 * Provides a base abstract class for Event Subscriber services.
 */
export abstract class EventSubscriber extends Service {

  /**
   * Service Tags.
   *
   * Event Subscribers should only have this tag anyways.
   */
  public tags: string[] = [ "event_subscriber" ];

  /**
   * Get the list of subscribed events for given clients.
   */
  public abstract getEventSubcriptions(): EventSubscriptions;
}

