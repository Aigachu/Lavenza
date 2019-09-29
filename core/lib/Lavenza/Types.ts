/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { ClientType } from "./Bot/Client/ClientType";
import { ClientUser } from "./Bot/Client/ClientUser";

/**
 * Declare an interface for a basic associative object.
 */
export type Joker = {
  [key in ClientType]: ClientUser;
};

/**
 * Declare an interface for a basic associative object.
 */
export interface AssociativeObject<T> {
  [key: string]: T;
}

/**
 * Declare an interface for an abstract associative object.
 */
export interface AbstractObject {
  // tslint:disable-next-line:no-any
  [key: string]: any;
}