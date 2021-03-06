/**
 * Project Lavenza
 * Copyright 2017-2019 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */

// Modules.
import * as thesaurus from "thesaurus-com";
import * as _ from "underscore";

/**
 * Provides a class that handles input/output to the console & errors.
 *
 * Another name for this could be the HelperManager.
 *
 * So Sojiro basically housed us and provided us with the essentials to live in Persona 5.
 *
 * Here, he's providing us with the utilities to make our life easier.
 *
 * Thanks Daddy Sojiro!
 */
export class Sojiro {

  /**
   * Checks if the given text is considered an approval or confirmation.
   *
   * @param text
   *   The given text to check.
   *
   * @returns
   *   Returns TRUE if it's considered an approval. Returns FALSE otherwise.
   */
  public static async isConfirmation(text: string): Promise<boolean> {
    // Variable to store clean text.
    let cleanText: string = text;

    // Clean punctuation.
    cleanText = cleanText.replace("?", "");
    cleanText = cleanText.replace("!", "");
    cleanText = cleanText.replace(".", "");
    cleanText = cleanText.replace(",", "");

    // Make a function to store a confirmation.
    let confirmation: boolean = false;

    // Store an array of all confirmation words we'd like to check for.
    const confirmations: string[] = [
      "yes",
      "sure",
      "okay",
    ];

    // Set up Promises for the confirmations check.
    const confirmationPromises = confirmations.map(async (word) =>
      new Promise(async (resolve, reject) => {
        // Check whether we find a word match.
        const match: boolean = await Sojiro.findWordMatch(word, cleanText);
        if (match) {
          confirmation = true;
          // We reject to end Promise.all() early.
          reject();
        }
      }));

    // Store an array of all denial words.
    const denials: string[] = [
      "no",
      "deny",
    ];

    // Set up Promises for the confirmations check.
    const denialPromises = denials.map(async (word) =>
      new Promise(async (resolve, reject) => {
        // Check whether we find a word match.
        const match: boolean = await Sojiro.findWordMatch(word, cleanText);
        if (match) {
          confirmation = false;
          // We reject to end Promise.all() early.
          reject();
        }
      }));

    // For each of these words we'll be making checks to see if they're used, or if synonyms are used.
    await Promise.all(confirmationPromises.concat(denialPromises))
      .catch(async () => {
      // Do nothing.
      // We're expecting rejection here since we don't necessarily want to run all of them if we find a match.
      // See if Promise.race() worked properly, we could use it here. But it would return a pending promise that never
      // Resolves if we don't find any matches.
    });

    // Return the confirmation.
    return confirmation;
  }

  /**
   * Attempts to find a word match in a string (haystack).
   *
   * This will have an additional check for synonyms of the word as well.
   *
   * @param word
   *   Word to look for.
   * @param haystack
   *   The string to search for the word in.
   */
  public static async findWordMatch(word: string, haystack: string): Promise<boolean> {
    // If the haystack is equivalent to the word 'yes', return true.
    if (haystack === word) {
      return true;
    }

    // If the haystack contains the word, return true.
    if (haystack.split(" ")
      .includes(word)) {
      return true;
    }

    // Get the synonyms of the word.
    const synonyms: string[] = await thesaurus.search(word).synonyms;

    // If we find a synonym of the word in the text, return true.
    if (!Sojiro.isEmpty(synonyms) && new RegExp(synonyms.join("|")).test(haystack)) {
      return true;
    }

    // Otherwise, no match was found and we can return false.
    return false;
  }

  /**
   * Check if an array has objects with duplicates.
   *
   * @param array
   *   Array to check.
   *
   * @param uprop
   *   Unique proper
   */
  public static arrayHasDuplicates<T>(array: T[], uprop: string): boolean {
    const seen = new Set();

    return array.some((currentObject) => seen.size === seen.add(currentObject[uprop]).size);
  }

  /**
   * Utility function to return a random element from a given array.
   *
   * Self-Explanatory.
   *
   * @param array
   *   Array to get random element from.
   *
   * @returns
   *   Returns a random element from the provided array.
   */
  public static getRandomElementFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Utility function to remove a targeted element from an array.
   *
   * @param array
   *   Array to remove an element from.
   * @param element
   *   Element to be removed.
   */
  public static removeFromArray<T>(array: T[], element: T): T[] {
    return array.filter((e: T) => e !== element);
  }

  /**
   * Utility function to check if a variable is empty.
   *
   * @param variable
   *   Variable to check.
   *
   * @returns
   *   Returns TRUE if empty, false otherwise.
   */
  public static isEmpty<T>(variable: T): boolean {
    // So underscore is cool and all...
    // BUT any FUNCTION passed to its isEmpty() function evaluates to TRUE for...I don't know what reason.
    // Here we handle this case.
    if (typeof variable === "function") {
      return false;
    }

    // If it's not a function, underscore SHOULD cover the rest of the cases.
    return _.isEmpty(variable);
  }

  /**
   * Utility function to wait a given amount of time.
   *
   * @param seconds
   *   The amount of seconds to wait for.
   *
   * @returns
   *   Returns a Promise you can use to chain code execution.
   */
  public static wait(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

}
