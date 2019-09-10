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
const fs = require("fs");
const fs_readfile_promise_1 = require("fs-readfile-promise");
const js_yaml_1 = require("js-yaml");
const path = require("path");
// Imports.
const Igor_1 = require("./Igor");
/**
 * Provides a class that handles searching for files and directories in the app.
 *
 * Another name for this could be the FileManager.
 *
 * Akechi is a detective. He'll handle all the file management and searching for
 * this application.
 *
 * He may have been the villain...But I love the guy.
 */
class Akechi {
    /**
     * Create a directory at a given path.
     *
     * @param path
     *   Path to create directory in.
     */
    static createDirectory(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
        });
    }
    /**
     * Create a directory at a given path.
     *
     * @param path
     *   Path to create directory in.
     *
     * @returns
     *   Returns TRUE if the directory exists, FALSE otherwise.
     */
    // static directoryExists(path: string): boolean {
    //   if (fs.existsSync(path) && !this.isDirectory(path)){
    //     return false;
    //   }
    //
    //   return fs.existsSync(path);
    // }
    /**
     * Create a directory at a given path.
     *
     * @param path
     *   Path to create directory in.
     *
     * @returns
     *   Returns TRUE if the file exists, FALSE otherwise.
     */
    static fileExists(path) {
        try {
            fs.statSync(path);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Simply read a file from a given path.
     *
     * @param path
     *   Path to the file to read.
     *
     * @returns
     *   File data obtained, if any.
     */
    static readFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fs_readfile_promise_1.default(path);
        });
    }
    /**
     * Read a .yml file a return an object with the contents.
     *
     * @param filePath
     *   Path of the file to read.
     *
     * @returns
     *   Returns yaml data from file if successful.
     */
    static readYamlFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            // Read the file data.
            let fileData = yield this.readFile(filePath);
            // Get document, or throw exception on error
            return js_yaml_1.default.safeLoad(fileData);
        });
    }
    /**
     * Write a .yml file a return an object with the contents.
     *
     * @param path
     *   Path to write the file to.
     *
     * @param output
     *   Output to write to the file.
     */
    static writeYamlFile(path, output) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!path.endsWith('.yml')) {
                path += '.yml';
            }
            fs.writeFile(path, js_yaml_1.default.safeDump(output), function (err) {
                if (err) {
                    Igor_1.default.throw(err).then(() => {
                        // Do nothing.
                    });
                }
            });
        });
    }
    /**
     * List directories in the provided source directory.
     *
     * @ref https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
     *
     * @param path
     *   The source directory to search in.
     *
     * @returns
     *   Return list of directories found at the given path.
     */
    static getDirectoriesFrom(path) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch directories from the requested path.
            return yield this.getFilesFrom(path, true);
        });
    }
    /**
     * Return a list of files from a source.
     *
     * @param source
     *   Source directory to search in.
     * @param dirs
     *   If this is true, only directories will be returned instead.
     *
     * @returns
     *   List of files (and/or directories) found at a given path.
     */
    static getFilesFrom(source, dirs = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the list of files.
            let files = fs.readdirSync(source).map(name => path.join(source, name));
            // Return directories if the flag is set.
            if (dirs === true) {
                return files.filter(path => this.isDirectory(path) === true);
            }
            return files.filter(path => this.isDirectory(path) === false);
        });
    }
    /**
     * Check if a source path is a directory.
     *
     * @param source
     *   Path of the source file to check.
     * @returns
     *   Returns true if the source is a directory, returns false otherwise.
     */
    static isDirectory(source) {
        try {
            return fs.lstatSync(source).isDirectory();
        }
        catch (error) {
            return false;
        }
    }
}
exports.default = Akechi;
