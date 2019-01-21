/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import fs from 'fs';
import fsrfp from 'fs-readfile-promise';
import yaml from 'js-yaml';
import path from 'path';

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
export default class Akechi {

  /**
   * Create a directory at a given path.
   *
   * @param {string} path
   *   Path to create directory in.
   * @returns {Promise<void>}
   */
  static async createDirectory(path) {
    if (!fs.existsSync(path)){
      fs.mkdirSync(path);
    }
  }

  /**
   * Create a directory at a given path.
   *
   * @param {string} path
   *   Path to create directory in.
   * @returns {boolean}
   */
  static directoryExists(path) {
    if (fs.existsSync(path) && !this.isDirectory(path)){
      return false;
    }

    return fs.existsSync(path);

  }

  /**
   * Create a directory at a given path.
   *
   * @param {string} path
   *   Path to create directory in.
   * @returns {boolean}
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
   * @param {string} path
   *   Path to the file to read.
   */
  static async readFile(path) {
    return await fsrfp(path);
  }

  /**
   * Read a .yml file a return an object with the contents.
   *
   * @param file
   *   Path of the file to read.
   *
   * @returns {*|void}
   *   Returns object if successful.
   */
  static async readYamlFile(file) {

    // Read the file data.
    let fileData = await this.readFile(file);

    // Get document, or throw exception on error
    return yaml.safeLoad(fileData);

  }

  /**
   * Write a .yml file a return an object with the contents.
   *
   * @param {string} path
   *   Path to write the file to.
   *
   * @param {Object} output
   *   Output to write to the file.
   */
  static async writeYamlFile(path, output) {

    if (!path.endsWith('.yml')) {
      path += '.yml';
    }

    fs.writeFile(path, yaml.safeDump(output), function(err) {
      if (err) {
        Lavenza.Igor.throw(err);
      }
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
   * @returns {Promise<*>}
   */
  static async getDirectoriesFrom(path) {

    // Fetch directories from the requested path.
    return await this.getFilesFrom(path, true);

  }

  /**
   * Return a list of files from a source.
   *
   * @param source
   *   Source directory to search in.
   * @param dirs
   *   If this is true, directories will be returned instead.
   */
  static async getFilesFrom(source, dirs = false) {

    // Get the list of files.
    let files = fs.readdirSync(source).map(name => path.join(source, name));

    // Return directories if the flag is set.
    if (dirs === true) {
      return files.filter(path => this.isDirectory(path) === true);
    }

    return files.filter(path => this.isDirectory(path) === false);
  }

  /**
   * Check if a source path is a directory.
   *
   * @param source
   *   Path of the source file to check.
   * @returns {*}
   *   Returns true if the source is a directory, returns false otherwise.
   */
  static isDirectory(source) {
    try {
      return fs.lstatSync(source).isDirectory();
    } catch(error) {
      return false;
    }
  }

}