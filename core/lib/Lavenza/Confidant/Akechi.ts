/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as fs from "fs";
import * as fsrfp from "fs-readfile-promise";
import * as yaml from "js-yaml";
import { ncp } from "ncp";
import * as path from "path";

// Imports.
import { Igor } from "./Igor";

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
export class Akechi {

  /**
   * Create a directory at a given path.
   *
   * @param directoryPath
   *   Path to create directory in.
   */
  public static async createDirectory(directoryPath: string): Promise<void> {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath);
    }
  }

  /**
   * Copy a path recursively using the ncp module.
   */
  public static copyFiles(source: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ncp(`${source}/resources/desk`, destination, async (err) => {
        if (err) {
          reject();
        }
        resolve();
      });
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
  public static directoryExists(directoryPath: string): boolean {
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
  public static fileExists(filePath: string): boolean {
    try {
      fs.statSync(filePath);

      return true;
    } catch (err) {
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
  public static async readFile(filePath: string): Promise<Buffer> {
    return fsrfp(filePath);
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
  public static async readYamlFile(filePath: string): Promise<{}> {
    // Read the file data.
    const fileData: Buffer = await Akechi.readFile(filePath);

    // Get document, or throw exception on error
    return yaml.safeLoad(fileData);
  }

  /**
   * Write a .yml file a return an object with the contents.
   *
   * @param filePath
   *   Path to write the file to.
   * @param output
   *   Output to write to the file.
   */
  public static async writeYamlFile(filePath: string, output: {}): Promise<void> {
    // Variable to store true file path.
    let realFilePath: string = filePath;
    if (!realFilePath.endsWith(".yml")) {
      realFilePath += ".yml";
    }

    fs.writeFile(realFilePath, yaml.safeDump(output), (err: Error) => {
      if (err) {
        Igor.throw(err)
          .then(() => {
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
   * @param directoryPath
   *   The source directory to search in.
   *
   * @returns
   *   Return list of directories found at the given path.
   */
  public static async getDirectoriesFrom(directoryPath: string): Promise<string[] | undefined> {
    // Fetch directories from the requested path.
    return Akechi.getFilesFrom(directoryPath, true);
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
  public static async getFilesFrom(source: string, dirs: boolean = false): Promise<string[] | undefined> {
    // Get the list of files.
    const files: string[] = fs.readdirSync(source)
      .map((name: string) => path.join(source, name));

    // Return directories if the flag is set.
    if (dirs === true) {
      return files.filter((dirPath: string) => Akechi.isDirectory(dirPath) === true);
    }

    return files.filter((filePath: string) => Akechi.isDirectory(filePath) === false);
  }

  /**
   * Check if a source path is a directory.
   *
   * @param source
   *   Path of the source file to check.
   * @returns
   *   Returns true if the source is a directory, returns false otherwise.
   */
  public static isDirectory(source: string): boolean {
    try {
      return fs.lstatSync(source)
        .isDirectory();
    } catch (error) {
      return false;
    }
  }

}
