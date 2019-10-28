"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
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
const path = require("path");
// Imports.
const Akechi_1 = require("../../../../Confidant/Akechi");
const Item_1 = require("../Item/Item");
/**
 * Provides a model to manage directories for the Chronicler.
 */
class Collection {
    /**
     * Collection constructor.
     *
     * @param directoryPath
     *   Path to the directory to wrap this collection around.
     */
    constructor(directoryPath) {
        this.path = directoryPath;
    }
    /**
     * Return the values of the directory, formatted in an object.
     *
     * @returns
     *   The formatted data.
     */
    values() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize the object that will store all of the data.
            const data = {};
            // Get all files & directories from directory.
            const directories = yield Akechi_1.Akechi.getDirectoriesFrom(this.path);
            const files = yield Akechi_1.Akechi.getFilesFrom(this.path);
            // Await the processing of all the directories found.
            yield Promise.all(directories.map((directory) => __awaiter(this, void 0, void 0, function* () {
                // We basically create a collection with the directory and parse it's data, calling this function recursively.
                const name = path.basename(directory);
                const collection = new Collection(directory);
                data[name] = yield collection.values();
            })));
            // Await the processing of the all the files found.
            yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                // We basically create an item with the file and parse it's data, calling this function recursively.
                const name = path.basename(file)
                    .replace(".yml", "");
                const item = new Item_1.Item(file);
                data[name] = yield item.values();
            })));
            // Return all of the formatted data.
            return data;
        });
    }
}
exports.Collection = Collection;
