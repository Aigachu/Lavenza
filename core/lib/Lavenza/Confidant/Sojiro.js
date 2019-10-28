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
const thesaurus = require("thesaurus-com");
const _ = require("underscore");
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
class Sojiro {
    /**
     * Checks if the given text is considered an approval or confirmation.
     *
     * @param text
     *   The given text to check.
     *
     * @returns
     *   Returns TRUE if it's considered an approval. Returns FALSE otherwise.
     */
    static isConfirmation(text) {
        return __awaiter(this, void 0, void 0, function* () {
            // Variable to store clean text.
            let cleanText = text;
            // Clean punctuation.
            cleanText = cleanText.replace("?", "");
            cleanText = cleanText.replace("!", "");
            cleanText = cleanText.replace(".", "");
            cleanText = cleanText.replace(",", "");
            // Make a function to store a confirmation.
            let confirmation = false;
            // Store an array of all confirmation words we'd like to check for.
            const confirmations = [
                "yes",
                "sure",
                "okay",
            ];
            // Set up Promises for the confirmations check.
            const confirmationPromises = confirmations.map((word) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    // Check whether we find a word match.
                    const match = yield Sojiro.findWordMatch(word, cleanText);
                    if (match) {
                        confirmation = true;
                        // We reject to end Promise.all() early.
                        reject();
                    }
                }));
            }));
            // Store an array of all denial words.
            const denials = [
                "no",
                "deny",
            ];
            // Set up Promises for the confirmations check.
            const denialPromises = denials.map((word) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    // Check whether we find a word match.
                    const match = yield Sojiro.findWordMatch(word, cleanText);
                    if (match) {
                        confirmation = false;
                        // We reject to end Promise.all() early.
                        reject();
                    }
                }));
            }));
            // For each of these words we'll be making checks to see if they're used, or if synonyms are used.
            yield Promise.all(confirmationPromises.concat(denialPromises))
                .catch(() => __awaiter(this, void 0, void 0, function* () {
                // Do nothing.
                // We're expecting rejection here since we don't necessarily want to run all of them if we find a match.
                // See if Promise.race() worked properly, we could use it here. But it would return a pending promise that never
                // Resolves if we don't find any matches.
            }));
            // Return the confirmation.
            return confirmation;
        });
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
    static findWordMatch(word, haystack) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const synonyms = yield thesaurus.search(word).synonyms;
            // If we find a synonym of the word in the text, return true.
            if (!Sojiro.isEmpty(synonyms) && new RegExp(synonyms.join("|")).test(haystack)) {
                return true;
            }
            // Otherwise, no match was found and we can return false.
            return false;
        });
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
    static getRandomElementFromArray(array) {
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
    static removeFromArray(array, element) {
        return array.filter((e) => e !== element);
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
    static isEmpty(variable) {
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
    static wait(seconds) {
        return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }
}
exports.Sojiro = Sojiro;
