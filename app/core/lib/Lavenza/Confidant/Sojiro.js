"use strict";
/**
 * Project Lavenza
 * Copyright 2017-2018 Aigachu, All Rights Reserved
 *
 * License: https://github.com/Aigachu/Lavenza-II/blob/master/LICENSE
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Modules.
const underscore_1 = require("underscore");
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
        // Clean punctuation.
        text = text.replace('?', '');
        text = text.replace('!', '');
        text = text.replace('.', '');
        text = text.replace(',', '');
        let confirmationWords = [
            'yes',
            'yas',
            'affirmative',
            'y',
            'yus',
            'sure',
            'okay',
            'ok',
            'alright'
        ];
        if (text.startsWith('y')) {
            return true;
        }
        let splitText = text.split(' ');
        for (let word of splitText) {
            if (confirmationWords.includes(word.toLowerCase())) {
                return true;
            }
        }
        return false;
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
        return array.filter(e => e !== element);
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
        if (typeof variable === 'function') {
            return false;
        }
        // If it's not a function, underscore SHOULD cover the rest of the cases.
        return underscore_1.default.isEmpty(variable);
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
exports.default = Sojiro;
