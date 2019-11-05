/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { BotCatalogue } from "../../Bot/Service/BotCatalogue";
import { Morgana } from "../../Confidant/Morgana";
import { Sojiro } from "../../Confidant/Sojiro";
import { TalentCatalogue } from "../../Talent/Service/TalentCatalogue";
import { Talent } from "../../Talent/Talent";
import { AbstractObject } from "../../Types";
import { Service } from "../Service";
import { ServiceContainer } from "../ServiceContainer";

import { Chronicler } from "./StorageService/Chronicler/Chronicler";
import { StorageService } from "./StorageService/StorageService";

/**
 * Gestalt manages the storage and retrieval of JSON type data.
 *
 * The name? Well, I just like how it sounds. Haha!
 *
 * Gestalt: "An organized whole that is perceived as more than the sum of its parts."
 *
 * This class serves as the bridge towards the main StorageService that Lavenza will be using. A Storage Service is
 * essentially the service that will access the database of the application, wherever it is stored. It is the job
 * of the StorageService to determine what type of data storage it will access, and the responsibility of it to
 * implement the necessary methods for Lavenza to work. It MUST adopt the structure of a REST protocol: GET
 * POST, UPDATE & DELETE.
 *
 * We want to keep things simple and store JSON type data. In the future, we may explore SQL storage and the like.
 * i.e. MongoDB!
 */
export class Gestalt extends Service {

  /**
   * The storage service that Gestalt will use.
   *
   * This will determine what kind of database storage we'Ll be using.
   */
  private storageService: StorageService;

  /**
   * Perform Gestalt's genesis tasks.
   *
   * @inheritDoc
   */
  public async genesis(): Promise<void> {
    // The default storage service is the Chronicler.
    /** @see ./StorageService/Chronicler/Chronicler */
    // @TODO - Dynamic selection of StorageService instead of having to save it here.
      //  Maybe .env variables? Or a configuration file at the root of the application.
    const storageService: StorageService = new Chronicler();

    // Await the build process of the storage service and assign it to Gestalt.
    await storageService.build();
    this.storageService = storageService;
  }

  /**
   * Perform Gestalt's arrange tasks.
   *
   * @inheritDoc
   */
  public async arrange(): Promise<void> {
    await this.bootstrap();
  }

  /**
   * Perform Gestalt's run tasks.
   *
   * @inheritDoc
   */
  public async run(): Promise<void> {
    // Not much to do here actually. You can relax buddy.
  }

  /**
   * Bootstrap the database.
   *
   * This creates all database entries needed for the application to function properly.
   *
   * For every service declared in the application, Gestalt will run a gestalt() function if a Service implements it.
   */
  public async bootstrap(): Promise<void> {
    // Some flavor text for the console.
    await Morgana.status("Commencing Gestalt database bootstrap process...");

    // Creation of i18n collection.
    // All data pertaining to translations will be saved here.
    await this.createCollection("/i18n");

    // Some flavor.
    await Morgana.status("Loading bots database...");

    // Creation of the Bots collection.
    await this.createCollection("/bots");

    // Run Gestalt handlers for each Bot.
    await Promise.all(ServiceContainer.get(BotCatalogue).all().map(async (bot) => {
      // Initialize the database collection for this bot if it doesn't already exist.
      await this.createCollection(`/bots/${this.id}`);

      // Initialize the database collection for this bot's configurations if it doesn't already exist.
      await this.createCollection(`/bots/${this.id}/config`);

      // Sync core bot config to the database.
      await this.sync(bot.config, `/bots/${this.id}/config/core`);

      // Initialize i18n database collection for this bot if it doesn't already exist.
      await this.createCollection(`/i18n/${this.id}`);

      // Initialize i18n database collection for this bot's clients configurations if it doesn't already exist.
      await this.createCollection(`/i18n/${this.id}/clients`);

      // Create a database collection for the talents granted to a bot.
      await this.createCollection(`/bots/${this.id}/talents`);

      // Await the bootstrapping of each talent's data.
      // await Promise.all(bot.talents.map(async (talent) => {
      //   // Create a database collection for the talents granted to a Bot.
      //   await this.createCollection(`/bots/${this.id}/talents/${talent.machineName}`);
      //
      //   // Await the synchronization of data between the Talent's default configuration and the database configuration.
      //   await this.sync(talent.config, `/bots/${this.id}/talents/${talent.machineName}/config`);
      // }));

      // Create a database collection for Commands belonging to a Bot.
      await this.createCollection(`/bots/${this.id}/commands`);

      // Await the bootstrapping of Commands data.
      // await Promise.all(bot.commands.map(async (command) => {
      //   // Create a database collection for commands belonging to a Bot.
      //   await this.createCollection(`/bots/${this.id}/commands/${command.id}`);
      //
      //   // Synchronization of data between the Command's default configuration and the database configuration.
      //   await this.sync(command.config, `/bots/${this.id}/commands/${command.id}/config`);
      // }));

      // Create a database collection for the clients belonging to a Bot.
      await this.createCollection(`/bots/${this.id}/clients`);
    }));

    // Some flavor.
    await Morgana.success("Bots database loaded!");

    // Some flavor.
    await Morgana.status("Loading talents database...");

    // Creation of the Talents collection.
    await this.createCollection("/talents");

    // Run Gestalt handlers for each Talent.
    await Promise.all(ServiceContainer.get(TalentCatalogue).all().map(async (talent: Talent) => {
      // Initialize the database collection for this talent if it doesn't already exist.
      await this.createCollection(`/talents/${talent.machineName}`);
    }));

    // Some flavor.
    await Morgana.success("Talents database loaded!");

    // Some flavor text for the console.
    await Morgana.success("Gestalt database successfully bootstrapped!");
  }

