/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as lodash from "lodash";

// Imports.
import { Sojiro } from "../../Confidant/Sojiro";
import { Service } from "../Service";

import { Library } from "./Library";

/**
 * Provides a base class for Catalogues.
 *
 * Catalogues are classes that handle storage & retrieval of specified objects.
 */
export abstract class Catalogue<T> extends Service {

  /**
   * Repository for this catalogue.
   *
   * The repository is an array containing the full list of objects that the catalogue will store.
   */
  protected repository: T[] = [];

  /**
   * Libraries for this catalogue.
   *
   * This will store different 'libraries' for this catalogue, adding the ability to organize objects into different
   * spaces.
   *
   * A concrete example would be a FoodCatalogue. You store Food items in it. When you store Food items, you can tag
   * it with different Libraries to store it in, such as 'fruits' if the Food you're storing is a Fruit.
   */
  protected libraries: Array<Library<T>>;

  /**
   * Retrieve a full list of all items, regardless of storage.
   */
  public all(): T[] {
    return this.repository;
  }

  /**
   * Retrieve a subset of the catalogue given a unique library ID.
   *
   * @param id
   *   The id of the library to retrieve.
   */
  public library(id: string): T[] {
    return this.libraries.find((library: Library<T>) => library.id === id).objects || undefined;
  }

  /**
   * Retrieve one of the items with a provided predicate.
   *
   * @param predicate
   *   Function to use to filter the items we want to retrieve.
   * @param library
   *   The library to search in, if specified.
   */
  public find(predicate: (item: T) => {}, library?: string): T {
    // If the library is specified, we'd like to fetch only from the subset of objects that are within that library.
    if (library) {
      if (!this.library(library)) {
        return;
      }

      return this.library(library).find(predicate);
    }

    // Otherwise, search in the full repository.
    return this.repository.find(predicate);
  }

  /**
   * Retrieve many items given the provided predicate.
   *
   * @param predicate
   *   Function to use to filter the items we want to retrieve.
   * @param library
   *   The library to retrieve from, if specified.
   */
  public retrieve(predicate: (item: T) => {}, library?: string): T[] {
    // If the section is specified, we'd like to fetch only from the subset of objects that are within that section.
    if (library) {
      if (!this.library(library)) {
        return;
      }

      return this.library(library).filter(predicate);
    }

    // If no library is specified, we simply filter through the full repository.
    return this.repository.filter(predicate);
  }

  /**
   * Add an element to a section in the catalogue.
   *
   * @param payload
   *   The item(s) to add.
   * @param library
   *   Section to update if need be.
   */
  public async assign(payload: T | T[], library: string): Promise<void> {
    // If the payload is not an array, we put it in one.
    if (!(payload instanceof Array)) {
      payload = [payload];
    }

    // We'll add the payload to the appropriate library.
    let currentObjectList = this.library(library) || [];
    currentObjectList = lodash.union([...currentObjectList, ...payload]);
    this.libraries.push({id: library, objects: currentObjectList});
  }

  /**
   * Remove an item from a section in the catalogue.
   *
   * @param item
   *   Item to remove.
   * @param library
   *   Library to remove from.
   */
  public async unassign(item: T, library: string): Promise<void> {
    // If the library doesn't exist, or is empty, we should just exit.
    if (!this.library(library) || await Sojiro.isEmpty(this.library(library))) {
      return;
    }
    const currentSectionList = this.library(library);
    await Sojiro.removeFromArray(currentSectionList, item);
  }

  /**
   * Add an element into a storage.
   *
   * @param payload
   *   The item(s) to add.
   * @param library
   *   Library to add items in.
   */
  public async store(payload: T | T[], library?: string): Promise<void> {
    // If the payload is not an array, we put it in one.
    if (!(payload instanceof Array)) {
      payload = [payload];
    }

    // First, we push the object into the repository.
    this.repository = lodash.union([...this.repository, ...payload]);

    // If a section is specified, we'll add the payload to the appropriate section.
    if (library) {
      let currentObjectList = this.library(library) || [];
      currentObjectList = lodash.union([...currentObjectList, ...payload]);
      this.libraries.push({id: library, objects: currentObjectList});
    }
  }

  /**
   * Remove an item from the catalogue.
   *
   * @param item
   *   Item to remove from the storage
   * @param library
   *   Library to remove from.
   */
  public async pop(item: T, library?: string): Promise<void> {
    // Remove the item from the repository itself and all sections.
    await Sojiro.removeFromArray(this.repository, item);
    this.libraries.forEach(async (lib) => Sojiro.removeFromArray(lib.objects, item));
  }

}
