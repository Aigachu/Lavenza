/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza/blob/master/LICENSE
 */

/**
 * Provides a class that handles searching for files and directories in the app.
 *
 * Akechi is a detective. He'll handle all the file management and searching for
 * this application.
 *
 * He may have been the villain...But I love the guy.
 */
class Akechi {

  /**
   * Read a .yml file a return an object with the contents.
   *
   * @param file
   *   Path of the file to read.
   *
   * @returns {*|void}
   *   Returns object if successful.
   */
  static readYamlFile(file) {
    // Get document, or throw exception on error
    try {
      return Packages.yaml.safeLoad(Packages.fs.readFileSync(file, 'utf8'));
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /**
   * List directories in the provided source directory.
   *
   * @ref https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
   *
   * @param path
   *   The source directory to search in.
   */
  static getDirectoriesFrom(path) {
    return this.getFilesFrom(path, true);
  }

  /**
   * Return a list of files from a source.
   *
   * @param source
   *   Source directory to search in.
   * @param dirs
   *   If this is true, directories will be returned instead.
   */
  static getFilesFrom(source, dirs = false) {

    // Get the list of files.
    let files = Packages.fs.readdirSync(source).map(name => Packages.path.join(source, name));

    // Return directories if the flag is set.
    if (dirs === true) {
      return files.filter(this.isDirectory);
    }

    return files;
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
    return Packages.fs.lstatSync(source).isDirectory();
  }

}

module.exports = Akechi;
