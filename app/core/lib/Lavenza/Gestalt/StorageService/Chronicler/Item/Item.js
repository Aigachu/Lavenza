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
const Akechi_1 = require("../../../../Confidant/Akechi");
/**
 * Provides a model to manage YAML files in the Chronicler.
 */
class Item {
    /**
     * Item constructor.
     *
     * @param path
     *   Path to the file to wrap this item around.
     */
    constructor(path) {
        this.path = path;
    }
    /**
     * Return the values of the YAML file.
     *
     * @returns
     *   Returns the data parsed
     */
    values() {
        return __awaiter(this, void 0, void 0, function* () {
            // We expect a yml. We just reach the path.
            return yield Akechi_1.default.readYamlFile(this.path);
        });
    }
}
exports.default = Item;
