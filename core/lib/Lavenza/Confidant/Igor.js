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
// Imports.
const Morgana_1 = require("./Morgana");
const Yoshida_1 = require("./Yoshida");
/**
 * Provides a class that handles errors.
 *
 * Another name for this could be the ErrorManager.
 *
 * When you die, you're brought back by Igor...
 *
 * He handles errors in the application.
 */
class Igor {
    /**
     * Pocket the error, ignoring it and continuing execution without outputting anything to the console.
     *
     * Only do this in specific cases. You don't wanna pocket everything and not know about errors.
     *
     * @param error
     *   The error caught.
     */
    static pocket(error) {
        return __awaiter(this, void 0, void 0, function* () {
            // Do nothing. This quietly ignores the error.
            // Not really advised...Though I had couple of use cases for it. Still, not recommended!
            // console.log('Error pocketed: ' + error.message);
        });
    }
    /**
     * Catch the error and output to the console, but continue code execution.
     *
     * Only use this in cases where the code following the error will still run without big issues.
     *
     * @param error
     *   The error caught.
     *
     * @returns
     *   Returns true for cases where it's used in functions that need a return value. @TODO - YOU MIGHT BE ABLE TO REMOVE THE RETURN. TEST IT.
     */
    static continue(error) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sends a warning to the console.
            yield Morgana_1.Morgana.warn(error.message);
            return true;
        });
    }
    /**
     * Catch the error, output to the console and stop the application.
     *
     * Used for errors that will f*ck sh*t up.
     *
     * @param error
     *   The error caught.
     */
    static stop(error) {
        return __awaiter(this, void 0, void 0, function* () {
            // Output the error with Morgana's color formatting.
            yield Morgana_1.Morgana.error(error.message);
            // Regular outputting of the error.
            console.error(error);
            // Exit the application.
            process.exit(1);
        });
    }
    /**
     * Throws an error with a custom message.
     *
     * @param error
     *   The error caught.
     * @param replacers
     *   If an array of strings is set here, it will be used to replace any
     *   placeholders in the text provided above.
     * @param locale
     *   Locale determining the language to send the error in.
     */
    static throw(error, replacers = undefined, locale = process.env.CONSOLE_LOCALE) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the error is an instance of the error class, simply throw it.
            if (error instanceof Error) {
                throw error;
            }
            // Get the output's translation.
            let output = yield Yoshida_1.Yoshida.translate(error, replacers, locale);
            // Throw the error with the built output.
            throw new Error(output);
        });
    }
}
exports.Igor = Igor;
