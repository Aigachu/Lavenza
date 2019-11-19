/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as lodash from "lodash";

// Imports.
import { Akechi } from "../../../Confidant/Akechi";
import { Sojiro } from "../../../Confidant/Sojiro";
import { Core } from "../../../Core/Core";
import { AbstractObject } from "../../../Types";
import { StorageService } from "../StorageService";

import { Collection } from "./Collection/Collection";
import { Item } from "./Item/Item";

/**
 * Chronicler is the default Storage Service used by Gestalt & Lavenza.
 *
 * Chronicler will quite simply read/write to/from a 'database' folder located at the root of the application. Objects
 * will be stored in .yml files and read from them as well.
 *
 */
export class Chronicler extends StorageService {

  /**
   * Stores the path to the root of the database.
   */
  private root: string;

  /**
   * This function will handle build preparations for Chronicler.
   *
   * @inheritDoc
   */
  public async synthesis(): Promise<void> {
    this.root = `${Core.paths.root}/database`;
  }

  /**
   * Create collection using the Chronicler.
   *
   * @TODO - Handle creation of a payload with existing data. Handle Objects as well to created nested collections.
   *
   * @inheritDoc
   */
  public async createCollection(endpoint: string, payload: {} = {}): Promise<void> {
    // Prepend database path to the requested endpoint.
    // We have to do it here since this function doesn't pass through the main request() function.
    const directoryPath: string = this.root + endpoint;

    // Await creation of a directory at the path.
    await Akechi.createDirectory(directoryPath);
  }

  /**
   * Delete file at the path.
   *
   * @TODO - Finish this.
   *
   * @inheritDoc
   */
  public async delete(endpoint: string): Promise<void> {
    console.error("Oh...Delete isn't ready yet haha. AIGACHU. FINISH YOUR WORK.");
  }

  /**
   * Get data from a path at the endpoint.
   *
   * @inheritDoc
   */
  public async get(endpoint: string): Promise<{}> {
    // First we check if the requested path is a file. If it is, we await the returning of its values.
    if (await Akechi.fileExists(`${endpoint}.yml`)) {
      const item: Item = new Item(`${endpoint}.yml`);

      return item.values();
    }

    // If it's not a file, then we'll check if it's a directory. If so, await return of its values.
    if (Akechi.isDirectory(endpoint)) {
      const collection: Collection = new Collection(endpoint);

      return collection.values();
    }

    // If nothing was found, return an empty object.
    return {};
  }

  /**
   * Create a file at the path.
   *
   * @TODO - Handle Collections and Objects as well to create folders and files.
   *
   * @inheritDoc
   */
  public async post(endpoint: string, payload: {}): Promise<{} | undefined> {
    // We simply create a YAML file. We await this process.
    await Akechi.writeYamlFile(endpoint, payload);

    return undefined;
  }

  /**
   * Chronicler alters the endpoints when requests are made.
   *
   * We need to make sure that the root of the database, /database in this app, is prepended to all path requests.
   *
   * @inheritDoc
   */
  public async request({protocol = "", endpoint = "", payload = {}}: AbstractObject = {})
    : Promise<{} | undefined> {
    // Variable to store the actual endpoint.
    let realEndpoint: string = endpoint;

    // If the endpoint doesn't start with the database root, prepend it to the path.
    if (!realEndpoint.startsWith(this.root)) {
      realEndpoint = this.root + realEndpoint;
    }

    // Await the execution of the regular request process.
    return super.request({protocol, endpoint: realEndpoint, payload});
  }

  /**
   * Update the file at the path.
   *
   * @TODO - Handle Collections as well.
   *
   * @inheritDoc
   */
  public async update(endpoint: string, payload: {}): Promise<{} | undefined> {
    // First, we use Chronicler's get method to get the data.
    let data: AbstractObject = await this.get(endpoint);

    // If no data was found, make sure the data is an empty object.
    if (Sojiro.isEmpty(data)) {
      data = {};
    }

    // We use lodash to merge the payload containing the updates, with the original data.
    const updatedData: AbstractObject = lodash.merge(data, payload);

    // Finally, we post the new merged data back to the same endpoint.
    await this.post(endpoint, updatedData);

    // We return the newly merged data.
    // We do another request here. The idea is we want to make sure the data in the file is right.
    // Might change this in the future since the update request actually does 3 requests...But eh.
    return this.get(endpoint);
  }

}
