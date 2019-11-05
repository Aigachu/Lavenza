/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Imports.
import { Sojiro } from "../../Confidant/Sojiro";
import { Service } from "../Service";

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
  protected repository: T[];

  /**
   * Sections for this catalogue.
   *
   * This will store different 'sections' for this catalogue, adding the ability to organize objects into categories or
   * sections.
   */
  private sections: Map<string, T[]>;

  /**
   * Retrieve a full list of all items, regardless of storage.
   */
  public all(): T[] {
    return this.repository;
  }

  /**
   * Retrieve one of the items with a provided predicate.
   *
   * @param predicate
   *   Function to use to filter the items we want to retrieve.
   * @param section
   *   The section to search in, if specified.
   */
  public find(predicate: (item: T) => {}, section?: string): T {
    // If the section is specified, we'd like to fetch only from the subset of objects that are within that section.
    if (section) {
      if (!this.sections.get(section)) { return; }
      const objectsToRetrieveFrom = this.sections.get(section);

      return objectsToRetrieveFrom.find(predicate);
    }

    // If the repository is just an array, just return it.
    return this.repository.find(predicate);
  }

  /**
   * Retrieve many items given the provided predicate.
   *
   * @param predicate
   *   Function to use to filter the items we want to retrieve.
   * @param section
   *   The section to retrieve from, if specified.
   */
  public retrieve(predicate: (item: T) => {}, section?: string): T[] {
    // If the section is specified, we'd like to fetch only from the subset of objects that are within that section.
    if (section) {
      if (!this.sections.get(section)) { return; }
      const objectsToRetrieveFrom = this.sections.get(section);

      return objectsToRetrieveFrom.filter(predicate);
    }

    // If no section is specified, we simply filter through the repository.
    return this.repository.filter(predicate);
  }

  /**
   * Add an element into a storage.
   *
   * @param payload
   *   The item(s) to add.
   * @param section
   *   Section to update if need be.
   */
  public async store(payload: T | T[], section?: string): Promise<void> {
    // If the payload is not an array, we put it in one.
    if (!(payload instanceof Array)) {
      payload = [payload];
    }

    // First, we push the object into the repository.
    this.repository = [...this.repository, ...payload];

    // If a section is specified, we'll add the payload to the appropriate section.
    if (section) {
      if (!this.sections.get(section)) { return; }
      const currentSectionList = this.sections.get(section) || [];
      this.sections.set(section, [...currentSectionList, ...payload]);
    }
  }

  /**
   * Remove an item from the repository.
   *
   * @param item
   *   Item to remove from the storage
   * @param section
   *   Section to remove from.
   */
  public async pop(item: T, section?: string): Promise<void> {
    // If a section is specified, only remove the object from the section.
    if (section) {
      // If the section doesn't exists, we can't do anything.
      if (!this.sections.get(section)) { return; }
      const currentSectionList = this.sections.get(section);
      await Sojiro.removeFromArray(currentSectionList, item);

      return;
    }

    // Remove the item from the repository itself and all sections.
    await Sojiro.removeFromArray(this.repository, item);
    this.sections.forEach(async (sectionArray) => Sojiro.removeFromArray(sectionArray, item));
  }

}
