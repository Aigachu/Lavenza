"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports.
const BotManager_1 = require("../Bot/BotManager");
const Morgana_1 = require("../Confidant/Morgana");
const Sojiro_1 = require("../Confidant/Sojiro");
const TalentManager_1 = require("../Talent/TalentManager");
const Chronicler_1 = require("./StorageService/Chronicler/Chronicler");
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
class Gestalt {
    /**
     * Bootstrap the database.
     *
     * This creates all database entries needed for the application to function properly.
     */
    static bootstrap() {
        return __awaiter(this, void 0, void 0, function* () {
            // Creation of i18n collection.
            // All data pertaining to translations will be saved here.
            yield Gestalt.createCollection("/i18n");
            // Bootstrap Database tables/files for bots.
            yield BotManager_1.BotManager.gestalt();
            // Bootstrap Database tables/files for talents.
            yield TalentManager_1.TalentManager.gestalt();
            // Some flavor text for the console.
            yield Morgana_1.Morgana.success("Gestalt database successfully bootstrapped!");
        });
    }
    /**
     * Gestalt is a static singleton. This function will handle the preparations.
     */
    static build() {
        return __awaiter(this, void 0, void 0, function* () {
            // The default storage service is the Chronicler.
            /** @see ./StorageService/Chronicler/Chronicler */
            // @TODO - Dynamic selection of StorageService instead of having to save it here.
            //  Maybe .env variables? Or a configuration file at the root of the application.
            const storageService = new Chronicler_1.Chronicler();
            // Await the build process of the storage service and assign it to Gestalt.
            yield storageService.build();
            Gestalt.storageService = storageService;
            // Some flavor text.
            yield Morgana_1.Morgana.success("Gestalt preparations complete!");
        });
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
    static createCollection(endpoint, payload = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Each storage service creates collections in their own way. We await this process.
            yield Gestalt.storageService.createCollection(endpoint, payload);
        });
    }
    /**
     * Process a DELETE request using the storage service.
     *
     * @param endpoint
     *   Path to delete data at.
     */
    static delete(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            // Await DELETE request of the Storage Service.
            yield Gestalt.request({ protocol: "delete", endpoint });
        });
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
    static get(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            // Await GET request of the Storage Service.
            return Gestalt.request({ protocol: "get", endpoint });
        });
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
    static post(endpoint, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // Await POST request of the Storage Service.
            return Gestalt.request({ protocol: "post", endpoint, payload });
        });
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
    static request({ protocol = "", endpoint = "", payload = {} } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Await the request function call of the storage service.
            return Gestalt.storageService.request({ protocol, endpoint, payload });
        });
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
    static sync(config, source) {
        return __awaiter(this, void 0, void 0, function* () {
            // Await initial fetch of data that may already exist.
            const dbConfig = yield Gestalt.get(source);
            // If the configuration already exists, we'll want to sync the provided configuration with the source.
            // We merge both together. This MIGHT NOT be necessary? But it works for now.
            if (!Sojiro_1.Sojiro.isEmpty(dbConfig)) {
                return Object.assign(Object.assign({}, config), dbConfig);
            }
            // Await creation of database entry for the configuration, since it doesn't exist.
            yield Gestalt.post(source, config);
            return config;
        });
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
    static update(endpoint, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // Await UPDATE request of the Storage Service.
            return Gestalt.request({ protocol: "update", endpoint, payload });
        });
    }
}
exports.Gestalt = Gestalt;
