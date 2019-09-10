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
/**
 * Provides a base abstract class for Storage Services.
 *
 * Storage Services are mediums to store application data. Gestalt will use these storage services.
 *
 * Storage services must implement REST methods for manipulation of data.
 */
class StorageService {
    /**
     * StorageService constructor.
     */
    constructor() {
        // Do nothing for now. :O
    }
    /**
     * Make a request to the database.
     *
     * @param {string} protocol
     *   The protocol we want to use.
     *   The are four: GET, POST, UPDATE, DELETE.
     *    - GET: Fetch and retrieve data from a path/endpoint.
     *    - POST: Create data at a path/endpoint.
     *    - UPDATE: Adjust data at a path/endpoint.
     *    - DELETE: Remove data at a path/endpoint.
     * @param {string} endpoint
     *   The string path/endpoint of where to apply the protocol.
     * @param {Object} payload
     *   The data, if needed, to apply the protocol. GET/DELETE will not need a payload.
     *
     * @returns
     *   The result of the protocol call, if applicable.
     */
    request({ protocol = '', endpoint = '', payload = {} } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Depending on the protocol, we run different methods.
            switch (protocol) {
                // GET Protocol.
                case 'get': {
                    // Await GET request of the Storage Service.
                    return yield this.get(endpoint);
                }
                // POST Protocol.
                case 'post': {
                    // Await POST request of the Storage Service.
                    return yield this.post(endpoint, payload);
                }
                // UPDATE Protocol.
                case 'update': {
                    // Await UPDATE request of the Storage Service.
                    return yield this.update(endpoint, payload);
                }
                // DELETE Protocol.
                case 'delete': {
                    // Await DELETE request of the Storage Service.
                    return yield this.delete(endpoint);
                }
            }
        });
    }
}
exports.default = StorageService;
