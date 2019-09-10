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
/**
 * Right now she is quite literally a copy paste of the good old legendary MaidenCooldownManager.
 *
 * NEEDS A REVAMP. @TODO
 */
class Makoto {
    /**
     * Constructor for the CooldownManager class.
     * Takes the client of the bot as an argument.
     */
    static build() {
        return __awaiter(this, void 0, void 0, function* () {
            // Instantiate the cooldowns object.
            this.cooldowns = {}; // @TODO - Save cooldowns in a database file.
        });
    }
    /**
     * Set a cooldown for a given command, scope and duration.
     * @param bot
     * @param {String}          type     Type of cooldown.
     * @param {String}          key      Key of the cooldown being set. i.e. For a command, we'll set the command key.
     * @param {String/Number}   scope    Who does this cooldown restrict? i.e. For a user, it's their ID.
     * @param {Number}          duration Lifetime of the cooldown.
     */
    static set(bot, type, key, scope, duration) {
        if (!(bot in this.cooldowns)) {
            this.cooldowns[bot] = {};
        }
        // Set object for this cooldown type if it doesn't exist.
        if (!(type in this.cooldowns[bot])) {
            this.cooldowns[bot][type] = {};
        }
        // Initialize array for this cooldown key if it doesn't exist.
        if (!(key in this.cooldowns[bot][type])) {
            this.cooldowns[bot][type][key] = [];
        }
        // Set the cooldown into the array.
        this.cooldowns[bot][type][key].push(scope);
        // Start the countdown for the duration.
        // Note: Not sure why I use a promise here. I think I wanted to be cool. ¯\_(ツ)_/¯
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.unset(bot, type, key, scope);
                resolve("Remove cooldown now!"); // Yay! Everything went well!
                reject("Something went wrong!"); // Ugh...
            }, duration);
        });
    }
    /**
     * Unset a cooldown for a given command, user and scope.
     * @param bot
     * @param {String}          type     Type of cooldown.
     * @param {String}          key      Key of the cooldown being set. i.e. For a command, we'll set the command key.
     * @param {String/Number}  scope    Who does this cooldown restrict? i.e. For a user, it's their ID.
     */
    static unset(bot, type, key, scope) {
        // Remove the cooldown.
        this.cooldowns[bot][type][key].splice(this.cooldowns[bot][type][key].indexOf(scope), 1);
    }
    /**
     * Check if a cooldown exists with the given parameters.
     * @param bot
     * @param {String}          type     Type of cooldown.
     * @param {String}          key      Key of the cooldown being set. i.e. For a command, we'll set the command key.
     * @param {String/Number}  scope    Who does this cooldown restrict? i.e. For a user, it's their ID.
     */
    static check(bot, type, key, scope) {
        if (!(bot in this.cooldowns)) {
            return false;
        }
        // If the type isn't set, then the cooldown surely isn't set.
        // For example, if a command is called,
        // but the 'cooldown' type isn't found, then there are no cooldowns for commands at all.
        if (!(type in this.cooldowns[bot])) {
            return false;
        }
        // If the key isn't set, then the cooldown surely isn't set.
        // For example, if for the ping command,
        // the key 'ping' isn't found, then there are no cooldowns for the ping command.
        if (!(key in this.cooldowns[bot][type])) {
            return false;
        }
        // Returns whether or not the cooldown exists.
        return this.cooldowns[bot][type][key].indexOf(scope) > -1;
    }
}
exports.default = Makoto;
