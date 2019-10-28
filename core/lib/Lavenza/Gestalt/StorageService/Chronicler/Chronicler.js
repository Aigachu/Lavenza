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
// Modules.
const lodash = require("lodash");
// Imports.
const Akechi_1 = require("../../../Confidant/Akechi");
const Sojiro_1 = require("../../../Confidant/Sojiro");
const Core_1 = require("../../../Core/Core");
const StorageService_1 = require("../StorageService");
const Collection_1 = require("./Collection/Collection");
const Item_1 = require("./Item/Item");
/**
 * Chronicler is the default Storage Service used by Gestalt & Lavenza.
 *
 * Chronicler will quite simply read/write to/from a 'database' folder located at the root of the application. Objects
 * will be stored in .yml files and read from them as well.
 *
 */
class Chronicler extends StorageService_1.StorageService {
    /**
     * This function will handle build preparations for Chronicler.
     *
     * @inheritDoc
     */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            this.root = `${Core_1.Core.paths.root}/database`;
        });
    }
    /**
     * Create collection using the Chronicler.
     *
     * @TODO - Handle creation of a payload with existing data. Handle Objects as well to created nested collections.
     *
     * @inheritDoc
     */
    createCollection(endpoint, payload = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prepend database path to the requested endpoint.
            // We have to do it here since this function doesn't pass through the main request() function.
            const directoryPath = this.root + endpoint;
            // Await creation of a directory at the path.
            yield Akechi_1.Akechi.createDirectory(directoryPath);
        });
    }
    /**
     * Delete file at the path.
     *
     * @TODO - Finish this.
     *
     * @inheritDoc
     */
    delete(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error("Oh...Delete isn't ready yet haha. AIGACHU. FINISH YOUR WORK.");
        });
    }
    /**
     * Get data from a path at the endpoint.
     *
     * @inheritDoc
     */
    get(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            // First we check if the requested path is a file. If it is, we await the returning of its values.
            if (yield Akechi_1.Akechi.fileExists(`${endpoint}.yml`)) {
                const item = new Item_1.Item(`${endpoint}.yml`);
                return item.values();
            }
            // If it's not a file, then we'll check if it's a directory. If so, await return of its values.
            if (Akechi_1.Akechi.isDirectory(endpoint)) {
                const collection = new Collection_1.Collection(endpoint);
                return collection.values();
            }
            // If nothing was found, return an empty object.
            return {};
        });
    }
    /**
     * Create a file at the path.
     *
     * @TODO - Handle Collections and Objects as well to create folders and files.
     *
     * @inheritDoc
     */
    post(endpoint, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // We simply create a YAML file. We await this process.
            yield Akechi_1.Akechi.writeYamlFile(endpoint, payload);
            return undefined;
        });
    }
    /**
     * Chronicler alters the endpoints when requests are made.
     *
     * We need to make sure that the root of the database, /database in this app, is prepended to all path requests.
     *
     * @inheritDoc
     */
    request({ protocol = "", endpoint = "", payload = {} } = {}) {
        const _super = Object.create(null, {
            request: { get: () => super.request }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // Variable to store the actual endpoint.
            let realEndpoint = endpoint;
            // If the endpoint doesn't start with the database root, prepend it to the path.
            if (!realEndpoint.startsWith(this.root)) {
                realEndpoint = this.root + realEndpoint;
            }
            // Await the execution of the regular request process.
            return _super.request.call(this, { protocol, endpoint: realEndpoint, payload });
        });
    }
    /**
     * Update the file at the path.
     *
     * @TODO - Handle Collections as well.
     *
     * @inheritDoc
     */
    update(endpoint, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, we use Chronicler's get method to get the data.
            let data = yield this.get(endpoint);
            // If no data was found, make sure the data is an empty object.
            if (Sojiro_1.Sojiro.isEmpty(data)) {
                data = {};
            }
            // We use lodash to merge the payload containing the updates, with the original data.
            const updatedData = lodash.merge(data, payload);
            // Finally, we post the new merged data back to the same endpoint.
            yield this.post(endpoint, updatedData);
            // We return the newly merged data.
            // We do another request here. The idea is we want to make sure the data in the file is right.
            // Might change this in the future since the update request actually does 3 requests...But eh.
            return this.get(endpoint);
        });
    }
}
exports.Chronicler = Chronicler;
