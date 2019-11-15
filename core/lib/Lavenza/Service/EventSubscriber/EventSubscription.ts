/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { ClientType } from "../../Client/ClientType";
import { AssociativeObject } from "../../Types";
import { Service } from "../Service";

/**
 * Provides an interface for an event subscription.
 */
export interface EventSubscription {

  /**
   * The method to run for the subscribed event.
   */
  method: string;

  /**
   * The priority this subscription should execute with.
   */
  priority: number;

}

/**
 * Provides a type that stores a list of event subscriptions per client type.
 */
export type EventSubscriptions = {

  /**
   * Each event subscription is a storage with the key being the client type the subscriptions are for.
   *
   * Each subscription is an associative object. The key in this associative object should be the id of a event that
   * the given client emits, and the value should be an Event Subscription.
   */
  [key in ClientType]: AssociativeObject<EventSubscription>

};

/**
 * Provides an interface for Subscription Records, which are validated entries of data describing a subscription to a
 * client's event.
 *
 * These records will be used to fire the proper event handlers whenever a client emits an event.
 */
export interface SubscriptionRecord {

  /**
   * Service this subscription record is for.
   */
  service: Service;

  /**
   * Event this subscription record is for.
   */
  event: string;

  /**
   * EventSubscriber Method that will handle the actions to undertake once the event occurs.
   */
  method: string;

  /**
   * The priority of this subscription.
   */
  priority: number;

}