  /**
   * Create a collection in the storage service.
   *
   * We need to keep in mind that we're using mostly JSON storage in this context.
   * This makes use of Collections & Items.
   *
   * @param endpoint
   *   Location where to create the collection.
   * @param payload
   *   The data of the Collection to create.
   */
  public async createCollection(endpoint: string, payload: {} = {}): Promise<void> {
    // Each storage service creates collections in their own way. We await this process.
    await this.storageService.createCollection(endpoint, payload);
  }

  /**
   * Process a DELETE request using the storage service.
   *
   * @param endpoint
   *   Path to delete data at.
   */
  public async delete(endpoint: string): Promise<void> {
    // Await DELETE request of the Storage Service.
    await this.request({protocol: "delete", endpoint});
  }

  /**
   * Process a GET request using the storage service.
   *
   * @param endpoint
   *   Path to get data from.
   *
   * @returns
   *   Data retrieved from the given endpoint.
   */
  public async get(endpoint: string): Promise<{}> {
    // Await GET request of the Storage Service.
    return this.request({protocol: "get", endpoint});
  }

  /**
   * Process a POST request using the storage service.
   *
   * @param endpoint
   *   Path to push data to.
   * @param payload
   *   Data to push to the endpoint.
   *
   * @returns
   *   The data that was posted, if requested.
   */
  public async post(endpoint: string, payload: {}): Promise<{} | undefined> {
    // Await POST request of the Storage Service.
    return this.request({protocol: "post", endpoint, payload});
  }

  /**
   * Make a request using the storage service.
   *
   * The linked storage service implements it's own methods of storing and accessing data. Gestalt simply calls those.
   *
   * @param protocol
   *   The protocol we want to use.
   *   The are four: GET, POST, UPDATE, DELETE.
   *    - GET: Fetch and retrieve data from a path/endpoint.
   *    - POST: Create data at a path/endpoint.
   *    - UPDATE: Adjust data at a path/endpoint.
   *    - DELETE: Remove data at a path/endpoint.
   * @param endpoint
   *   The string path/endpoint of where to apply the protocol.
   * @param payload
   *   The data, if needed, to apply the protocol. GET/DELETE will not need a payload.
   *
   * @returns
   *   The result of the protocol call.
   */
  public async request({protocol = "", endpoint = "", payload = {}}: AbstractObject = {})
    : Promise<{} | undefined> {
    // Await the request function call of the storage service.
    return this.storageService.request({protocol, endpoint, payload});
  }

  /**
   * Synchronize data between the active storage service and the defaults in the code.
   *
   * @param config
   *   Configuration to sync to the selected source.
   * @param source
   *   The source that needs to be synced.
   *
   * @returns
   *   The result of the data being synchronized with the provided source endpoint.
   */
  public async sync(config: {}, source: string): Promise<{}> {
    // Await initial fetch of data that may already exist.
    const dbConfig: {} = await this.get(source);

    // If the configuration already exists, we'll want to sync the provided configuration with the source.
    // We merge both together. This MIGHT NOT be necessary? But it works for now.
    if (!Sojiro.isEmpty(dbConfig)) {
      return {...config, ...dbConfig};
    }

    // Await creation of database entry for the configuration, since it doesn't exist.
    await this.post(source, config);

    return config;
  }

  /**
   * Process a UPDATE request using the storage service.
   *
   * @param endpoint
   *   Path to push data to.
   * @param payload
   *   Data to update at the endpoint.
   *
   * @returns
   *   The resulting state of the data that was updated, if applicable.
   */
  public async update(endpoint: string, payload: {}): Promise<{} | undefined> {
    // Await UPDATE request of the Storage Service.
    return this.request({protocol: "update", endpoint, payload});
  }

}
