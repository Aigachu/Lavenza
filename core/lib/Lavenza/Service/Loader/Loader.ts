/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Service } from "../Service";

/**
 * Provides an abstract class for special services that are used to discover and load files.
 *
 * Each class that extends this one must specify what kind of data will be returned after loading.
 */
export abstract class Loader<T> extends Service {

  /**
   * Crawl the provided root path and process items found in it.
   *
   * For each item found, we'll run the process() function and return the results.
   *
   * Each loader must specify actions to undertake when loading a given path.
   *
   * @param root
   *   Path to load from.
   *
   * @return
   *   Loaded items from this path, after going through the process() function.
   */
  public abstract async load(root: string): Promise<T[]>;

  /**
   * Process an item from the loaded root path.
   *
   * Each loader must specify what kind of processing happens for each item found in a path.
   */
  public abstract async process(itemPath: string): Promise<T>;

}
