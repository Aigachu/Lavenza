/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as fs from 'fs';
import * as fsrfp from 'fs-readfile-promise';
import * as yaml from 'js-yaml';
import * as path from 'path';

// Imports.
import Igor from './Igor';

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
   * @param path
   *   Path to create directory in.
   */
  static async createDirectory(path: string) {
    if (!fs.existsSync(path)){
      fs.mkdirSync(path);
    }
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
  static fileExists(path: string): boolean {
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
  static async readFile(path: string): Promise<any> {
    return await fsrfp(path);
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
  static async readYamlFile(filePath: string): Promise<any> {
    // Read the file data.
    let fileData = await this.readFile(filePath);

    // Get document, or throw exception on error
    return yaml.safeLoad(fileData);
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
  static async writeYamlFile(path: string, output: Object) {
    if (!path.endsWith('.yml')) {
      path += '.yml';
    }

    fs.writeFile(path, yaml.safeDump(output), function(err) {
      if (err) {
        Igor.throw(err).then(() => {
          // Do nothing.
        });
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
   * @returns
   *   Return list of directories found at the given path.
   */
  static async getDirectoriesFrom(path: string): Promise<Array<string>|undefined> {
    // Fetch directories from the requested path.
    return await this.getFilesFrom(path, true);
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
  static async getFilesFrom(source: string, dirs = false): Promise<Array<string>|undefined> {
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
   * @returns
   *   Returns true if the source is a directory, returns false otherwise.
   */
  static isDirectory(source): boolean {
    try {
      return fs.lstatSync(source).isDirectory();
    } catch(error) {
      return false;
    }
  }

}