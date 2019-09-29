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
const fsrfp = require("fs-readfile-promise");
const yaml = require("js-yaml");
const ncp_1 = require("ncp");
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
     * @param directoryPath
     *   Path to create directory in.
     */
    static createDirectory(directoryPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath);
            }
        });
    }
    /**
     * Copy a path recursively using the ncp module.
     */
    static copyFiles(source, destination) {
        return new Promise((resolve, reject) => {
            ncp_1.ncp(`${source}/resources/desk`, destination, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    reject();
                }
                resolve();
            }));
        });
    }
    /**
     * Create a directory at a given path.
     *
     * @param directoryPath
     *   Path to create directory in.
     *
     * @returns
     *   Returns TRUE if the directory exists, FALSE otherwise.
     */
    static directoryExists(directoryPath) {
        if (fs.existsSync(directoryPath) && !Akechi.isDirectory(directoryPath)) {
            return false;
        }
        return fs.existsSync(directoryPath);
    }
    /**
     * Create a directory at a given path.
     *
     * @param filePath
     *   Path to create directory in.
     *
     * @returns
     *   Returns TRUE if the file exists, FALSE otherwise.
     */
    static fileExists(filePath) {
        try {
            fs.statSync(filePath);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Simply read a file from a given path.
     *
     * @param filePath
     *   Path to the file to read.
     *
     * @returns
     *   File data obtained, if any.
     */
    static readFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return fsrfp(filePath);
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
            const fileData = yield Akechi.readFile(filePath);
            // Get document, or throw exception on error
            return yaml.safeLoad(fileData);
        });
    }
    /**
     * Write a .yml file a return an object with the contents.
     *
     * @param filePath
     *   Path to write the file to.
     * @param output
     *   Output to write to the file.
     */
    static writeYamlFile(filePath, output) {
        return __awaiter(this, void 0, void 0, function* () {
            // Variable to store true file path.
            let realFilePath = filePath;
            if (!realFilePath.endsWith(".yml")) {
                realFilePath += ".yml";
            }
            fs.writeFile(realFilePath, yaml.safeDump(output), (err) => {
                if (err) {
                    Igor_1.Igor.throw(err)
                        .then(() => {
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
     * @param directoryPath
     *   The source directory to search in.
     *
     * @returns
     *   Return list of directories found at the given path.
     */
    static getDirectoriesFrom(directoryPath) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch directories from the requested path.
            return Akechi.getFilesFrom(directoryPath, true);
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
            const files = fs.readdirSync(source)
                .map((name) => path.join(source, name));
            // Return directories if the flag is set.
            if (dirs === true) {
                return files.filter((dirPath) => Akechi.isDirectory(dirPath) === true);
            }
            return files.filter((filePath) => Akechi.isDirectory(filePath) === false);
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
            return fs.lstatSync(source)
                .isDirectory();
        }
        catch (error) {
            return false;
        }
    }
}
exports.Akechi = Akechi;
