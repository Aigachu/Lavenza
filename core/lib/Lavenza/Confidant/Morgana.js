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
const Yoshida_1 = require("./Yoshida");
/**
 * Provides a class that handles input/output to the console & errors.
 *
 * Another name for this could be the LoggerManager.
 *
 * My thought process? Well Morgana talks a lot in P5. So I named my console
 * manager after him. Clever right? Haha!
 *
 * Honestly I just needed an excuse to use their names in my code. And I love it.
 */
class Morgana {
    /**
     * Send output to the console.
     *
     * @param message
     *   The text to send to the console, or in some/most cases the ID of the
     *   string to send. If an ID is sent, text will be fetched from Dictionaries.
     * @param replacers
     *   If an object of strings is set here, it will be used to replace any
     *   placeholders in the text provided above.
     * @param type
     *   Type of console log to print.
     * @param locale
     *   Set the locale to determine the language.
     */
    static log(message, replacers = undefined, type = 'default', locale = process.env.DEFAULT_LOCALE) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch translations of output.
            let output = yield Yoshida_1.default.translate(message, replacers, locale);
            // Depending on the type, we send different types of outputs.
            switch (type) {
                // Status messages.
                case 'status': {
                    console.log(output.status);
                    break;
                }
                // Warning messages.
                case 'warning': {
                    console.log(output.warning);
                    break;
                }
                // Success messages.
                case 'success': {
                    console.log(output.success);
                    break;
                }
                // Error messages.
                case 'error': {
                    // Send default error message.
                    console.log(output.error);
                    break;
                }
                // By default, do a regular log.
                default: {
                    console.log(output);
                    break;
                }
            }
        });
    }
    /**
     * Shortcut function to send a success message.
     * @inheritDoc
     */
    static success(message, replacers = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the message is not set, we'll fetch the default success message.
            message = message || 'SUCCESS';
            yield this.log(message, replacers, 'success');
        });
    }
    /**
     * Shortcut function to set a status message.
     * @inheritDoc
     */
    static status(message, replacers = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.log(message, replacers, 'status');
        });
    }
    /**
     * Shortcut function to set a warning message.
     * @inheritDoc
     */
    static warn(message, replacers = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.log(message, replacers, 'warning');
        });
    }
    /**
     * Shortcut function to set a error message.
     * @inheritDoc
     */
    static error(message, replacers = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the message is not set, we'll fetch the default error message.
            message = message || 'ERROR';
            yield this.log(message, replacers, 'error');
        });
    }
}
exports.default = Morgana;
